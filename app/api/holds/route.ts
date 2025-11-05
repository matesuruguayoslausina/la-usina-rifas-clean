import { NextResponse } from 'next/server'
import { redis, holdKey } from '@/lib/redis'

export async function POST(req: Request){
  const { raffleId, numbers } = await req.json()
  if(!raffleId || !Array.isArray(numbers)) return NextResponse.json({ reserved:[], failed: numbers || []})
  const reserved:number[] = []
  const failed:number[] = []
  for(const n of numbers){
    const ok = await redis.set(holdKey(raffleId, n), '1', { nx: true, ex: 600 })
    if(ok) reserved.push(n); else failed.push(n)
  }
  return NextResponse.json({ reserved, failed })
}

export async function DELETE(req: Request){
  const { raffleId, numbers } = await req.json()
  if(raffleId && Array.isArray(numbers)){
    const keys = numbers.map((n:number)=>holdKey(raffleId,n))
    if(keys.length) await redis.del(...keys)
  }
  return NextResponse.json({ ok:true })
}
