# GetFoodie — Interactive Portfolio Demo

> **Demonstration only.** This repository is for practice, showcasing software-development skills, and demonstrating a sample food-ordering workflow. It is **not** a live food-delivery service and is not connected to real restaurants, customers, financial accounts, or the original PHP/MySQL database. All names, orders, and payment selections in the demo are fictional.

The original application is maintained separately in a private repository. This repository is intentionally a static, standalone Vercel-compatible front end; no production credentials, customer records or payment integrations are included.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Customer | customer@demo.getfoodie.app | Demo123! |
| Restaurant Owner | business@demo.getfoodie.app | Demo123! |
| Administrator | admin@demo.getfoodie.app | Demo123! |

These credentials are publicly visible mock values. Authentication only selects a role in client-side JavaScript; it is **not** a real authentication or authorization system. Do not reuse them elsewhere.

## What to try
- **Customer:** explore restaurants and menus, search or filter dishes, add products to cart, adjust quantities, simulate checkout, see order statuses and request a cancellation.
- **Restaurant owner:** inspect demo performance and orders, add/edit menu items, toggle availability and move order statuses forward.
- **Administrator:** inspect example platform activity and approve/decline restaurant applications.
- **Reset sample data:** restore the initial examples at any time.

Mock data is saved in the visitor's browser using localStorage and never sent to a server. Demo accounts and sample data are not suitable for production.

## Run locally

Open `index.html` with a static server (recommended) or use `npx serve .`. No build dependencies or environment variables are required.

## Deploy to Vercel

Import the `isaacGrey/getfoodie-demo` repository into Vercel. Use **Other** framework, root directory `./`, no build command, and output directory `./`. The `vercel.json` file rewrites all application routes to the static entry point.

## Architecture note

The actual source application uses PHP/MySQL and requires a PHP-capable server. This public demo deliberately **does not** copy or publish its backend, credentials, real data, or proprietary assets.
