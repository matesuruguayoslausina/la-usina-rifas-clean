import { prisma } from '../../../lib/db'
import Link from 'next/link'
import RifaClient from './rifa-client'

export default async function Rifa({ params }: { params: { slug: string } }){
  const raffle = await prisma.raffle.findUnique({ where: { slug: params.slug }})
  if(!raffle) return <div className="card"><h1>Rifa no encontrada</h1><Link href="/">Volver</Link></div>
  return (
    <div className="card">
      <h1 style={{marginTop:0}}>{raffle.title}</h1>
      <p>Precio por número: ${ (raffle.priceCents/100).toLocaleString('es-AR') } ARS</p>
      <RifaClient raffleId={raffle.id} slug={raffle.slug} price={raffle.priceCents} total={raffle.totalNumbers} title={raffle.title} />
    </div>
  )
}
