'use client'
import { useState } from 'react'

export default function Admin(){
  const [form, setForm] = useState({ title:'Rifa de ejemplo', slug:'rifa-ejemplo', price:'3500', total:'100' })
  const [loading, setLoading] = useState(false)
  const create = async ()=>{
    setLoading(true)
    const res = await fetch('/api/raffles', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({
      title: form.title, slug: form.slug, price: Math.round(parseFloat(form.price)*100), total: parseInt(form.total,10)
    })})
    const data = await res.json()
    setLoading(false)
    alert(data.ok ? 'Rifa creada' : ('Error: '+data.error))
  }
  return (
    <div className="card">
      <h1>Panel admin (MVP)</h1>
      <div className="row">
        <div>
          <div className="label">Título</div>
          <input className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
        </div>
        <div>
          <div className="label">Slug</div>
          <input className="input" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})}/>
        </div>
        <div>
          <div className="label">Precio (ARS)</div>
          <input className="input" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
        </div>
        <div>
          <div className="label">Total de números</div>
          <input className="input" value={form.total} onChange={e=>setForm({...form,total:e.target.value})}/>
        </div>
        <button className="button" disabled={loading} onClick={create}>{loading?'Creando...':'Crear rifa'}</button>
      </div>
      <p style={{opacity:.7, marginTop:12}}>Tip: luego abrí <code>/rifa/[slug]</code> para verla.</p>
    </div>
  )
}
