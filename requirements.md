# Functional Requirements — Game Store Credit System

**Project:** Dragon's Lair store credit application  
**Document status:** Draft for team review  
**Baseline:** `main` commit `e1a6d79`  
**Last reviewed:** November 10, 2026

## 1. Purpose and scope

The application supports employees who accept items for store credit and redeem
that credit for customer purchases. Managers need transaction history and
reporting about credit, categories, employees, locations, and trends.

This document consolidates the project scope in [README.md](README.md), the
current application behavior, and the team's requested manager-page changes.
Requirements describe the intended behavior; the status beside each requirement
identifies what the current frontend actually supports. Acceptance criteria are
review targets, not a claim that automated tests already cover every requirement.

The latest manager-page direction is to retain the original compact layout,
change the transaction headings, add the category column, and distinguish credit
additions from deductions. The previously proposed expanded dashboard and
separate `managerMetrics.ts` module are not required.

## 2. Users and terminology

| Term | Meaning |
| --- | --- |
| Employee | Staff member who selects a store, finds customer accounts, and prepares trades. |
| Manager | Staff member who reviews transaction activity and analytics. Production access rules still need confirmation. |
| Customer | Account holder whose available store credit is displayed and used for trades. No customer login is currently specified. |
| Trade in | An accepted item that adds credit to the customer's account. |
| Trade out | A purchase that deducts credit from the customer's account. |
| Credit | A US dollar value displayed with two decimal places. A positive change adds credit; a negative change redeems it. |
| POS transaction ID | A reference entered by an employee to associate a trade out with a point-of-sale transaction. |

### Status key

- **Demo:** Implemented in the frontend using sample data or memory-only state.
- **Partial:** Some behavior exists, but the complete requirement is not implemented.
- **Planned:** Part of the stated project scope; backend or additional UI work remains.

## 3. Store selection, staff sessions, and navigation

### FR-01 — Select a store before login

**Status: Demo.** The system shall let staff select North Location or Millard
Location before logging in. Each option shall show the store name, address,
phone number, and identifying banner color. All demo employees shall be available
at both locations.

**Acceptance:** Selecting either location opens login and displays that location
in the shared banner. Returning from login allows a different store to be selected.

### FR-02 — Identify the employee

**Status: Partial.** The system shall require an employee selection and a numeric
PIN before opening the staff workspace. The PIN shall be masked. Production
login shall verify the employee's credentials; accepting any nonempty numeric PIN
is a demo behavior only.

**Acceptance:** An empty employee selection or PIN prevents login. Demo login
opens customer search. Production acceptance additionally requires valid
credentials to succeed and invalid credentials to fail.

### FR-03 — Show session context and shared controls

**Status: Demo.** The system shall display the selected store and current employee
in the shared sticky header. Logged-in pages shall offer Manager and Log out
controls. A location's banner color shall remain consistent throughout the session.

**Acceptance:** Navigating among search, customer account, trade forms, and the
manager page preserves the displayed store and employee.

### FR-04 — Log out and reset employee state

**Status: Demo.** Logging out shall clear the current employee, PIN/form state,
and search query while retaining the selected store and in-memory customers for
the next employee. Reloading the current demo shall return to store selection.

**Acceptance:** After logout, the application shows login for the selected store;
browser Back cannot reopen a logged-in workspace without logging in again.

### FR-05 — Provide predictable Back navigation

**Status: Demo.** Back controls shall appear below the store banner and name their
destination. Trade forms shall return to the same customer account. Customer
accounts and the manager page shall return to customer search. Login shall return
to store selection. Store selection and search shall have no Back control.

**Acceptance:** Each Back control reaches its stated destination, including when
a trade route was opened directly for an existing customer.

### FR-06 — Handle invalid and unavailable routes

**Status: Demo.** The system shall support hash-based browser Back/Forward
navigation and route users to a valid page when a URL is unknown or refers to a
missing customer. Store selection and login prerequisites shall still apply.

**Acceptance:** A logged-in user opening an invalid route reaches search. A user
without a store reaches store selection; a user with a store but no employee
session reaches login.

## 4. Customer accounts

### FR-07 — Search for customers

