# PARMILAR project summary

## Product vision
A dark-luxury fashion storefront with an interactive virtual wardrobe, product views, multilingual catalog, customer shopping flow and admin inventory tools.

## Decisions carried forward
- Brand: PARMILAR
- Visual direction: dark / modern luxury streetwear
- Responsive targets: iPhone, iPad, desktop
- Primary launch market: Laos
- Currency: LAK
- Languages planned: English, Thai, Lao, Chinese, Vietnamese
- Shipping scope: domestic and international
- Carriers selected: Anousith Express and Houngaloun Express
- Payment plan: BCEL bank transfer/manual slip plus an online gateway after provider approval

## Development phases
1. Storefront and interactive 3D rack prototype — starter included.
2. Virtual wardrobe and multi-image product viewer — starter included; uses Supabase products.
3. Product variants and size/color stock — starter included.
4. Persistent cart and secure checkout — next implementation phase.
5. Order/payment workflow and BCEL gateway — pending provider onboarding and server-side integration.
6. Shipping label/tracking integration — pending carrier API/merchant access; manual tracking entry is possible as an interim workflow.
7. Full authentication, customer account, admin dashboard and multilingual UI — pending integration and security review.
8. Production QA, legal pages and deployment — pending.

## Important distinction
This repository is a consolidated development starter, not a completed live e-commerce platform. Some earlier conversation snippets were prototypes and have been normalized into a single Next.js project. Backend features must be configured and tested against the user's own Supabase project before real customer orders are accepted.
