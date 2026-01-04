# Steering Document

Development guidelines for this TanStack Start fullstack application deployed to CloudFlare.

## Deployed environment

Updates can be deployed using `npm run deploy`

Once deployed:

- The website is available at `https://workout-tracker.terodox.workers.dev/`
- The API is available at `https://workout-tracker.terodox.workers.dev/api/`

## Code Structure and Modularity

- **Never create a file longer than 500 lines of code.** If a file approaches this limit, refactor by splitting it into modules or helper files.
- **Organize code into clearly separated modules**, grouped by feature or responsibility.
- **Use clear, consistent imports** (prefer relative imports within packages).

## Typescript

- NEVER use the `as` keyword outside of tests
- NEVER use the `!` operator outside of tests
- Use type guards to validate all external input and API responses
- Use `zod` to define and validate ALL external interfaces
- **All props passed into components must be strictly typed**
- **Avoid `any` type** — use `unknown` instead and validate the value
- **Use `Readonly<>` and `Record<>`** to prevent accidental mutation of data
- **Prefer `exact` zod object definitions** — avoid `strict` as it's deprecated
- **Use `interface` over `type`** when defining object shapes
- **Use object definitions over union types or enums**

Example of objects definitions over union types or enums:

```typescript
// Good ✅
const Pet = {
  Cat: 'cat',
  Dog: 'dog',
  Bird: 'bird',
} as const

type Pet = (typeof Pet)[keyof typeof Pet]
const isValidPet = (value: string): value is Pet =>
  Object.values(Pet).includes(value)

// Bad ❌
enum Pet {
  Cat,
  Dog,
  Bird,
}

// Bad ❌
enum Pet {
  Cat = 'cat',
  Dog = 'dog',
  Bird = 'bird',
}
```

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
- **BEM naming** - e.g., .header, .header**nav, .header**nav-link--active
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