**Status: Demo.** Employees shall be able to search by name, email, or phone
number. Text matching shall ignore case, and phone matching shall ignore
formatting characters. The system shall show matching customers, a no-results
message, or an initial prompt when the search field is empty.

**Acceptance:** Searching for a known name or its phone digits finds the account.
Selecting a result opens that customer's account. Returning to search preserves
the query during the session.

### FR-08 — Create a customer account

**Status: Demo.** Employees shall be able to create an account with a required
phone number and optional name and email. The system shall reject a phone number
with no digits or one matching an existing account after formatting is removed.
A new account shall begin with $0.00 credit and open immediately after creation.

**Acceptance:** A unique phone number creates a searchable in-memory account.
A duplicate produces an error without creating another account. Canceling or
closing the form shall not create an account.

### FR-09 — Display account information and available credit

**Status: Demo.** A customer account shall prominently display available store
credit, customer name or phone fallback, phone number, and email. It shall provide
Trade in and Trade out actions tied to that customer.

**Acceptance:** The chosen customer's information appears on the account page,
and both trade actions carry that customer's identity and available balance into
the corresponding form.

## 5. Trade entry and credit processing

### FR-10 — Capture trade-in details

**Status: Demo.** A trade-in form shall require a category, item name, and
employee-determined credit offer. Condition/notes shall be optional. Item names
shall allow up to 200 characters and notes up to 2,000 characters.

**Acceptance:** Missing category or blank item name prevents successful form
review. Valid entries can be checked while the selected customer remains visible.

### FR-11 — Capture trade-out details and POS reference

**Status: Demo.** A trade-out form shall require a category, item name, agreed
credit value, and related POS transaction ID. Description/notes shall be optional.
Item names and POS references shall allow up to 200 characters; notes shall allow
up to 2,000 characters.

**Acceptance:** Missing category, blank item name, or blank POS reference prevents
successful form review. The POS reference is captured as text; this requirement
does not imply an automated connection to a POS service.

### FR-12 — Select and prioritize categories

**Status: Partial.** Both trade forms shall offer three prominent category
choices and Show more / Show less controls for the remaining categories, including
General. Rankings shall be independent for trade ins and trade outs and use
completed-trade counts when those counts are available.

**Acceptance:** Staff can select any configured category and still see which one
is selected after collapsing the list. Higher supplied counts rank first for the
applicable trade direction. Without counts, the demo uses its configured defaults.
Live completed-trade counts remain to be connected.

### FR-13 — Validate monetary input

**Status: Demo.** Trade forms shall accept positive USD values of at least $0.01
with no more than two decimal places, within the supported integer-cent range.
Zero, negative, malformed, and overly precise values shall be rejected. Accepted
values shall be normalized to two decimal places.

**Acceptance:** `12.5` becomes `12.50`; `0`, `-1`, `12.345`, and nonnumeric input
produce an error. Failed validation shall not be presented as a completed trade.

### FR-14 — Review, edit, and clear a form

**Status: Demo.** Employees shall be able to check form validity and clear all
trade fields. Editing a field after review shall clear the prior reviewed state.
The demo shall explicitly state that checking a form does not save or process it.

**Acceptance:** A valid review displays the preview confirmation. Editing removes
that confirmation. Clear form resets the category, expanded choices, item, notes,
credit input, POS reference where applicable, and validation messages.

### FR-15 — Issue credit for an accepted trade in

**Status: Planned.** Completing a valid trade in shall add the agreed credit to
the selected customer's balance and record the transaction against that customer,
employee, and store. The present Check trade in action only validates inputs.

**Acceptance:** Completing a $12.50 trade in for a customer with $40.00 credit
produces a $52.50 balance and a corresponding saved transaction. The completion
interaction and backend behavior remain to be implemented.

### FR-16 — Redeem credit for a trade out

**Status: Planned.** Completing a valid trade out shall deduct the agreed credit
from the selected customer's balance and save the transaction with its POS
reference. The present Check form action does not redeem credit or check the
amount against the customer's available balance.

**Acceptance:** Completing an allowed $12.50 trade out from a $40.00 balance
produces a $27.50 balance and a saved transaction. Handling insufficient credit
must follow the team-approved policy identified in Section 9.

### FR-17 — Retain customer and transaction records

