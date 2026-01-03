# Steering Document

Development guidelines for this TanStack Start fullstack application deployed to CloudFlare.

## Code Structure and Modularity

- **Never create a file longer than 500 lines of code.** If a file approaches this limit, refactor by splitting it into modules or helper files.
- **Organize code into clearly separated modules**, grouped by feature or responsibility.
- **Use clear, consistent imports** (prefer relative imports within packages).

## Testing and Reliability

- **Always create unit tests for all functions.**
- **After updating any logic**, check whether existing unit tests need to be updated. If so, do it.
- **Tests should live as a sibling to the file being tested** (e.g., `example.ts` → `example.test.ts`).
- **Integration tests should verify all APIs**, and all dependencies outside this codebase MUST be mocked.
- **Happy path readonly end-to-end tests must be written for all APIs.**
- **UI tests for all features must be written and maintained using Cypress.**
- **Test titles MUST follow Given/When/Then sentence format** (e.g., "Given a valid user, when login is called, then returns auth token").

## Styles

- **Sibling CSS files** - e.g., Header.tsx → Header.css (imported in Header.tsx)
- **BEM naming** - e.g., .header, .header__nav, .header__nav-link--active
- **No monolithic CSS files** - each component owns its styles

## Task Completion

- **Mark completed tasks** immediately after finishing them.
- Add new sub-tasks or TODOs discovered during development under a "Discovered During Work" section in the current task file.

## Documentation

- **All classes and functions must be documented with JSDoc.**
- **Package documentation MUST be maintained in README.md** and updated as needed.
- **Tests are documentation** — test titles must clearly describe behavior.
- **Comment non-obvious code** and ensure everything is understandable to a mid-level developer.
- When writing complex logic, **add an inline `# Reason:` comment** explaining the why, not just the what.

### 🧠 AI Behavior Rules

- **Never assume missing context. Ask questions if uncertain.**
- **Never hallucinate libraries or functions** – only use known, verified npm packages.
- **Always confirm file paths and module names** exist before referencing them in code or tests.
- **Never delete or overwrite existing code** unless explicitly instructed to or if part of a task
