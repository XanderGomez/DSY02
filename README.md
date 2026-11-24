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
`npm run lint` to check for common code problems. Run `npm test` for the routing, analytics,
transaction history, and credit service tests. Use `npm run package` to build the desktop app.

Use `npm run lint:fix` to apply available automatic lint fixes, then review the diff.
See [linting and code checks](docs/development/linting.md) for what each check does,
how ESLint is configured, and why the lint tools use TypeScript 6.0.

## Repository structure

```text
config/                      Vite configurations for Electron and React
docs/backend/                Backend structure and unconfirmed requirements
src/
  backend/                   Credit service and storage
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
      transactions/          Transaction history and receipts
    styles/                  Global styles and Tailwind entry point
  main.tsx                   Starts the demo credit session and renders the app
  shared/contracts/          Shared frontend/backend contracts
tests/                       Node.js tests for application logic
  backend/                   Backend tests
    unit/                    Domain rules and service tests
    integration/             API, service, and storage integration tests
    fixtures/                Reusable test data
```

Keep feature-specific components, data, and helpers together. Put UI shared across
features in `src/renderer/components`. Electron Forge, TypeScript, ESLint, and
the HTML entry point retain their conventional root locations. Generated output
(`.vite/`, `dist/`, and `out/`) and dependencies (`node_modules/`) are ignored.

The app starts one in-memory credit service per window. See the
[backend structure guide](docs/backend/README.md) for storage responsibilities and open sponsor decisions.

## Frontend demo

The app starts with manual store selection, followed by staff login. Select a demo
employee and enter any nonempty numeric PIN to open customer search; this is demo
navigation, not authentication. Store colors are configured in
`src/renderer/features/session/session.ts` (North Location (Main): blue, Millard Location: purple). Locations
use sponsor-provided contact details; colors are provisional and employee accounts
are placeholders pending backend authentication. All employees are available at
both locations; selecting a store does not filter employee accounts.
The employee picker searches partial names and employee IDs (including `#1042`),
ignoring case and extra spaces. Results appear only while choosing an account,
in a panel with a fixed maximum height that scrolls for longer directories.
Use the arrow keys and Enter to select, or choose a result with the pointer;
Escape dismisses the panel. Selecting an account moves focus to the PIN field.
Editing or clearing the employee selection clears the PIN and hides it again.
The PIN visibility button is optional; sign-in requires a selected account and
a nonempty numeric PIN. No real authentication or lockout policy is implemented.

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
logout. Trade-ins issue credit and trade-outs redeem it. Each completed trade updates
the customer balance and creates a receipt in the same operation.

To try the full workflow, select Ava ($0), issue $25, and redeem $10 using the
trade forms. Attempt to redeem $16. Ava should still have $15. In Manager →
View all transaction history, search for the POS references you used to open
the two completed receipts. Reload to reset the balances and receipts.

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

### Video walkthrough

Open Olivia Bennett’s account to trace her $125.50 balance: a $98 binder trade-in,
a $15 starter set redemption, and a $42.50 Zelda trade-in. Open manager history
and look up POS `102841` to see the Zelda receipt. Redeem $10 with a new POS
reference and show the $115.50 balance and the new receipt. Reload to repeat.

The customers, staff, locations, and opening trades are defined in
`src/backend/storage/memory/demoSession.ts`. Each fresh window replays the
nine example trades through the credit service starting from zero balances.

### Try a credit transaction

1. Start a fresh demo, log in, and open Ava Martinez's account. Her opening balance is $0.
2. Choose **Trade in**, select a category, enter an item name, offer $25, and use POS reference `DEMO-001`. Select **Issue credit**. Her account now shows $25.
3. Choose **Trade out** and enter an item, category, $10, and `DEMO-002`. Select **Redeem credit**. Her account now shows $15.
4. Try to redeem $16. The form shows the available $15. Open **Manager → View all transaction history** and search for `DEMO-` to see the two successful receipts.

### Manager analytics

Choose **Explore analytics** on the manager page (`#/manager/analytics`). Date,
store, employee, trade type, and category filters apply to every metric, chart,
and receipt list. Select a breakdown bar to filter its transactions, then select
an ID to open the same receipt component used by the manager overview.

Analytics reads the same in-memory receipts as customer accounts and manager history.
Each receipt has a timestamp and customer ID. Demo trades cover the last seven days.

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
Both trade forms require a POS transaction ID. Successful trades appear immediately in history.
