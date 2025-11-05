'use client'
import { useEffect, useMemo, useState } from 'react'

type State = 'available' | 'reserved' | 'sold'
type MapState = Record<number, State>

export default function Client({ raffleId, slug, price, total, title }: { raffleId: string; slug: string; price: number; total: number; title: string }){
  const [map, setMap] = useState<MapState>({})
  const [selected, setSelected] = useState<number[]>([])
  const [left, setLeft] = useState<number>(600)
  const [email, setEmail] = useState<string>('')

  const refresh = async ()=>{
    const res = await fetch(`/api/state/${slug}`, { cache: 'no-store' })
    const data = await res.json()
    setMap(data.map)
  }
  useEffect(()=>{ refresh(); const t = setInterval(refresh, 5000); return ()=>clearInterval(t)}, [])

  const toggle = async (n:number)=>{
    if(map[n] === 'sold') return
    if(selected.includes(n)){
      setSelected(prev => prev.filter(x => x!==n))
      await fetch('/api/holds', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ raffleId, numbers:[n] }) })
    } else {
      const res = await fetch('/api/holds', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ raffleId, numbers:[n] }) })
      const data = await res.json()
      if(data.reserved.includes(n)) {
        setSelected(prev => [...prev, n])
        setLeft(600)
      } else {
        alert('Ese número está siendo reservado por otra persona. Elegí otro.')
      }
    }
  }

  useEffect(()=>{
    if(selected.length===0) return
    const t = setInterval(()=> setLeft(v => Math.max(0, v-1)), 1000)
    return ()=>clearInterval(t)
  }, [selected.length])

  const formattedLeft = useMemo(()=>{
    const m = Math.floor(left/60).toString().padStart(2,'0')
    const s = (left%60).toString().padStart(2,'0')
    return `${m}:${s}`
  }, [left])

  const pay = async ()=>{
    if(!email) { alert('Ingresá tu email para la confirmación'); return }
    const res = await fetch('/api/checkout', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ raffleId, email, numbers: selected }) })
    const data = await res.json()
    if(!data.init_point) { alert('No se pudo iniciar el pago'); return }
    window.location.href = data.init_point
  }

  const cells = []
  for(let i=1;i<=total;i++){
    const state = selected.includes(i) ? 'seleccionado' : (map[i]==='sold' ? 'vendido' : (map[i]==='reserved' ? 'reserva' : 'disponible'))
    cells.push(<div key={i} className={['cell', state].join(' ')} onClick={()=>toggle(i)}>{i}</div>)
  }

  return (
    <div>
      <div className="row">
        <div className="card" style={{flex:'1 1 auto'}}>
          <div className="row" style={{justifyContent:'space-between'}}>
            <div><b>Estado:</b> <span className="badge">Abierta</span></div>
            <div><b>Precio:</b> ${ (price/100).toLocaleString('es-AR') } ARS</div>
          </div>
          {selected.length>0 && <p className="timer">Tus números están reservados por: <b>{formattedLeft}</b></p>}
          <div className="grid">{cells}</div>
        </div>
        <div className="card" style={{width:320}}>
          <h3>Resumen</h3>
          <p>Elegidos: <b>{selected.length}</b></p>
          <p>Total: <b>${ ((selected.length*price)/100).toLocaleString('es-AR') } ARS</b></p>
          <div className="label">Tu email</div>
          <input className="input" placeholder="tuemail@ejemplo.com" value={email} onChange={e=>setEmail(e.target.value)}/>
          <button className="button" onClick={pay} disabled={selected.length===0}>Pagar ahora</button>
          <p style={{opacity:.7}}>Los números quedan bloqueados por 10 minutos mientras completás el pago.</p>
        </div>
      </div>
    </div>
  )
}
