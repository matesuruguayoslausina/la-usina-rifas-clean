import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { mp } from '../../../lib/mp'
import { redis, holdKey } from '../../../lib/redis'

export async function POST(req: Request){
  const { raffleId, email, numbers } = await req.json()
  if(!raffleId || !email || !Array.isArray(numbers) || numbers.length===0)
    return NextResponse.json({ error:'Datos inválidos' }, { status: 400 })

  const raffle = await prisma.raffle.findUnique({ where: { id: raffleId } })
  if(!raffle) return NextResponse.json({ error:'Rifa no encontrada' }, { status: 404 })

  for(const n of numbers){
    const v = await redis.get(holdKey(raffleId, n))
    if(!v) return NextResponse.json({ error:`El número ${n} ya no está reservado.` }, { status: 409 })
  }

  const amountCents = raffle.priceCents * numbers.length
  const order = await prisma.order.create({
    data: { raffleId: raffle.id, buyerEmail: email, amountCents, numbers }
  })

  const base = process.env.NEXT_PUBLIC_BASE_URL || ''
  const preference = await (await mp).preferences.create({
    body: {
      items: [{
        id: order.id,
        title: raffle.title,
        quantity: numbers.length,
        currency_id: process.env.CURRENCY || 'ARS',
        unit_price: raffle.priceCents / 100
      }],
      payer: { email },
      back_urls: {
        success: `${base}/rifa/${raffle.slug}?ok=1`,
        failure: `${base}/rifa/${raffle.slug}?fail=1`,
        pending: `${base}/rifa/${raffle.slug}?pending=1`
      },
      auto_return: 'approved',
      notification_url: `${base}/api/mp/webhook`
    }
  })

  await prisma.order.update({ where: { id: order.id }, data: { mpPreference: preference.id } })
  return NextResponse.json({ init_point: preference.init_point })
}
