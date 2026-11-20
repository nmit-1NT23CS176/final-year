import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.UPSTASH_REDIS_URL || process.env.REDIS_URL;

// Create Redis client instance (supports local Redis or Upstash rediss:// URLs)
let redisClient: ReturnType<typeof createClient> | null = null;

if (redisUrl) {
  redisClient = createClient({
    url: redisUrl,
    socket: {
      reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
      connectTimeout: 5000,
    },
  });

  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  redisClient.connect().catch((err) => console.warn('Redis connection warning:', err.message));
} else {
  console.warn('Neither UPSTASH_REDIS_URL nor REDIS_URL is configured. Cache operations will operate in passthrough mode.');
}

export class CacheService {
  /**
   * Get parsed JSON data from cache
   */
  static async get<T>(key: string): Promise<T | null> {
    if (!redisClient) return null;
    try {
      const data = await redisClient.get(key);
      if (data) return JSON.parse(data) as T;
      return null;
    } catch (err) {
      console.error(`Cache get error for key ${key}:`, err);
      return null;
    }
  }

  /**
   * Set JSON data to cache with expiration
   */
  static async set(key: string, value: any, ttlSeconds: number = 60): Promise<void> {
    if (!redisClient) return;
    try {
      await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch (err) {
      console.error(`Cache set error for key ${key}:`, err);
    }
  }

  /**
   * Delete a key from cache
   */
  static async del(key: string): Promise<void> {
    if (!redisClient) return;
    try {
      await redisClient.del(key);
    } catch (err) {
      console.error(`Cache del error for key ${key}:`, err);
    }
  }
}

export default redisClient;
