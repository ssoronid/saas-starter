import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { resolveDatabaseUrl } from './resolve-db-url';
import dotenv from 'dotenv';

dotenv.config();

type Db = ReturnType<typeof drizzle<typeof schema>>;

let instance: Db | null = null;

function connect(): Db {
  if (instance) return instance;

  const url = resolveDatabaseUrl();
  if (!url) {
    throw new Error(
      'No Postgres connection string found. Set DATABASE_URL — Marketplace-prefixed names (STORAGE_URL, NEON_DATABASE_URL, …) are detected automatically.'
    );
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
