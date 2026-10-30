# Agent notes

## UI screenshot evidence

Pull requests that change UI, layout, or CSS must attach PNG evidence at about **390px** wide and at least **860px** wide.

Attach the files with GitHub CLI **2.99 or newer** so the images land on `github.com/user-attachments`:

```bash
gh pr comment --attach 'docs/evidence/gallery-390.png#Phone ~390px gallery' --attach 'docs/evidence/gallery-860.png#Desktop ~860px gallery'
```

Read those PNGs yourself before claiming the work is done. Confirm the phone shot is about 390px wide, the wider shot is at least 860px wide, and the change is actually visible.

Use the verify-wardrobe skill (`.agents/skills/verify-wardrobe/SKILL.md`) and capture the shots with `npm run evidence`.
