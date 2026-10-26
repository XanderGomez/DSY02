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

The app starts at staff login. Enter any nonempty numeric PIN to open customer
search; this is demo navigation, not authentication. Search for Olivia, Noah,
or Ava, or create an account. Selecting a customer opens their credit balance,
with links to trade in and trade out. Each trade page returns to that same account.
Search also links to the manager dashboard and provides Log out.

Customer records and the search query remain in memory while navigating. Reloading
resets the demo and returns to login. Trade forms validate inputs only; they do not
change balances or save transactions. Manager activity is sample data, and manager
access is unrestricted in this demo.

For a browser preview, run `npx vite --config vite.renderer.config.ts` and open the
local URL printed in the terminal. The normal entry point now loads the whole app;
no temporary preview script is needed. Hash URLs support Electron and browser
Back/Forward navigation. Unknown URLs or missing customers return to search when
logged in, and to login otherwise.

Run routing checks with `node --test tests/routes.test.cjs` (Node 24 or newer).