**Status: Planned.** The system shall persist customer accounts, balances, and
completed transaction history beyond navigation, logout, and application restart.
Each completed transaction shall be attributable to its customer, employee, and
store and retain the information needed for reporting and receipts.

**Acceptance:** After a completed trade and application restart, the customer
balance and transaction record can be retrieved. The current in-memory customers
and static manager examples do not satisfy persistence.

## 6. Manager activity, transaction history, and receipts

### FR-18 — Preserve the compact manager page

**Status: Demo.** The manager page shall keep the original compact organization:
summary metrics at the top, daily trade-in activity beside employee lookup, and
recent transactions below. Receipt details shall open within that page. The
requested changes shall not introduce a replacement dashboard or separate metrics page.

**Acceptance:** All of these sections remain accessible on the existing manager
route with the shared header and Back control. For this change, manager data and
calculations remain in `src/ManagerPage.tsx`.

### FR-19 — Show trade-in summary metrics

**Status: Demo.** Managers shall be able to switch the summary between Today and
This week. It shall show total credit issued through trade ins, the number of
trade-ins, and average credit per trade-in. The Transactions count in this compact
summary refers to trade-ins, not all transaction types.

**Acceptance:** Today shows $126.25 from 3 sample trade-ins, averaging $42.08.
This week shows $405.00 from 10 sample trade-ins, averaging $40.50. A period with
no trade-ins shall show a zero average rather than an invalid number.

### FR-20 — Show daily transaction trends

**Status: Partial.** The manager page shall show daily trade-in credit totals for
the displayed seven-day period, with readable day labels and credit values. Each
transaction shall contribute to the appropriate day exactly once.

**Acceptance:** The sum of daily chart values equals the total for the same
period. The current sample chart omits records labeled Yesterday while its total
includes them; date grouping still needs correction.

### FR-21 — Find employee trade-in activity

**Status: Demo.** Managers shall be able to enter an employee ID to view that
employee's trade-ins, employee name, total credit issued, and individual customer,
store, and credit entries. An unmatched ID shall show a no-results message.

**Acceptance:** ID `1042` displays Jordan Davis and $264.75 in sample trade-ins.
An unmatched ID shows no results. In the original compact page, this lookup uses
all sample activity independently of the summary period control.

### FR-22 — Show the recent transaction table

**Status: Demo.** The page shall show the latest five sample transactions with
columns in this order: **Transaction, Costumer, Employee, Store, Category, Credit,
Time**. Transaction shall include its ID and trade direction; Employee shall
include the employee ID. Category shall appear between Store and Credit.

**Acceptance:** Every row aligns with those headings, displays its recorded
category, and uses Credit instead of Amount. “Costumer” preserves the exact
heading requested by the team; the underlying record is a customer account.

### FR-23 — Distinguish credit additions and deductions

**Status: Demo.** Credit added through trade ins shall appear in green with a
`+` sign. Credit deducted through trade outs shall appear in red with a `−` sign.
The transaction table and receipt credit values shall use the same convention,
with the trade type also available as text.

**Acceptance:** A $42.50 trade in displays green `+$42.50`; a $28.00 trade out
displays red `−$28.00`. Users can identify direction from signs and text as well
as color.

### FR-24 — View and close a transaction receipt

**Status: Demo.** Selecting a recent transaction or its ID shall show an inline
receipt with transaction ID, day/time, trade type, customer, employee and ID,
store, item, category, and credit issued or redeemed. A Close control shall hide it.

**Acceptance:** Opening different rows displays the corresponding receipt data.
Closing a receipt leaves the manager page available without navigation. The
current requirement is an on-screen receipt, not printing or exporting.

### FR-25 — Review saved transaction history

**Status: Planned.** Managers shall be able to retrieve completed transaction
history and inspect individual records rather than relying on the five static
sample entries. The history shall preserve customer, employee, store, item,
category, credit direction/value, and transaction time associations.

**Acceptance:** A newly completed trade becomes retrievable in history, and its
details match the saved transaction. History range, filters, and pagination remain
to be specified; they are not currently provided by the demo.

### FR-26 — Report on issued and redeemed credit

