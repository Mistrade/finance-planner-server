import { Types } from 'mongoose';

export function generateSessionRedisToken(userId: Types.ObjectId | string, token?: string | null) {
  return `session:${userId.toString()}:${token || '*'}`;
}
