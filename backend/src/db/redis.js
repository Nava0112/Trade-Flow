import Redis from "ioredis"

const redis = new Redis(process.env.UPSTASH_REDIS_URL);
await redis.set('foo', 'bar');

export default redis;