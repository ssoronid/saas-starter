# AGENTS.md

Vendor-neutral instructions for AI coding agents in this template. See also `CLAUDE.md` — kept in sync by design.

## What this is

Next.js + React + Drizzle + Tailwind SaaS boilerplate, part of the repofast monorepo, and the base template the repofast "configurator" bakes into user projects with a chosen auth/payments/storage provider swapped in. Check `package.json` for exact versions — don't cite a version from prose in this file, it isn't kept pinned.

**Auth, payments, and storage are per-bake choices, not fixed facts about this template.** Default is JWT auth (jose + bcryptjs) + Stripe + no storage. A given checkout may have any of those swapped via an extension. Before writing code against auth/payments/storage, or telling a user what provider "this app uses," check `lib/auth/session.ts` / `lib/payments/*` / `lib/storage/*` directly rather than assuming the default.

Known gap: the configurator offers `auth: nextauth` as a selectable option, but no `extensions/auth-nextauth` exists in the monorepo — selecting it currently no-ops (ships base JWT instead, unwired). If you're in a checkout that's supposed to be NextAuth but looks like plain JWT, this is likely why — verify rather than assume the bake succeeded.

## Lib contracts — never bypass these

Always import from the contract path, never the provider file directly. This is what makes extensions swappable.

| Contract | Import path | Swapped by |
|---|---|---|
| Auth | `@/lib/auth` | `auth-supabase`, `auth-clerk`, (`auth-nextauth` — see gap above) |
| Payments | `@/lib/payments` | `payments-mercadopago`, `payments-none` |
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

- Schema lives in `lib/db/schema.ts`. Never hand-edit a migration file.
- Run `pnpm db:generate` after schema changes, then `pnpm db:migrate`.
- `teams` holds generic billing fields only (`planName`, `subscriptionStatus`, `billingProvider`); provider-specific data lives in its own 1:1 table (`stripe_data`, `mp_data` when injected).
- Users soft-delete (`deletedAt`) — never hard-delete a user row.

## Auth flow — only true for the default (auth=jwt) bake

1. Sign up/in → `app/(login)/actions.ts` server actions.
2. bcryptjs hashes the password, jose creates a JWT stored in an httpOnly `session` cookie.
3. Global `middleware.ts` protects `/dashboard` routes and refreshes the token on every GET.
4. `getUser()` in `lib/db/queries.ts` reads the session and fetches the user row.

A Supabase/Clerk-baked checkout replaces this entirely — read `lib/auth/session.ts` in the actual checkout before assuming the above applies. Password/token helpers (`hashPassword`, `signToken`, etc.) throw "not used with this provider" when a non-JWT auth extension is active; that's intentional, not a bug.

## Route structure

```
app/
├── (dashboard)/   protected, requires session
├── (login)/       public auth pages
└── api/
    ├── stripe/    checkout callback + webhook (payments=stripe)
    ├── user/      GET current user (useUser hook)
    └── team/      GET current team (useTeam hook)
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

Lands in `components/ui/`. Style: new-york, base color: zinc — match `components.json`, don't invent a different style ad hoc.

## How this template gets published

This directory is the **source of truth**. The public deploy-button repo (`ssoronid/saas-starter` — main + 144 `v-*` variant branches) is generated from it by `scripts/publish-variants.ts` at the repofast root (`pnpm publish:dry` to preview, `pnpm publish:all` to ship). Never edit the public repo directly — its README is published from this folder's README.md. The configurator's ZIP path bakes from this same directory, so template edits reach both distribution channels once published.

## Injecting extensions (run from repofast root)

```bash
pnpm inject auth-supabase saas-starter
pnpm inject payments-mercadopago saas-starter
pnpm inject storage-supabase saas-starter
pnpm inject i18n-next-intl saas-starter
```

If you're editing this template as a source for the configurator rather than as a standalone checkout, remember `configurator/assets/templates/saas-starter` is a separate vendored copy — your edit here won't show up there until `pnpm sync-assets` reruns (from `configurator/`) or `configurator/assets/` is deleted.

## Dev commands

```bash
pnpm dev          # Next.js with Turbopack
pnpm db:setup     # interactive setup (.env, Stripe webhook, seed DB)
pnpm db:generate  # generate Drizzle migration after a schema change
pnpm db:migrate   # run pending migrations
pnpm db:studio    # Drizzle Studio GUI
pnpm db:seed      # seed test user + Stripe products
```

## Style

- TypeScript only, server components by default, `"use client"` only when needed.
- No comments explaining *what* — only non-obvious *why*.
