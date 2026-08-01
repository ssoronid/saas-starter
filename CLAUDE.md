# saas-starter

Next.js + React + Drizzle + Tailwind SaaS boilerplate. Part of the repofast monorepo. Check `package.json` for exact versions — this repo's dependencies are bumped to latest-stable independently of this file, so don't cite a version from prose here.

## Stack

- **Framework**: Next.js App Router, Turbopack, React
- **DB**: Drizzle ORM + `postgres` driver (works with Neon, Supabase DB, Railway, any Postgres URL) — this is the one constant; it doesn't swap per bake the way auth/payments/storage do.
- **Auth**: Custom JWT (jose + bcryptjs) by default — swappable via auth-* extensions (`auth-supabase`, `auth-clerk`; `auth-nextauth` is offered by the configurator UI but has no extension folder yet — don't assume it works). **This checkout's default is JWT — verify `lib/auth`'s actual implementation before telling a user "this uses Supabase/Clerk," since that's a per-bake choice, not a property of the template.**
- **Payments**: Stripe by default — swappable via payments-* extensions (`payments-mercadopago`, `payments-none`).
- **Storage**: none by default — swappable via storage-* extensions (`storage-supabase`, `storage-s3`).
- **Email**: Resend + react-email
- **UI**: shadcn/ui (new-york, zinc) + Tailwind CSS
- **Analytics**: PostHog (optional, no-op without key)

## Lib contracts — NEVER bypass these

App code must always import from the contract path, never from the provider file directly.
This is what makes extensions swappable.

| Contract | Import path | Swapped by |
|---|---|---|
| Auth | `@/lib/auth` | `auth-supabase`, `auth-clerk`, `auth-nextauth` |
| Payments | `@/lib/payments` | `payments-mercadopago` |
| Storage | `@/lib/storage` | `storage-supabase`, `storage-s3` |

```ts
// CORRECT
import { getSession, withTeam } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/payments'
import { upload, getUrl } from '@/lib/storage'

// WRONG — breaks extension swapping
import { getSession } from '@/lib/auth/session'
import { createCheckoutSession } from '@/lib/payments/stripe'
```

## DB schema rules

- Schema lives in `lib/db/schema.ts`. Never edit migration files by hand.
- Run `pnpm db:generate` after schema changes, then `pnpm db:migrate`.
- `teams` table holds generic billing fields only: `planName`, `subscriptionStatus`, `billingProvider`.
- Stripe-specific data lives in `stripe_data` table (1:1 with teams). MercadoPago uses `mp_data` when injected.
- Users use soft-delete (`deletedAt`). Never hard-delete a user row.

## Auth flow (default JWT — only true when auth=jwt)

1. Sign up/in → `app/(login)/actions.ts` server actions
2. bcryptjs hashes password, jose creates JWT stored in httpOnly `session` cookie
3. Global `middleware.ts` protects `/dashboard` routes and auto-refreshes token on every GET
4. `getUser()` in `lib/db/queries.ts` reads session and fetches user from DB

If an auth-* extension has been injected, this flow is replaced (a Supabase-baked checkout has no `hashPassword`/`signToken` — those throw "not used with this provider" stubs; see the extension's `session.ts`). Read `lib/auth/session.ts` in the actual checkout before assuming this JWT flow applies.

## Route structure

```
app/
├── (dashboard)/   ← protected, requires session
├── (login)/       ← public auth pages
└── api/
    ├── stripe/    ← checkout callback + webhook
    ├── user/      ← GET current user (used by useUser hook)
    └── team/      ← GET current team (used by useTeam hook)
```

## Hooks (client components only)

```ts
import { useUser } from '@/hooks/use-user'
import { useTeam } from '@/hooks/use-team'
import { useFormAction } from '@/hooks/use-action-state'
```

## Adding shadcn components

```bash
npx shadcn@latest add <component>
```

Components live in `components/ui/`. Style: new-york, base color: zinc.

## How this template gets published

This directory is the **source of truth**. The public deploy-button repo (`ssoronid/saas-starter` — main + 144 `v-*` variant branches) is generated from it by `scripts/publish-variants.ts` at the repofast root (`pnpm publish:dry` to preview, `pnpm publish:all` to ship). Never edit the public repo directly — including its README, which is published from this folder's README.md. The configurator's ZIP path bakes from this same directory, so template edits reach both distribution channels once published.

## Injecting extensions (run from repofast root)

```bash
pnpm inject auth-supabase saas-starter
pnpm inject payments-mercadopago saas-starter
pnpm inject storage-supabase saas-starter
pnpm inject i18n-next-intl saas-starter
```

## Dev commands

```bash
pnpm dev          # starts Next.js with Turbopack
pnpm db:setup     # interactive setup (creates .env, Stripe webhook, seeds DB)
pnpm db:generate  # generate Drizzle migration after schema change
pnpm db:migrate   # run pending migrations
pnpm db:studio    # Drizzle Studio GUI
pnpm db:seed      # seed test user + Stripe products
```
