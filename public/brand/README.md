# Scripture Space — Brand Identity

**A Little Space for the Word.**

The mark is an **SS monogram** — two letterforms set so that the negative space between
them holds an open book. The book is not an added illustration; it sits in the gap the
letters create, and it is what makes the mark read as Scripture Space rather than as two
letters.

Everything here is **original vector geometry** — no stock marks, no traced artwork, no
copied symbols. There are no gradients, shadows, glows or 3D effects anywhere in the set.

## Files

### Monogram

| File | Use |
| --- | --- |
| `mark.svg` | Primary monogram — navy on transparent |
| `mark-dark.svg` | Soft ivory monogram for midnight-navy backgrounds |
| `mark-light.svg` | Navy monogram on ivory (has a background fill) |
| `mark-mono.svg` | Single-colour navy monogram, for one-colour reproduction |
| `mark-small.svg` | **Small cut** — heavier strokes and a larger book, legible to 24px |

### Lockups

| File | Use |
| --- | --- |
| `logo-primary.svg` | Horizontal lockup, navy + gold — website headers, letterhead |
| `logo-stacked.svg` | Stacked lockup, navy + gold — print, social, promotional material |
| `logo-dark.svg` / `logo-stacked-dark.svg` | Same lockups in soft ivory for dark backgrounds |
| `logo-light.svg` | Lockup for white and ivory backgrounds |
| `logo-mono.svg` / `logo-stacked-mono.svg` | Single-colour versions |

### App icons

| File | Use |
| --- | --- |
| `app-icon.svg` | Midnight navy tile, ivory mark + gold book |
| `app-icon-forest.svg` | Deep forest tile, ivory mark + gold book |
| `app-icon-ivory.svg` | Ivory tile, navy mark + gold book |

### Presentation

`brand-sheet.png` — the full identity sheet showing every required variation, the palette,
and the scale test.

### Raster exports

`png/` holds transparent-background PNGs for web use:

- `logo-*@2x.png`, `mark-*@2x.png` — retina lockups and monograms
- `app-icon@1x.png`, `app-icon-forest@1x.png`, `app-icon-ivory@1x.png` — 512px icons
- `favicon-{16,32,48,64,128,180,256,512}.png` — raster favicons at true pixel sizes

## Palette

| Name | Hex | Role |
| --- | --- | --- |
| Midnight Navy | `#172554` | Primary ink |
| Warm Gold | `#D4A72C` | Accent — rules and the book |
| Soft Ivory | `#FAF9F6` | Light ground |
| Deep Forest | `#344E41` | Alternate tile |

## Typography

- **Wordmark** — Fraunces Semibold, all caps, `0.155em` tracking. The wide tracking is what
  gives the wordmark its editorial, bookish feel; do not tighten it.
- **Tagline** — Inter Regular, `0.075em` tracking, set in navy (not gold). Gold on ivory
  measures about 2.1:1 contrast, which is too low for small text, so gold is reserved for
  rules and the book, where it reads as an accent rather than as text.

Both are available on Google Fonts. The SVGs reference them by family name with system
fallbacks, so the lockups still render correctly if the webfonts have not loaded.

## Two cuts of the monogram

The primary cut (stroke `44`, book at `0.60`) is the default and should be used at **32px
and above**. Below that, switch to the small cut — it thickens the strokes to `58` and
enlarges the book to `0.82` so the mark survives favicon sizes.

Always use the small cut on app icons and favicons, whatever the resolution.

## Rules

- Keep clear space around the lockup equal to the height of the monogram's book.
- Never set the tagline in gold, and never let the book drop below the stroke colour.
- Do not stretch, rotate, outline, or add effects to the marks.
- The monochrome version is the fallback whenever only one ink is available — not an
  afterthought.