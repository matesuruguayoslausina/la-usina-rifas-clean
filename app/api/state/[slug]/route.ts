- import { prisma } from '@/lib/db'
- import { redis, holdKey } from '@/lib/redis'
+ import { prisma } from '../../../../lib/db'
+ import { redis, holdKey } from '../../../../lib/redis'


export async function GET(_: Request, { params }: { params: { slug: string } }){
  const raffle = await prisma.raffle.findUnique({ where: { slug: params.slug }, include: { tickets: { select: { number:true, status:true } } } })
  if(!raffle) return NextResponse.json({ map:{} })
  const map: Record<number, 'available'|'reserved'|'sold'> = {}

  for(const t of raffle.tickets){
    map[t.number] = t.status === 'SOLD' ? 'sold' : 'available'
  }

  const keys = await redis.keys(`hold:${raffle.id}:*`)
  if(keys && keys.length){
    for(const k of keys){
      const numStr = k.split(':').pop()
      const num = Number(numStr)
      if(!Number.isNaN(num) && map[num] !== 'sold') map[num] = 'reserved'
    }
  }

  return NextResponse.json({ map })
}
