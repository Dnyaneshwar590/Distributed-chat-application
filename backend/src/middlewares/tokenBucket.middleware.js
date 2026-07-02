import redis from "../redis/client.redis.js";

const MAX_TOKENS = 5;
const REFILL_RATE = 1;
const REFILL_DURATION = 10; // seconds

export async function tokenBucket(req, res, next) {

    try {
        const username = req.body?.username || req.user?.username;
        const { ip } = req;

        // Unique bucket key
        const key = `token_bucket:${ip}:${username}`;

        // Get bucket from Redis
        const bucket = await redis.get(key);

        let bucketData;
        // New user bucket
        if (!bucket) {

            bucketData = {
                tokens: MAX_TOKENS,
                lastRefill: Date.now()
            };

        } else {
            // Existing bucket
            bucketData = JSON.parse(bucket);
        }

        // Current time
        const now = Date.now();

        // Calculate elapsed time
        const timePassed = (now - bucketData.lastRefill) / 1000;

        // Calculate refill tokens
        const refillTokens = Math.floor(timePassed / REFILL_DURATION) * REFILL_RATE;

        // Refill bucket
        if (refillTokens > 0) {

            bucketData.tokens = Math.min(
                MAX_TOKENS,
                bucketData.tokens + refillTokens
            );
            bucketData.lastRefill = now;
        }

        // No tokens left
        if (bucketData.tokens <= 0) {
            return res.status(429).json({
                success: false,
                message: "Too many requests. Please try again later."
            });
        }

        // Consume one token
        bucketData.tokens -= 1;

        // Save updated bucket to Redis
        await redis.set(
            key,
            JSON.stringify(bucketData),
            "EX",
            60
        );
        next();

    } catch (error) {

        console.error("Token Bucket Rate Limiter Middleware Error:",error.message);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}