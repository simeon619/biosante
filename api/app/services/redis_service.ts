import { Redis } from 'ioredis'
import env from '#start/env'

export class RedisService {
    private client: Redis

    constructor() {
        this.client = new Redis({
            host: env.get('REDIS_HOST', '127.0.0.1'),
            port: env.get('REDIS_PORT', 6379),
            password: env.get('REDIS_PASSWORD'),
        })
    }

    async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
        if (ttlSeconds) {
            await this.client.set(key, value, 'EX', ttlSeconds)
        } else {
            await this.client.set(key, value)
        }
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key)
    }

    async del(key: string): Promise<number> {
        return await this.client.del(key)
    }

    /**
     * Store an OTP for a phone number
     */
    async storeOtp(phone: string, otp: string): Promise<void> {
        await this.set(`otp:${phone}`, otp, 300) // 5 minutes TTL
    }

    /**
     * Verify an OTP for a phone number
     */
    async verifyOtp(phone: string, otp: string): Promise<boolean> {
        const storedOtp = await this.get(`otp:${phone}`)
        if (storedOtp === otp) {
            await this.del(`otp:${phone}`)
            return true
        }
        return false
    }
}

export const redisService = new RedisService()
