import { compare, hash } from 'bcryptjs';
import { createHash } from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NewUser } from '@/lib/db/schema';

/** Below this, warn (not throw) — a longer random value from db:setup or `openssl rand -hex 32` is safer. */
const AUTH_SECRET_MIN_LENGTH = 32;

function getAuthSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (secret == null || secret === '') {
    throw new Error(
      'AUTH_SECRET is missing. Set a value in the environment (e.g. run db:setup or openssl rand -hex 32).'
    );
  }
  if (secret.length < AUTH_SECRET_MIN_LENGTH) {
    console.warn(
      `AUTH_SECRET is shorter than the recommended ${AUTH_SECRET_MIN_LENGTH} characters (got ${secret.length}). Deriving a key anyway — for stronger security run: openssl rand -hex 32`
    );
  }
  // Derive a fixed 256-bit key via SHA-256, so any non-empty secret works for
  // HS256 regardless of the raw string's length or encoding.
  return createHash('sha256').update(secret).digest();
}

/** Resolved on first use, not at import — like Stripe, auth stays dormant until
 * configured, so env-less builds (page-data collection imports this module) succeed. */
let cachedKey: Uint8Array | null = null;

function key(): Uint8Array {
  cachedKey ??= getAuthSecretKey();
  return cachedKey;
}

const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string
) {
  return compare(plainTextPassword, hashedPassword);
}

type SessionData = {
  user: { id: number };
  expires: string;
};

export async function signToken(payload: SessionData) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1 day from now')
    .sign(key());
}

export async function verifyToken(input: string) {
  const { payload } = await jwtVerify(input, key(), {
    algorithms: ['HS256'],
  });
  return payload as SessionData;
}

export async function getSession() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;
  return await verifyToken(session);
}

export async function setSession(user: NewUser) {
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session: SessionData = {
    user: { id: user.id! },
    expires: expiresInOneDay.toISOString(),
  };
  const encryptedSession = await signToken(session);
  (await cookies()).set('session', encryptedSession, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });
}
