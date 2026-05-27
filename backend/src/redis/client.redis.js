import { Redis } from "ioredis"

const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: Number(process.env.REDIS_DB) || 0,
});


redis.on("connect", () => {
    console.log("Connecting to Redis...");
});

redis.on("ready", () => {
    console.log("Redis client is connected and ready!");
});

redis.on("error", (error) => {
    console.error("Redis connection error:", error.message);
});

export default redis;