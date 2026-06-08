import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Create Redis client instance
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis immediately
redisClient.connect().catch(console.error);

export class CacheService {
  /**
   * Get parsed JSON data from cache
   */
  static async get<T>(key: string): Promise<T | null> {
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
    try {
      await redisClient.del(key);
    } catch (err) {
      console.error(`Cache del error for key ${key}:`, err);
    }
  }
}

export default redisClient;
