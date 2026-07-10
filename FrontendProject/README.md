# GameAccShop — Frontend

A premium marketplace for buying and selling game accounts, built **strictly against the
ASP.NET Core backend** in `../Anvar_projects`. No mock data — every screen talks to the real API.

## Tech stack

- **React 19** + **TypeScript** + **Vite 6**
- **TailwindCSS** (white/indigo SaaS theme) + **shadcn/ui**-style components (Radix primitives)
- **React Router** (routing + role guards)
- **TanStack Query** (server state) + **Axios** (HTTP + JWT interceptor)
- **React Hook Form** + **Zod** (forms & validation)
- Feature-based architecture (`src/features/*`)

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

### Connecting to the backend

The backend has **no CORS** configured and forces HTTPS redirect, so the dev server **proxies**
`/api` and `/uploads` to it (see `vite.config.ts`). Point the proxy at whichever backend profile
you run via `.env`:

```
VITE_API_TARGET=http://localhost:5117      # http profile (default)
# VITE_API_TARGET=https://localhost:7137   # https profile
```

Run the backend first (`dotnet run` in `../Anvar_projects/GameAccShop`). It needs PostgreSQL —
see its `appsettings` connection string.

For a production build served from a different origin, set `VITE_API_BASE_URL` to the backend
origin instead (the proxy is dev-only).

## Project structure

```
src/
  lib/            api client, JWT decode, formatters, enum→label maps
  types/api.ts    TypeScript mirrors of every backend DTO
  components/     UI primitives (ui/) + shared app components
  features/
    auth/         AuthContext, login/register
    products/     public catalog + details
    buyer/        dashboard, orders, order details, payment page
    seller/       dashboard, product CRUD, orders
    admin/        overview, payment review, orders, payment accounts
  pages/          landing, 404
```

## Roles & routing

The backend role enum is `Admin | Super_Aamin | User` — **there is no separate "Seller" role**.
Registration always creates a `User`, and a `User` both **buys and sells**. So:

- **User** → `/dashboard`, `/orders`, `/seller/*` (buy + sell)
- **Admin / Super_Aamin** → `/admin/*` (review payments, monitor orders, manage payment accounts)

Role and user id are read from the **JWT** (the `/api/Auth/me` endpoint only returns the login
string), decoded in `src/lib/token.ts`.

## Notable backend behaviours the UI accounts for

- **Enums serialize as numbers** (no `JsonStringEnumConverter`). `src/lib/enums.ts` maps them to
  readable labels/badges.
- **Admin confirm route is spelled `/api/AdminPayment/{id}/confrim`** (typo in backend) — used as-is.
- **Payment endpoints are keyed by `{orderId}`**; `UploadReceipt` reads `PaymentId` from the form
  body, so the frontend sends both.
- **No endpoint sets `TransferInProgress`** — a buyer confirms directly from `PaymentConfirmed`.
  The seller order page shows guidance ("send credentials, then the buyer confirms") instead of a
  non-existent status button.
- **Editing a product replaces all media** (backend deletes then re-adds), and credentials aren't
  returned by the API — so the edit form asks you to re-upload media and re-enter credentials.
- **An active payment account is required** for buyers to order. Admins set it in
  `/admin/payment-accounts`.

## Order flow (as implemented by the backend)

1. Buyer places order → `WaitingPayment`, product `Reserved`.
2. Buyer opens the payment page, transfers money, uploads a receipt.
3. Admin **confirms** payment → order `PaymentConfirmed`.
4. Seller sends credentials to the buyer out-of-band (contact details on the order page).
5. Buyer **confirms** receipt → order `BuyerConfirmed`, product `Sold`.
6. Admin **releases** funds → order `Completed`, payment `Released`.
