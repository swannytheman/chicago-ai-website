# Brand source files

Original Canva exports of the Chicago AI Group logo. Kept as the source of truth,
deliberately **outside `public/`** so they are not copied into the deployed site —
together they are ~2 MB and nothing references them at runtime.

| File | Wordmark | Notes |
|---|---|---|
| `lockup-dark.svg` | white on dark | the one the shipped assets are derived from |
| `lockup-dark-alt.svg` | white on dark | near-duplicate |
| `lockup-light.svg` | navy on white | for print, invoices, light backgrounds |
| `lockup-light-alt.svg` | navy on white | near-duplicate |

Two things to know before reusing these:

1. **They are not real vector.** Each is PNG artwork inside an SVG wrapper — none of
   the 41 `<path>` elements carries a fill, and ~79% of each file is base64 image data.
   The artwork is 626×907 px (413×589 in the dark files), so it will not scale past
   that cleanly.
2. **None of them is transparent.** Every file has an opaque background plate baked in,
   including the two named "Transparent". `public/brand/mark.png` and
   `public/brand/lockup.png` were produced by removing that plate.

If the logo is ever redrawn, ask for a true outlined SVG, genuine transparency, and a
single-line horizontal lockup for the 40px site header.
