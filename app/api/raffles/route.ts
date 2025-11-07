import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

export async function POST(req: Request){
  const body = await req.json()
  if(!body?.title || !body?.slug || !body?.price || !body?.total) {
    return NextResponse.json({ ok:false, error:'Faltan datos' }, { status: 400 })
  }

  try{
    const raffle = await prisma.raffle.create({
      data: {
        title: body.title,
        slug: body.slug,
        priceCents: Number(body.price),
        totalNumbers: Number(body.total),
        status: 'ACTIVE'
      }
    })

    // Crear tickets 1..totalNumbers
    const tickets = Array.from({length: raffle.totalNumbers})
      .map((_,i)=>({ raffleId: raffle.id, number: i+1 }))

    // Insertar en tandas para no pasarnos de límite
    for (let i=0;i<tickets.length;i+=250){
      await prisma.ticket.createMany({ data: tickets.slice(i, i+250), skipDuplicates: true })
    }

    return NextResponse.json({ ok:true, raffle })
  }catch(e:any){
    return NextResponse.json({ ok:false, error:e.message })
  }
}
