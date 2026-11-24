# Backend structure

The demo runs one credit service in the app window. Its in-memory store holds
customer balances in integer cents and a receipt for each completed trade.
Navigation and logout retain the session. Reloading or closing the window
discards it. Each window has its own state.

The memory demo seed adds the three customer accounts and replays nine dated trades through the normal credit service on startup. Each receipt contributes to its customer’s balance and the manager totals.

The application entry point injects the service into the router using the
shared credit contract. The desktop app and browser preview use the same
code. The demo does not provide a network API or staff authentication.

## Directory responsibilities

| Directory | Responsibility |
| --- | --- |
| `src/backend/domain/models/` | Domain records, identifiers, and relationships, independent of a database schema. |
| `src/backend/domain/rules/` | Business validation and calculations that do not perform storage or network operations. |
| `src/backend/services/` | Application workflows, such as creating a trade, coordinating domain rules and storage interfaces. |
| `src/backend/api/routes/` | Endpoint handlers, request validation, and response mapping; delegate workflows to services. |
| `src/backend/storage/interfaces/` | Storage contracts used by services, such as customer lookup and saving records. |
| `src/backend/storage/memory/` | Initial in-memory implementations of those storage contracts. |
| `src/shared/contracts/` | Frontend/backend request and response contracts; no database, server, or Electron dependencies. |
| `tests/backend/unit/` | Focused model, rule, and service tests using isolated mock storage where needed. |
| `tests/backend/integration/` | Checks that API handlers, services, and in-memory storage work together. |
| `tests/backend/fixtures/` | Reusable sample records and test setup data. |

Keep dependencies directed from API handlers to services, and from services to
domain code and storage interfaces. Storage implementations satisfy the interfaces;
domain rules should not import a storage implementation or API framework.
Keep backend implementation code out of renderer imports. Shared contracts describe
the public data exchanged with the frontend, rather than exposing database records.

When a database is selected, add its implementation alongside `storage/memory/`.
Place its schema, queries, and migrations with that implementation. Database setup,
transaction boundaries, and deployment configuration will need concrete design work
at that point; the directory scaffold does not resolve those decisions.

Run `npm test` to include the in-memory credit workflow tests.

## Decisions awaiting sponsor confirmation

Record confirmed decisions here, with their source and date, before treating them
as implementation requirements. The current demo is not an approved backend specification.

| Area | Open questions |
| --- | --- |
| Customers and records | Which fields are required, how are customers identified, and how should duplicates be handled? |
| Store credit | What validation, rounding, limits, and cross-location redemption rules apply? |
| Trades and inventory | When does a trade change balances or inventory, and how are corrections or reversals handled? |
| Staff access | How are staff authenticated, and which operations require manager permissions? |
| Storage consistency | Which updates must succeed together, and how should concurrent or duplicate submissions behave? |
| Data lifecycle | What audit history, retention, and deletion rules are required? |
| Infrastructure | Where will the backend run, which database will it use, and must it support offline operation? |
