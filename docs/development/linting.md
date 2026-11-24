# Linting and code checks

Linting reads source code and looks for patterns covered by configured rules.
It can catch unused variables, unresolved imports, unreachable code, and other
likely mistakes without starting the app. It does not prove that a workflow
behaves correctly or that a business requirement has been implemented.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run lint` | Check source, configuration, and tests without modifying files. Errors or warnings cause a failing exit status. |
| `npm run lint:fix` | Apply the automatic fixes provided by enabled lint rules, then report remaining problems. Review the diff afterward. |
| `npm run typecheck` | Check TypeScript types, such as whether a function receives the right arguments. |
| `npm test` | Execute the existing routing, analytics, and transaction history tests and compare actual results with expected results. |
| `npm run package` | Build and package the Electron app, checking the production build pipeline. |

For example, lint can report an unused customer variable or a misspelled import
path. TypeScript can report a string passed where a number is required. A test
can verify that a trade's back button returns to the correct customer account.
These checks complement each other; passing lint does not replace tests or UI checks.

## Configuration

The root `eslint.config.mjs` uses ESLint's flat configuration format. It includes:

- ESLint's recommended JavaScript rules, including for the CommonJS test files.
- TypeScript ESLint's recommended rules for `.ts` and `.tsx` files. These replace
  JavaScript rules where TypeScript needs different handling.
- Import checks for TypeScript code, using the project's TypeScript resolver and
  recognizing Electron's built-in module.
- Browser globals for the renderer, Node globals for main/backend/tooling/tests,
  and both sets for preload scripts. CommonJS `.cjs` tests retain `require()` support.
- Exclusions for dependencies, generated builds, and coverage output.

The standard TypeScript preset disables JavaScript's `no-undef` rule for TypeScript
files, where the compiler checks names. These global settings are not an enforcement
mechanism for frontend/backend architecture boundaries.

This setup focuses on recommended correctness rules. It does not add a formatter,
React-specific rules, or TypeScript rules that require type information.
Use `npm run typecheck` alongside linting.

## What was wrong with the previous setup

The repository paired TypeScript 7.0.2 with TypeScript ESLint 8.71.1. That plugin
explicitly rejects TypeScript 7 before checking any files: it expects the earlier
TypeScript compiler API. Its supported TypeScript range is `>=4.8.4 <6.1.0`.
The app could build even though the linter could not start.

TypeScript is now constrained to `~6.0.3`, keeping updates within the compatible
6.0 series. ESLint is upgraded from 8 to 10, and the TypeScript ESLint packages
are updated together within their compatible 8.x series. The old import plugin
is replaced with `eslint-plugin-import-x`, which supports ESLint 10 and preserves
the recommended import checks. ESLint 8 and 9 are both past end of life.
The lockfile records the installed dependency versions for reproducible installs.

The old `.eslintrc.json` and `.eslintignore` are replaced by `eslint.config.mjs`.
The old lint command selected only TypeScript files; the new command also checks
JavaScript tests and the lint configuration itself. Warnings now fail the command
so they are visible in automated checks as well as local output.

When upgrading these packages later, check their compatibility together instead
of independently selecting every latest major version. A newer TypeScript compiler
can be used alongside a compatible compiler API in some setups, but this project
currently uses one compatible TypeScript version for simplicity.

References: [TypeScript ESLint dependency versions](https://typescript-eslint.io/users/dependency-versions/),
[ESLint configuration migration](https://eslint.org/docs/latest/use/configure/migration-guide),
[ESLint version support](https://eslint.org/version-support/), and
[the import-x plugin](https://github.com/un-ts/eslint-plugin-import-x).
