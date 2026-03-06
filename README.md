# Aashan Web

Multi-tenant e-commerce storefront built with Next.js, Payload CMS, and tRPC.

## Stack

- Next.js (App Router)
- React + TypeScript
- Payload CMS (MongoDB adapter)
- tRPC + TanStack Query
- Clerk authentication
- Tailwind CSS

## Project Structure

- `app/`: Next.js routes and layouts
- `modules/`: feature modules (shop, product, template-theme, etc.)
- `collections/`: Payload collections (`shops`, `templates`, `shop-templates`, etc.)
- `server/`: tRPC server/router setup
- `trpc/`: server/client query utilities
- `config/`: section registry, plans, themes, and typed settings

## Multi-Tenant Template Flow

Tenant storefront route: `app/(app)/(tenant)/shops/[slug]/page.tsx`

1. Resolve shop by `slug`.
2. Fetch `shopTemplate` using `shopId`.
3. Read `baseTemplate` from `shopTemplate.baseTemplate`.
4. Merge base sections with `sectionOverrides`.
5. Resolve final theme/font with override priority:

- `shopTemplate.themeOverride ?? baseTemplate.themePreset`
- `shopTemplate.fontOverride ?? baseTemplate.fontPreset`

6. Render sections via `SectionRenderer`.

### Reusable Section Settings

Section settings are designed to scale beyond navbar:

- `config/sections/types.ts` uses a `SectionSettingsMap`.
- Add future section types (example `hero`, `footer`) by extending that map.
- Normalization is handled through a per-section normalizer registry in tenant page logic.

## tRPC Routers

Main router: `server/routers/_app.ts`

Includes:

- `category`
- `product`
- `tag`
- `shop`
- `template`
- `shopTemplate`

## Payload Collections

Configured in `payload.config.ts`:

- `users`
- `media`
- `categories`
- `products`
- `tags`
- `shops`
- `plans`
- `templates`
- `shop-templates`

Also uses:

- Cloudinary storage plugin for media
- Payload multi-tenant plugin (tenant collection: `shops`)

## Setup

1. Install dependencies

```bash
npm install
```

2. Configure environment variables in `.env`.

At minimum, set values used by Payload/DB/Auth/Storage, such as:

- `DATABASE_URL`
- `PAYLOAD_SECRET`
- Clerk keys
- Cloudinary keys
- SMTP/email variables

3. Run dev server

```bash
npm run dev
```

App runs at `http://localhost:3000`.

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run start` - run production build
- `npm run lint` - run ESLint
- `npm run lint:fix` - fix lint issues
- `npm run test` - run tests
- `npm run generateType` - regenerate `payload-types.ts`
- `npm run vercel-build` - run migrations + build

## Notes for Contributors

- Keep section settings type-safe by updating `SectionSettingsMap` when adding new sections.
- Reuse the section normalizer pattern instead of hardcoding logic for one section type.
- For tenant UI behavior, prefer `shopTemplate` overrides over `baseTemplate` defaults.
