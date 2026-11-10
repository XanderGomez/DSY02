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

Install the dependencies recorded in the lockfile with `npm ci`, then start the
application with `npm start`.

Run `npm run typecheck` to check TypeScript without generating files, and
`npm run lint` to check code style.

## Frontend demo

The app starts with manual store selection, followed by staff login. Select a demo
employee and enter any nonempty numeric PIN to open customer search; this is demo
navigation, not authentication. Store colors and demo staff are configured in
`src/session.ts` (North Location (Main): blue, Millard Location: purple). Locations
use sponsor-provided contact details; colors are provisional and employee accounts
are placeholders pending backend authentication. All employees are available at
both locations; selecting a store does not filter employee accounts.
Search for Olivia, Noah, or Ava, or create an account. Selecting a customer opens their credit balance,
with links to trade in and trade out. Each trade page returns to that same account.
The shared sticky header shows the selected store and employee on every page,
with Manager and Log out available throughout the logged-in session. Back is
always below the store banner: trades return to their customer, accounts and the
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

The manager dashboard groups credit issued, credit redeemed, net credit change,
and transaction count into summary cards. The Today / Last 7 days selector applies
to the daily chart, North/Millard store breakdown, recent transactions, and employee
lookup. Try employee IDs 1042, 1087, or 1124. Click a recent transaction to open its
receipt; changing the reporting period closes the receipt. These metrics cover
all stores regardless of the location selected for the staff session. Net change
is activity within the selected period, not the total outstanding customer balance.
The seven-day sample uses relative day labels; Saturday and Yesterday belong to
the same sample day.

For a browser preview, run `npx vite --config vite.renderer.config.ts` and open the
local URL printed in the terminal. The normal entry point now loads the whole app;
no temporary preview script is needed. Hash URLs support Electron and browser
Back/Forward navigation. Unknown URLs or missing customers return to search when
logged in, and to login otherwise.

Run routing checks with `node --test tests/routes.test.cjs` (Node 24 or newer).
Run all routing and manager metric checks with `node --test tests/*.test.cjs`
(add `--experimental-strip-types` when using Node 22).
