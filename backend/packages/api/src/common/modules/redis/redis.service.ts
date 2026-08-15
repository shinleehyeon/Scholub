import { RedisService as NestRedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor(private readonly redisService: NestRedisService) {
    this.client = this.redisService.getOrThrow();
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      return this.client.set(key, value, 'EX', ttlSeconds);
    }

    return this.client.set(key, value);
  }

  async del(key: string) {
    return this.client.del(key);
  }

  async hget(key: string, field: string) {
    return this.client.hget(key, field);
  }

  async hgetall(key: string) {
    return this.client.hgetall(key);
  }

  async hset(key: string, field: string, value: string) {
    return this.client.hset(key, field, value);
  }

  async hmset(key: string, values: Record<string, unknown>) {
    return this.client.hmset(key, values);
  }

  async sadd(key: string, member: string) {
    return this.client.sadd(key, member);
  }

  async scard(key: string) {
    return this.client.scard(key);
  }

  async sismember(key: string, value: string) {
    return this.client.sismember(key, value);
  }

  async srem(key: string, value: string) {
    return this.client.srem(key, value);
  }

  async smembers(key: string) {
    return this.client.smembers(key);
  }

  async expire(key: string, ttlSeconds: number) {
    return this.client.expire(key, ttlSeconds);
  }

  async ttl(key: string) {
    return this.client.ttl(key);
  }

  multi() {
    return this.client.multi();
  }

  async flushdb() {
    return this.client.flushdb();
  }
}
