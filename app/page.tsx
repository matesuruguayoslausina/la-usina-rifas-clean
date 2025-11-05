import Link from 'next/link'
import { prisma } from '@/lib/db'

export default async function Home(){
  const raffles = await prisma.raffle.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="row" style={{justifyContent:'space-between'}}>
      <div style={{flex: '1 1 640px'}}>
        <h1>Rifas activas</h1>
        <div className="row">
          {raffles.length === 0 && <p>No hay rifas aún. <Link href="/admin">Crear una</Link></p>}
          {raffles.map(r => (
            <div key={r.id} className="card" style={{width:320}}>
              <h3 style={{marginTop:0}}>{r.title} {r.status === 'ACTIVE' && <span className="badge">Activa</span>}</h3>
              <p>Precio por número: ${ (r.priceCents/100).toLocaleString('es-AR') } ARS</p>
              <Link href={`/rifa/${r.slug}`} className="button">Ver rifa</Link>
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{width:320}}>
        <h3 style={{marginTop:0}}>Cómo funciona</h3>
        <ol>
          <li>Elegís tus números</li>
          <li>Se reservan por 10 min</li>
          <li>Pagás por Mercado Pago</li>
          <li>Te llega mail de confirmación</li>
        </ol>
      </div>
    </div>
  )
}
