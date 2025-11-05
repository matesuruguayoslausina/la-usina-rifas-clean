import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendConfirmationEmail } from '@/lib/email'

export async function POST(req: Request){
  const body = await req.json().catch(()=>null)
  const topic = (body?.type || body?.topic || '').toString()
  const dataId = body?.data?.id || body?.data?.resource || body?.id
  if(topic && !topic.includes('payment')) return NextResponse.json({ ok:true })

  try{
    const mpPaymentId = String(dataId || 'unknown')
    const orders = await prisma.order.findMany({ where: { status: 'PENDING' }, orderBy: { createdAt: 'desc' }, take: 50 })
    const order = orders[0]
    if(!order) return NextResponse.json({ ok:true })
    if(order.mpPaymentId) return NextResponse.json({ ok:true })

    await prisma.$transaction(async (tx)=>{
      await tx.order.update({ where: { id: order.id }, data: { status:'APPROVED', mpPaymentId } })
      await tx.ticket.updateMany({
        where: { raffleId: order.raffleId, number: { in: order.numbers }, status: 'AVAILABLE' },
        data: { status: 'SOLD', buyerEmail: order.buyerEmail, orderId: order.id }
      })
    })

    const raffle = await prisma.raffle.findUnique({ where: { id: order.raffleId } })
    if(raffle){
      await sendConfirmationEmail(order.buyerEmail, { title: raffle.title, numbers: order.numbers, amount: order.amountCents, orderId: order.id })
    }

    return NextResponse.json({ ok:true })
  }catch(e:any){
    return NextResponse.json({ ok:false, error:e.message }, { status: 500 })
  }
}
