import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.string().default('6379').transform((val) => parseInt(val, 10)),
  REDIS_PASSWORD: z.string().optional().default(''),
  SUPABASE_URL: z.string().url('Invalid SUPABASE_URL format').or(z.string().min(1)),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  OPENROUTER_API_KEY: z.string().min(1, 'OPENROUTER_API_KEY is required for commercial AI models'),
  OPENROUTER_MODEL: z.string().default('openrouter/auto'),
});

export type Env = z.infer<typeof envSchema>;

export const config = envSchema.parse({
  PORT: process.env.PORT || '4000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || '6379',
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://demo-project.supabase.co',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'demo-anon-key',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo-service-role-key',
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || 'sk-or-v1-demo-key',
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || 'openrouter/auto',
});
