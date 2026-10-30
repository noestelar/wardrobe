---
name: verify-wardrobe
description: Capture Wardrobe UI screenshots at phone (~390px) and desktop (≥860px) widths and attach the PNGs to a pull request. Use when a change affects layout, CSS, responsive behavior, or any screen a person sees in this Vite/React app.
---

# Verify Wardrobe

Use this for pull requests that change UI, layout, or CSS. Skip it when the diff cannot change what the browser renders (API-only, skill text, or docs that are not the app).

The canonical skill lives at `.agents/skills/verify-wardrobe/`. Cursor and Claude Code discover the symlinks at `.cursor/skills/verify-wardrobe` and `.claude/skills/verify-wardrobe`.

## Capture

From the repository root, after `npm install`:

```bash
npx playwright install chromium
npm run evidence
```

`npm run evidence` builds the app, starts Vite preview, and writes PNGs under `docs/evidence/`:

| File | Viewport | Screen |
| --- | --- | --- |
| `gallery-390.png` | 390×844 | Gallery home |
| `gallery-860.png` | 860×900 | Gallery home |
| `dialog-390.png` | 390×844 | Try before you buy dialog |
| `dialog-860.png` | 860×900 | Try before you buy dialog |

Desktop width defaults to **860**. Set `EVIDENCE_DESKTOP=1440` when the change is specific to a wide layout; the desktop filenames follow that width (`gallery-1440.png`). Both 860 and 1440 satisfy the “at least 860px” rule.

`EVIDENCE_URL` points the same script at an already running dev or preview server instead of starting one. `EVIDENCE_OUT` changes the output directory.

Headless Chromium is required. `npm install` does not download a browser. If launch fails because the browser is missing, run `npx playwright install chromium` and retry.

## What the gallery shows

Wardrobe reads the local library from `data/` (gitignored). With no library, the gallery shots show the empty state (“Drop, paste, or add a photo…”) plus the header and category nav. That chrome is enough for layout checks. When `data/` exists locally, the same script screenshots the real grid. Do not commit `.env`, `data/`, personal photos, or API keys. Do not invent a fixture library just to fill the grid.

The dialog shots open **Try before you buy**, which does not need wardrobe items.

## Read the PNGs

Open every PNG and look at it before saying the UI work is done. Check that:

- the phone image is about 390px wide and the other is at least 860px wide
- the header, navigation, and dialog fit the viewport without clipped controls
- the change you made is visible in the shot that should show it

## Attach to the pull request

GitHub CLI **2.99+** uploads attachments to `github.com/user-attachments` when the path includes alt text after `#`:

```bash
gh pr comment --body 'Evidence screenshots (390 + 860)' \
  --attach 'docs/evidence/gallery-390.png#Phone ~390px gallery' \
  --attach 'docs/evidence/gallery-860.png#Desktop ~860px gallery' \
  --attach 'docs/evidence/dialog-390.png#Phone ~390px try-on dialog' \
  --attach 'docs/evidence/dialog-860.png#Desktop ~860px try-on dialog'
```

Run that from the repo so `gh` targets the right pull request, or pass the PR number (`gh pr comment 123 …`).
