# Loc Style Finder

A single-page tool for choosing a men's loc style by attributes rather than by photo.
Open `index.html` directly, or through GitHub Pages at `/locs/`.

## Files

- `index.html` – the page (browse, head-to-head, compare, shortlist, prompts, scoring).
- `catalog.js` – the 38 styles, the 15-attribute schema, sources, and the photo-prompt template. Shared by the page and the generator.
- `img/` – optional photoreal reference images, one per style, plus `img/manifest.json` naming them. The page falls back to its attribute-drawn schematics when an image is missing.
- `../../tools/gen_images.py` – generates the images with an image model.

## Getting photoreal images

Images are not committed until someone with an image-model key runs the generator:

```bash
export OPENAI_API_KEY=...        # or GEMINI_API_KEY, REPLICATE_API_TOKEN, STABILITY_API_KEY
python3 tools/gen_images.py      # about 38 calls, a few dollars; skips styles that already have an image
git add docs/locs/img && git commit -m "Add loc style reference images"
```

Every prompt uses one fixed template (same man, same framing, same light, same backdrop) and only the hair sentences vary, so the resulting photos can be compared on the hairstyle alone. `--dry-run` prints the prompts; the Prompts tab in the page shows and copies them too, for use with any other image tool. Images made elsewhere can be dropped into `img/` by hand: add an entry to `manifest.json` like

```json
"wicks": {"file": "img/wicks.jpg", "provider": "manual", "model": "", "created": "2026-10-02"}
```

In the page itself, the Add photo button on a style sheet stores a picture in the browser only (IndexedDB), which is handy for saving examples found through the photo-search links.
