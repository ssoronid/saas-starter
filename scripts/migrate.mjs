#!/usr/bin/env node
/**
 * Apply pending migrations during the Vercel build.
 *
 * A one-click deploy provisions an empty database, so without this the app
 * ships green and then fails on the first query. Skipped when no database is
 * configured, so builds without one still succeed.
 */
import { execSync } from 'child_process';

// Plain-JS copy of lib/db/resolve-db-url.ts (this runs before any TS
// toolchain exists in the build). Keep the two in sync: Marketplace database
// integrations let the deployer pick ANY env-var prefix, so scan rather than
// hardcode names.
const EXACT_NAMES = ['DATABASE_URL', 'STORAGE_URL', 'POSTGRES_URL'];
const SUFFIXES = ['_DATABASE_URL', '_POSTGRES_URL', '_URL'];
const isPg = (v) => !!v && /^postgres(ql)?:\/\//.test(v);

function resolveDatabaseUrl(env = process.env) {
  for (const name of EXACT_NAMES) {
    if (env[name]) return env[name];
  }
  const keys = Object.keys(env).sort();
  for (const nonPooling of [false, true]) {
    for (const suffix of SUFFIXES) {
      for (const key of keys) {
        if (!key.endsWith(suffix)) continue;
        if (/NON_POOLING|UNPOOLED/.test(key) !== nonPooling) continue;
        if (isPg(env[key])) return env[key];
      }
    }
  }
  for (const key of keys) {
    if (isPg(env[key])) return env[key];
  }
  return undefined;
}

const url = resolveDatabaseUrl();

if (!url) {
  console.log('[migrate] No database URL set — skipping migrations.');
  process.exit(0);
}

// drizzle.config.ts resolves the same way; normalize so drizzle-kit sees it.
process.env.DATABASE_URL = url;

try {
  console.log('[migrate] Applying migrations...');
  execSync('drizzle-kit migrate', { stdio: 'inherit' });
  console.log('[migrate] Done.');
} catch (err) {
  console.error('[migrate] Migration failed:', err.message);
  process.exit(1);
}
