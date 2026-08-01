/**
 * Locate the Postgres connection string regardless of how it was injected.
 *
 * Vercel Marketplace database integrations (Neon et al.) let the person
 * deploying pick a custom env-var prefix (STORAGE, NEON, anything), so the
 * URL can arrive as DATABASE_URL, STORAGE_URL, NEON_POSTGRES_URL, … A fixed
 * name list breaks the moment someone types their own prefix — scan instead.
 *
 * scripts/migrate.mjs carries a plain-JS copy of this logic (it runs before
 * any TS toolchain is available); keep the two in sync.
 */

const EXACT_NAMES = ['DATABASE_URL', 'POSTGRES_URL'];
const SUFFIXES = ['_DATABASE_URL', '_POSTGRES_URL', '_URL'];

function isPostgresUrl(value: string | undefined): value is string {
  return !!value && /^postgres(ql)?:\/\//.test(value);
}

export function resolveDatabaseUrl(
  env: Record<string, string | undefined> = process.env
): string | undefined {
  for (const name of EXACT_NAMES) {
    if (env[name]) return env[name];
  }

  // Pooled URLs first — the runtime should not hold direct connections.
  const keys = Object.keys(env).sort();
  for (const nonPooling of [false, true]) {
    for (const suffix of SUFFIXES) {
      for (const key of keys) {
        if (!key.endsWith(suffix)) continue;
        if (/NON_POOLING|UNPOOLED/.test(key) !== nonPooling) continue;
        if (isPostgresUrl(env[key])) return env[key];
      }
    }
  }

  // Last resort: anything that looks like a Postgres connection string.
  for (const key of keys) {
    if (isPostgresUrl(env[key])) return env[key];
  }

  return undefined;
}
