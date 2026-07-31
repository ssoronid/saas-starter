import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

type Db = ReturnType<typeof drizzle<typeof schema>>;

let instance: Db | null = null;

function connect(): Db {
  if (instance) return instance;

  // Vercel's Neon integration injects DATABASE_URL. POSTGRES_URL is kept as a
  // fallback for local setups and for databases provisioned the old way.
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!url) {
    throw new Error('DATABASE_URL (or POSTGRES_URL) environment variable is not set');
  }

  instance = drizzle(postgres(url), { schema });
  return instance;
}

// Connected lazily: `next build` imports every route module while collecting
// page data, and that must not throw on a machine without database env vars.
export const db = new Proxy({} as Db, {
  get(_target, prop) {
    const real = connect() as unknown as Record<PropertyKey, unknown>;
    const value = real[prop];
    return typeof value === 'function' ? (value as (...a: unknown[]) => unknown).bind(real) : value;
  },
});
