# GetFoodie — Interactive multi-role portfolio demo

> **Practice/showcase project only.** GetFoodie Demo is not a deployed food-delivery business, and no production credentials, real restaurant data, payment processing, or real deliveries are connected. This is a standalone, Vercel-ready browser demonstration of the original PHP/MySQL GetFoodie concept.

## Start here

[Open the GitHub repository](https://github.com/isaacGrey/getfoodie-demo), or deploy the repository to Vercel. On the **Sign in** page, select a role to fill its sample credentials, then click **Sign in to demo**. The form validates the email and password; selecting a role alone does **not** sign you in.

| Role | Email | Password |
| --- | --- | --- |
| Customer | `customer@demo.getfoodie.app` | `Demo123!` |
| Restaurant owner | `business@demo.getfoodie.app` | `Demo123!` |
| Platform administrator | `admin@demo.getfoodie.app` | `Demo123!` |

These accounts are **sample browser-local logins**. Credentials and role checks are visible in the public JavaScript and must never be considered secure server authentication.

## Complete demo walkthrough

1. **Customer:** sign in, browse restaurants and categories, search for food, add items to the basket, change quantities, and place a **cash-on-delivery or pay-on-pickup** sample order.
2. **Customer order tracking:** visit My orders to see the order number, price breakdown, status timeline, cancellation requests, and (after delivery) an optional star rating.
3. **Restaurant owner:** sign out, sign in with the vendor account, visit **Order fulfilment**, and find the customer's new order. Accept it, start preparing, mark ready, mark out for delivery, and mark delivered. Pickup orders go directly from Ready to Delivered.
4. **Customer:** sign out and return as the customer. The order now shows Delivered with the updated fulfilment timeline. Reorder available items or leave a review.
5. **Vendor management:** edit item names, descriptions, prices, stock, categories, and visibility. Update restaurant name, address, contact, operating hours, preparation time, open/closed state, and pickup/delivery settings. View revenue reporting and export sample order history to CSV.
6. **Administrator:** sign in with the admin account. Review and approve or suspend fictional restaurant listings, enable/disable non-admin demo accounts, and change branding, fees, order minimums, platform commission, pickup/ordering availability, and sample application auto-approval. These settings influence subsequent customer checkouts.
7. **Reset:** restore all initial sample orders, vendors, account access, menu and settings to the defaults at any time.

## How the demo works

- `index.html` — single-entry-point document
- `core.js` — testable order, stock, cancellation, role, and settings logic
- `app.js` — screen rendering, navigation, forms, role-specific dashboards
- `styles.css` — shared compact UI design system
- `v2.css` — login, role themes, mobile layouts, order timeline, forms
- `tests/*.test.cjs` — automated order/role tests and UI-render smoke checks
- `vercel.json` — static-route rewrites for Vercel

Local demo data is persisted with **localStorage**; sign-in selection is stored in **sessionStorage**. The order is visible across demo roles **only within the same browser origin and browser profile**. Different visitors, devices or private browsing sessions have different demo databases. Account/password validation is purely illustrative.

**There is no real Supabase/Auth integration in this version.** To support real account registration, secure server-authorized roles, realtime cross-device order management, audit trails, and actual online payment verification, provision a dedicated backend (for example, a separate Supabase project) with row-level security and server-side payment verification. Do not reuse an unrelated database project or expose service-role keys.

## Running locally

Use a static HTTP server, for example:

```sh
npx serve .
```

Open the served URL and use the demo accounts above. There are **no build steps, npm dependencies, or secret environment variables** for this standalone demo.

## Vercel

Import `isaacGrey/getfoodie-demo` into Vercel as **Framework: Other**, root `./`, build command blank, output `./`. Routes such as `/customer/orders`, `/vendor/menu` and `/admin/settings` are handled by the static SPA rewrite.

## Checks

GitHub Actions runs JavaScript syntax checks, the business-flow test suite, and the role/page smoke tests. You can also run:

```sh
node --check core.js
node --check app.js
node --test tests/*.test.cjs
```

## Note about the original system

The source GetFoodie application is a separate PHP/MySQL project. This repository intentionally contains no original database credentials, actual user records, private source links in the app UI, or payment integrations.
