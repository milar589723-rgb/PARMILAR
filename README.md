# PARMILAR — Dark Luxury Fashion Store

Responsive fashion-store starter for iPhone, iPad and desktop. Brand direction: dark / modern luxury streetwear.

## Project setup

- Framework: Next.js 14 + React 18 + TypeScript
- 3D scene: Three.js + React Three Fiber
- Optional backend: Supabase (Postgres, Auth, Storage)
- Currency and market defaults: Laos / LAK
- Planned languages: English, Thai, Lao, Chinese, Vietnamese
- Shipping plan: domestic + international; Anousith Express and Houngaloun Express
- Payment plan: BCEL bank transfer/manual confirmation plus a suitable online gateway after merchant onboarding

## Run locally

Requirements: Node.js 18+ (Node 20 LTS recommended) and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000

```bash
npm run typecheck
npm run build
```

## Main routes

- `/` — dark fashion storefront with an interactive 3D clothing-rack prototype and demo bag counter.
- `/wardrobe` — Supabase-backed horizontal virtual wardrobe with product details and multi-image viewer.
- `/admin/variants?productId=YOUR_PRODUCT_UUID` — starter admin screen for size/color inventory variants. Supabase Auth and admin role must be configured first.

## Main source structure

```text
app/
  admin/variants/page.tsx
  wardrobe/page.tsx
  layout.tsx
  page.tsx
components/
  Storefront.tsx
  VirtualWardrobe.tsx
  Product360Viewer.tsx
  VariantManager.tsx
src/services/
  supabase.ts
  products.ts
  variants.ts
supabase/migrations/
  001_initial.sql
  006_product_variants.sql
public/design-references/
  PARMILAR_Figma_en.svg
  PARMILAR_Figma_th.svg
  PARMILAR_Figma_lo.svg
  PARMILAR_Figma_zh.svg
  PARMILAR_Figma_vi.svg
```

## Supabase setup (optional for the homepage demo)

1. Create a Supabase project.
2. Run `supabase/migrations/001_initial.sql` in the SQL Editor.
3. Run `supabase/migrations/006_product_variants.sql`.
4. Copy `.env.example` to `.env.local`.
5. Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
6. Add products to `public.products` with translated `name` and `description` JSON objects.
7. Configure Supabase Auth and promote your own user to admin manually after signup.

Example translation object:

```json
{
  "en": "Oversized Cotton T-Shirt",
  "th": "เสื้อยืดโอเวอร์ไซซ์",
  "lo": "ເສື້ອຍືດໂອເວີໄຊສ໌",
  "zh": "宽松棉质T恤",
  "vi": "Áo thun cotton dáng rộng"
}
```

## Important implementation status

### Included as starter code
- Dark responsive storefront and interactive Three.js rack prototype.
- Demo product selection and demo bag counter on the homepage.
- `/wardrobe` page that reads active products from Supabase.
- Multi-image viewer: drag to switch between uploaded product photos; this is not a true photorealistic 3D garment model.
- Size/color variant inventory table and starter admin UI.
- Supabase client scaffold and initial SQL tables/policies.
- Five SVG design reference files.

### Not yet production-ready / not connected
- The homepage's 3D rack uses procedural sample garment geometry and sample product data. Replace with real GLB/GLTF garment assets and live product data.
- The homepage bag is a demo counter only. The wardrobe's add-to-cart callback is optional and is not wired to a persistent cart yet.
- Full cart, checkout, coupon, shipping calculation, order creation and order history need implementation and testing.
- Variant stock is managed per size/color, but checkout does not yet reserve or deduct variant stock transactionally.
- Customer login/register, password reset, customer profile and full admin product/order dashboards are not connected in this consolidated starter.
- BCEL payment gateway is not connected. Merchant onboarding, official API credentials, server-side payment creation, webhook verification and reconciliation are required.
- Anousith Express and Houngaloun Express are planned as shipping options; carrier APIs are not connected. Do not assume a public API exists.
- Slip upload and payment approval workflow are not implemented.
- Translation-ready data structure exists, but full UI localization and language switcher are not yet implemented.
- Policies, terms, privacy, tax/duty, international shipping rules, accessibility, security review and production deployment remain to be completed.

## Security

- Never commit `.env.local`, API secrets, database passwords or Supabase `service_role` keys.
- Only the public anon key belongs in the browser environment, protected by correct Row Level Security.
- The starter `is_admin()` policy depends on the `profiles.role` value. Admin assignment must be done securely by the project owner; do not expose public admin registration.
- Review every SQL policy before production use.

## Upload to GitHub

Create a repository named `parmilar-fashion-store`, then upload the extracted project folder or push it with Git. See GitHub's official guide:
https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
