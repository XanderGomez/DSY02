# Game Store Credit System

A web based desktop application developed as a senior capstone project for Dragon's Lair.

## Project Overview

The system will allow employees to:

- Issue store credit for accepted items
- Redeem customer store credit
- Categorize credit transactions
- Track transaction history

Managers will additionally be able to view analytics related to:

- Credit issued and redeemed
- Item categories
- Employees
- Store locations
- Transaction trends

## Development

Use Node.js 24 or newer. Install the dependencies recorded in the lockfile with `npm ci`, then start the
application with `npm start`.

Run `npm run typecheck` to check TypeScript without generating files, and
`npm run lint` to check code style. Run `npm test` for the routing, analytics,
and transaction history tests. Use `npm run package` to build the desktop app.

## Repository structure

```text
config/                      Vite configurations for Electron and React
docs/backend/                Backend structure and unconfirmed requirements
src/
  backend/                   Future backend (directory scaffold only)
    api/routes/              API endpoint handlers
    domain/models/           Domain records and relationships
    domain/rules/            Business validation and calculations
    services/                Application workflows
    storage/interfaces/      Storage contracts
    storage/memory/          Initial in-memory storage implementations
  main/                      Electron app lifecycle and window creation
  preload/                   Electron preload entry point
  renderer/
    app/                     Application routing and session orchestration
    components/              Shared application UI
    features/
      customers/             Customer search, creation, and account view
      manager/               Manager overview and analytics
      session/               Store selection, staff login, and demo staff
      trades/                Trade-in/out forms and category helpers
      transactions/          Demo ledger, transaction history, and receipts
    styles/                  Global styles and Tailwind entry point
    main.tsx                 React entry point
  shared/contracts/          Future frontend/backend request and response contracts
tests/                       Node.js tests for application logic
  backend/                   Future backend tests
    unit/                    Domain rules and service tests
    integration/             API, service, and storage integration tests
    fixtures/                Reusable test data
```

Keep feature-specific components, data, and helpers together. Put UI shared across
features in `src/renderer/components`. Electron Forge, TypeScript, ESLint, and
the HTML entry point retain their conventional root locations. Generated output
(`.vite/`, `dist/`, and `out/`) and dependencies (`node_modules/`) are ignored.

The backend and shared contract directories contain placeholders only. See the
[backend structure guide](docs/backend/README.md) for responsibilities, dependency
boundaries, and decisions awaiting sponsor confirmation. Hosting and database
choices remain open; no backend functionality is wired into the app yet.

## Frontend demo

The app starts with manual store selection, followed by staff login. Select a demo
employee and enter any nonempty numeric PIN to open customer search; this is demo
navigation, not authentication. Store colors and demo staff are configured in
`src/renderer/features/session/session.ts` (North Location (Main): blue, Millard Location: purple). Locations
use sponsor-provided contact details; colors are provisional and employee accounts
are placeholders pending backend authentication. All employees are available at
both locations; selecting a store does not filter employee accounts.
Search for Olivia, Noah, or Ava, or create an account. Selecting a customer opens their credit balance,
with links to trade in and trade out. Each trade page returns to that same account.
The shared sticky header shows the selected store and employee on every page,
with Manager and Log out available throughout the logged-in session. The inset
store banner has rounded bottom corners, Back on the left, the store centered,
and the employee on the right. Trades return to their customer, accounts and the
manager dashboard return to search. Each button says "Back to" followed by its
destination. Search and initial store selection have no Back button because they
are starting points. Login's Back returns to store selection.

Customer records and the search query remain in memory while navigating. Reloading
resets the demo and returns to store selection. Logging out clears the employee,
PIN/form state, and search query while retaining the selected store and customer
records for the next employee. Browser history cannot reopen logged-in pages after
logout. Trade forms validate inputs only; they do not change balances or save
transactions. Manager activity is sample data, and manager
access is unrestricted in this demo.

The manager dashboard keeps its compact summary, daily trade-in chart, employee
lookup, and recent transactions. The Credit column shows additions in green with
`+` and deductions in red with `−`; transaction receipts use the same convention.
Click a transaction to view its receipt.

For a browser preview, run `npm run preview` and open the local URL printed in the
terminal. This uses the same entry point as the desktop app; the old standalone
login and manager preview files have been removed. Hash URLs support Electron and browser
Back/Forward navigation. Unknown URLs or missing customers return to search when
logged in, and to login otherwise.

Run just the routing checks with `node --test tests/routes.test.cjs`.

### Manager analytics

Choose **Explore analytics** on the manager page (`#/manager/analytics`). Date,
store, employee, trade type, and category filters apply to every metric, chart,
and receipt list. Select a breakdown bar to filter its transactions, then select
an ID to open the same receipt component used by the manager overview.

The analytics view uses the shared demo ledger in `src/renderer/features/transactions/transactions.ts`, with an
explicit November 4–12, 2026 demo date mapping in `src/renderer/features/manager/analytics.ts`. This branch
has no persisted transaction history or backend integration; replace the shared
ledger and demo dates with recorded transactions when that integration is ready.
Customer counts use distinct sample names until stable customer IDs are available.

Metrics include credit issued, credit redeemed, net credit movement, transaction
count, average transaction value, and customers served. Daily movement and
category/store/employee breakdowns help trace aggregate amounts back to receipts.
Combined activity sums the absolute credit amounts in both directions. Net credit
movement is issued minus redeemed, not profit or the outstanding credit balance.
A starting balance is required to calculate outstanding credit; inventory costs
and sales data are required for profitability metrics.

Metric research: Shopify's [analytics overview](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/overview-dashboard/using-the-overview-dashboard)
tracks volume and average order value, and its [retail reports](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/retail-sales-reports)
break activity down by product and staff. These reporting patterns are adapted to
store credit here, rather than treating credit issuance as sales revenue.

Validation: `npm run typecheck`, `npm run lint`, and `npm test`.

### Transaction history

The bottom of the manager page links to **View all transaction history**
(`#/manager/history`). The history shows all shared demo records and filters
immediately by a full or partial POS transaction number. Select a transaction ID
to open its receipt, which now includes the POS reference. Example demo POS
number: `102841`. POS references are stored as strings to preserve leading zeros.
Both trade forms require a POS transaction ID. Forms still validate only and do
not save new records; history will need the persisted ledger when saving is added.