**Status: Partial.** Managers shall be able to review credit issued and credit
redeemed over a defined reporting period. The existing summary reports trade-in
credit only; trade-out rows and receipts do not constitute a redeemed-credit summary.

**Acceptance:** Issued and redeemed totals can be traced to their respective
saved transactions for the same stated period. Additional reporting shall respect
the compact-page direction in FR-18; the earlier four-card redesign is not required.

### FR-27 — Analyze activity by category, employee, and store

**Status: Partial.** Manager reporting shall support the project goals of
understanding activity by item category, employee, and location, including trends.
The current employee lookup and table fields provide only part of that capability.

**Acceptance:** For a defined dataset and reporting period, reported groups can
be reconciled with the underlying transactions. Category/store aggregation,
report controls, and production data integration remain to be designed.

## 7. Required information

This table describes the information needed by the workflows, not a prescribed
database schema.

| Record | Required information |
| --- | --- |
| Store | Stable identifier, name, address, phone, and banner presentation. |
| Employee | Stable identifier, display name, and production authentication information; role policy is pending. |
| Customer | Stable identifier, phone number, optional name/email, and available credit balance. |
| Transaction | Stable identifier, trade direction, customer, employee, store, item name, category, positive credit magnitude, and transaction date/time. |
| Trade notes | Optional item description or condition notes associated with the trade. |
| Trade-out reference | Related POS transaction ID. |
| Category activity | Completed-trade counts separated by trade direction when used to rank category choices. |

## 8. Current implementation boundaries

The following limitations must not be represented as completed production features:

- Login accepts any nonempty numeric PIN; authentication is not connected.
- All logged-in demo employees can open Manager; role enforcement is not connected.
- Customer changes are memory-only and reset on reload.
- Trade checks validate inputs without saving transactions or changing balances.
- Trade-out validation does not enforce an available-balance policy.
- Category rankings use defaults unless counts are supplied; live counts are absent.
- Manager metrics and receipts use static sample transactions, not submitted trades.
- The summary period control does not filter employee lookup or recent transactions.
- Daily sample grouping needs the reconciliation fix described in FR-20.

## 9. Decisions requiring team confirmation

| Decision | Why it is needed |
| --- | --- |
| Production authentication and manager permissions | Define credential verification, PIN management, failed-login handling, and who may open reports. The login component contains a help message for repeated failures, but no connected failure counter. |
| Insufficient credit and cross-store use | Define whether overdrafts or partial redemption are permitted and whether credit is shared across locations. |
| Reporting dates | Define store timezone, week boundaries, history range, and whether period controls affect all report sections. |
| Trade completion and failure handling | Specify the final save action and how unsuccessful or repeated submissions affect records and balances. |
| History and reporting controls | Choose required filters, grouping, and navigation for production history and category/store reports. |
| Data retention and corrections | Define how long records are retained and whether completed trades can be corrected or reversed. |

Printing/exporting receipts, automated POS integration, customer self-service,
and employee/category administration are not established requirements in the
reviewed scope. They require a separate team decision before being added.

## 10. Source references

| Feature area | Repository reference |
| --- | --- |
| Project goals and demo boundaries | [README.md](README.md) |
| Store and employee configuration | [src/session.ts](src/session.ts), [src/StoreSelection.tsx](src/StoreSelection.tsx) |
| Login, shared header, and navigation | [src/Login.tsx](src/Login.tsx), [src/AppHeader.tsx](src/AppHeader.tsx), [src/AppRouter.tsx](src/AppRouter.tsx), [src/routes.ts](src/routes.ts) |
| Customer search and account creation | [src/App.tsx](src/App.tsx) |
| Customer credit and trade context | [src/CustomerAccount.tsx](src/CustomerAccount.tsx), [src/TradeAccountContext.tsx](src/TradeAccountContext.tsx) |
| Trade forms and categories | [src/TradeInPage.tsx](src/TradeInPage.tsx), [src/TradeOutPage.tsx](src/TradeOutPage.tsx), [src/tradeCategories.ts](src/tradeCategories.ts) |
| Manager summary, chart, lookup, history preview, and receipts | [src/ManagerPage.tsx](src/ManagerPage.tsx) |
| Existing route checks | [tests/routes.test.cjs](tests/routes.test.cjs) |
