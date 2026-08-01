#!/usr/bin/env node
/**
 * Apply pending migrations during the Vercel build.
 *
 * A one-click deploy provisions an empty database, so without this the app
 * ships green and then fails on the first query. Skipped when no database is
 * configured, so builds without one still succeed.
 */
import { execSync } from 'child_process';

const url =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.STORAGE_DATABASE_URL ??
  process.env.STORAGE_POSTGRES_URL;

if (!url) {
  console.log('[migrate] No database URL set — skipping migrations.');
  process.exit(0);
}

// drizzle.config.ts reads the same chain; normalize so drizzle-kit sees it.
process.env.DATABASE_URL = url;

try {
  console.log('[migrate] Applying migrations...');
  execSync('drizzle-kit migrate', { stdio: 'inherit' });
  console.log('[migrate] Done.');
} catch (err) {
  console.error('[migrate] Migration failed:', err.message);
  process.exit(1);
}
