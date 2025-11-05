import { Redis } from "@upstash/redis";
export const redis = Redis.fromEnv();
export const holdKey = (raffleId:string, n:number) => `hold:${raffleId}:${n}`;
