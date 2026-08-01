# Next.js SaaS Starter

This is a starter template for building a SaaS application using **Next.js** with support for authentication, Stripe integration for payments, and a dashboard for logged-in users.

## Deploy in one click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fssoronid%2Fsaas-starter&env=AUTH_SECRET&envDescription=A%20random%2032%2B%20character%20secret%20used%20to%20sign%20session%20cookies.&envLink=https%3A%2F%2Fgithub.com%2Fssoronid%2Fsaas-starter%23environment-variables&stores=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22neon%22%2C%22productSlug%22%3A%22neon%22%2C%22protocol%22%3A%22storage%22%7D%5D&integration-ids=oac_KfIFnjXqCl4YJCHnt1bDTBI1&skippable-integrations=1)

This clones the repo into your own Vercel account and provisions a [Neon](https://neon.com/) Postgres database alongside it, so `DATABASE_URL` is wired up for you. The only value you supply is `AUTH_SECRET`.

## Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `AUTH_SECRET` | yes | Signs session cookies. Must be 32+ characters — generate with `openssl rand -hex 32`. |
| `DATABASE_URL` | yes | Injected automatically by the Neon integration. `STORAGE_URL` (the Marketplace field's own default prefix) and `POSTGRES_URL` are checked next; any other custom prefix still works via a scan for `*_DATABASE_URL` / `*_POSTGRES_URL` / `*_URL` values that are Postgres connection strings. |
| `BASE_URL` | no | Defaults to the deployment URL. Set to `http://localhost:3000` locally. |
| `STRIPE_SECRET_KEY` | no | Payments stay dormant until this is set. |
| `STRIPE_WEBHOOK_SECRET` | no | Needed only once you wire up the Stripe webhook. |
| `RESEND_API_KEY` | no | Team invitation emails are skipped when absent. `STORAGE_RESEND_API_KEY` and any other `*_RESEND_API_KEY` custom prefix are detected automatically. |

Migrations run automatically on every Vercel build (`vercel-build`), so the schema is created on the first deploy. Locally, run them yourself:

```bash
pnpm db:migrate
```

### Without payments

The [`no-payments`](https://github.com/ssoronid/saas-starter/tree/no-payments) branch drops Stripe entirely and keeps the JWT-authenticated dashboard — useful for non-commercial projects. Deploy it directly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fssoronid%2Fsaas-starter%2Ftree%2Fno-payments&env=AUTH_SECRET&envDescription=A%20random%2032%2B%20character%20secret%20used%20to%20sign%20session%20cookies.&envLink=https%3A%2F%2Fgithub.com%2Fssoronid%2Fsaas-starter%23environment-variables&stores=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22neon%22%2C%22productSlug%22%3A%22neon%22%2C%22protocol%22%3A%22storage%22%7D%5D&integration-ids=oac_KfIFnjXqCl4YJCHnt1bDTBI1&skippable-integrations=1)

## Features

- Marketing landing page (`/`) with animated Terminal element
- Pricing page (`/pricing`) which connects to Stripe Checkout
- Dashboard pages with CRUD operations on users/teams
- Basic RBAC with Owner and Member roles
- Subscription management with Stripe Customer Portal
- Email/password authentication with JWTs stored to cookies
- Global middleware to protect logged-in routes
- Local middleware to protect Server Actions or validate Zod schemas
- Activity logging system for any user events

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Postgres](https://www.postgresql.org/)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **Payments**: [Stripe](https://stripe.com/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)

## Connector inventory

This table is the human-readable view of what the template wires together. The monorepo keeps machine-readable catalogs in `sync/catalogs.json` (see [Agent verification](#agent-verification)).

| Connector | Role | Primary code |
| --- | --- | --- |
| Postgres + Drizzle | App data | `lib/db/drizzle.ts`, `lib/db/schema.ts`, `lib/db/queries.ts` |
| JWT + cookies (`jose`, `bcryptjs`) | Sessions | `lib/auth/session.ts`, `middleware.ts` |
| Stripe | Checkout, portal, webhooks | `lib/payments/stripe.ts`, `app/api/stripe/*` |
| Resend | Transactional email (e.g. invitations) | `lib/email/send-invitation.ts` |
| SWR | Client cache for `/api/user` and `/api/team` | `app/layout.tsx`, `app/(dashboard)/layout.tsx` |
| Server Actions | Mutations with Zod | `app/(login)/actions.ts`, `lib/payments/actions.ts` |
| Route Handlers | JSON APIs + Stripe | `app/api/user/route.ts`, `app/api/team/route.ts`, `app/api/stripe/*/route.ts` |
| PostHog (optional) | Product analytics | `lib/extensions/posthog/` (no-op without `NEXT_PUBLIC_POSTHOG_KEY`) |

**Not included:** global in-app notifications or a toast library (no Sonner / react-hot-toast). Forms use server `ActionState` return values; add a toast stack if you want ambient notifications.

## Agent verification

Catalogs and the root README matrix are generated from the **monorepo root** (`repofast/`), not inside this folder.

1. From the repo root: `pnpm verify` — scans every `templates/*/` app (theme), writes `sync/catalogs.json` (one catalog per template), and prints the analyzer JSON report.
2. To refresh the root README feature matrix: `pnpm analyze --mode=readme` (same scanner; adds the markdown table to the root `README.md`).
3. For a production check of this app only, from `templates/saas-starter/`: `pnpm build`.
4. After you add or remove a connector, update the **Connector inventory** table above. If the change is generic (new ORM, auth lib, toast package), extend `scripts/template-catalog-lib.ts` at the monorepo root so all themes stay accurate.
5. PostHog sources live at repo root `extensions/posthog/`. After editing them, run `pnpm inject posthog saas-starter` from the monorepo root to refresh `lib/extensions/posthog/` here.

Cursor: enable the rule **template-inventory** at the repo root (`.cursor/rules/template-inventory.mdc`, globs `templates/**`) when editing this template.

## Getting Started

```bash
git clone https://github.com/nextjs/saas-starter
cd saas-starter
pnpm install
```

## Running Locally

[Install](https://docs.stripe.com/stripe-cli) and log in to your Stripe account:

```bash
stripe login
```

Use the included setup script to create your `.env` file:

```bash
pnpm db:setup
```

Run the database migrations and seed the database with a default user and team:

```bash
pnpm db:migrate
pnpm db:seed
```

This will create the following user and team:

- User: `test@test.com`
- Password: `admin123`

You can also create new users through the `/sign-up` route.

Finally, run the Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

You can listen for Stripe webhooks locally through their CLI to handle subscription change events:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Testing Payments

To test Stripe payments, use the following test card details:

- Card Number: `4242 4242 4242 4242`
- Expiration: Any future date
- CVC: Any 3-digit number

## Going to Production

When you're ready to deploy your SaaS application to production, follow these steps:

### Set up a production Stripe webhook

1. Go to the Stripe Dashboard and create a new webhook for your production environment.
2. Set the endpoint URL to your production API route (e.g., `https://yourdomain.com/api/stripe/webhook`).
3. Select the events you want to listen for (e.g., `checkout.session.completed`, `customer.subscription.updated`).

### Deploy to Vercel

1. Push your code to a GitHub repository.
2. Connect your repository to [Vercel](https://vercel.com/) and deploy it.
3. Follow the Vercel deployment process, which will guide you through setting up your project.

### Add environment variables

In your Vercel project settings (or during deployment), add all the necessary environment variables. Make sure to update the values for the production environment, including:

1. `BASE_URL`: Set this to your production domain.
2. `STRIPE_SECRET_KEY`: Use your Stripe secret key for the production environment.
3. `STRIPE_WEBHOOK_SECRET`: Use the webhook secret from the production webhook you created in step 1.
4. `POSTGRES_URL`: Set this to your production database URL.
5. `AUTH_SECRET`: Set this to a random string. `openssl rand -base64 32` will generate one.

## Other Templates

While this template is intentionally minimal and to be used as a learning resource, there are other paid versions in the community which are more full-featured:

- https://achromatic.dev
- https://shipfa.st
- https://makerkit.dev
- https://zerotoshipped.com
- https://turbostarter.dev
