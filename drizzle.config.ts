import type { Config } from 'drizzle-kit';
import { resolveDatabaseUrl } from './lib/db/resolve-db-url';

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: resolveDatabaseUrl()!,
  },
} satisfies Config;
