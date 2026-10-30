# Mobile-friendly wardrobe

## Objective and scope
Make the existing Vite/React wardrobe usable around 390px without changing architecture. Preserve desktop layouts. Do not touch data/ or secrets. User authorizes branch mobile-friendly, commits, push to origin and PR to main using existing gh authentication.

## Plan
- [ ] M1: Implement focused responsive CSS and light JSX for gallery, navigation, filters, item/outfit dialogs, editor and import flow. Verify npm run check and browser layouts; commit the coherent mobile behavior.
- [ ] M2: Independently verify phone and desktop layouts, record checks, push and open PR with phone verification instructions.

## Routing and checks
M1 delegated writer: five-file audit and multiple non-trivial edits trigger delegation. M2 delegated verifier for browser/build execution; parent owns git/gh delivery.
TDD: no explicit setting found by bounded audit; no unit test runner configured. Ordinary functional verification uses npm run check (vite build), git diff --check and browser layout checks if available. No invented RED evidence.
Acceptance: no horizontal page overflow at 390px, reachable touch controls, sticky headers, constrained scrolling dialogs, desktop preserved. Use mocked APIs only for browser checks, no data/ reads or writes.
Forecast: approximately 200-350 authored changed lines; delivery ask-on-risk, one PR if within 400 lines.
Rollback: revert mobile presentation changes and this task document; no schema/API/data changes.

## Progress
Audit completed. Existing viewport-fit=cover and basic mobile breakpoints retained. Missing outfit styling, small editor targets, modal viewport sizing, sticky headers and import-tray layering need focused fixes.
Engram mirror pending: detected project wardrobe is not yet in memory store; read/search reported unknown_project.
