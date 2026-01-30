import { createClient, RedisClientType } from 'redis';
import { config } from './environment';

let redisClient: RedisClientType;

export async function initializeRedis(): Promise<RedisClientType | null> {
  try {
    // Skip Redis initialization if URL is not configured or is placeholder
    if (!config.redis.url || config.redis.url.includes('your-upstash-redis')) {
      console.log('⚠️  Redis not configured, skipping Redis initialization');
      return null;
    }

    const redisOptions: any = {
      url: config.redis.url,
    };

    if (config.redis.password) {
      redisOptions.password = config.redis.password;
    }

    redisClient = createClient(redisOptions);

    redisClient.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error);
    console.log('⚠️  Continuing without Redis...');
    return null;
  }
}

export function getRedisClient(): RedisClientType | null {
  return redisClient || null;
}

export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    console.log('✅ Redis connection closed');
  }
}

// Cache helper functions
export const cache = {
  async get(key: string): Promise<string | null> {
    try {
      const client = getRedisClient();
      if (!client) return null;
      return await client.get(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      const client = getRedisClient();
      if (!client) return;
      const options = ttl ? { EX: ttl } : {};
      await client.set(key, value, options);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  },

  async del(key: string): Promise<void> {
    try {
      const client = getRedisClient();
      if (!client) return;
      await client.del(key);
    } catch (error) {
      console.error('Cache del error:', error);
    }
  },

  async exists(key: string): Promise<boolean> {
    try {
      const client = getRedisClient();
      if (!client) return false;
      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  },

  async expire(key: string, ttl: number): Promise<void> {
    try {
      const client = getRedisClient();
      if (!client) return;
      await client.expire(key, ttl);
    } catch (error) {
      console.error('Cache expire error:', error);
    }
  },
};

export { redisClient as default };