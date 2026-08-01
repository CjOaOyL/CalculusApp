# Mission Packs — project brief & build spec

**Read this before writing any code or content for a new pack.**
This file is the source of truth for *why* these exist and *how* they must be built.
It was written after building the first three packs; follow it and a new pack will
feel like part of the same series.

---

## 1. What this is

A family of **self-contained offline HTML learning games** built for a parent's kids
during travel (originally Provence, summer 2026). Each "pack" is one topic. The parent
generates packs; the kids play them on their own phones/tablets, often with no network.

Two pack types exist:

| Type | Example | Purpose |
|---|---|---|
| **Story pack** (dossier) | `nuclear-france.html`, `les-baux.html` | Read + interact + answer. Done before/after a visit. |
| **Hunt pack** (chasse) | `hunt-les-baux.html` | Photo scavenger hunt tied to a *confirmed* outing. Done on site. |

A topic usually gets a story pack; it gets a hunt pack **only when a specific visit is
actually planned**. Hunts must never require a detour — every item must be findable on
a route the family is already taking, or claimable via the web-image fallback.

## 2. Audience & voice

- **Ages 12–15, precocious, they like reading.** Write at genuine high-school level.
  Do not simplify concepts; do simplify sentences. No baby talk, no exclamation-mark
  enthusiasm, no "Did you know?!" framing.
- **Respect them with real difficulty.** The best questions have no lookup-able answer
  and require combining two facts from different sections.
- **Honesty is the house style.** Every pack must include failures, unsolved problems,
  and the strongest version of the opposing argument. A pack that only praises its
  subject is a failed pack. (See `les-baux` Pièce 3 — steelman Richelieu *and* his
  victims; `nuclear-france` Pièce 5 — Flamanville, the 2022 corrosion crisis,
  Superphénix.)
- **Never moralize or land on a political conclusion.** Rubrics must explicitly say
  "any reasoned position can score full marks."
- Dry wit is welcome. Sentimentality is not.

## 3. The five non-negotiables

1. **One self-contained HTML file per pack.** All CSS, JS, and content inline. No build
   step required to run, no external assets, no CDN, no fonts to fetch. It must work
   opened from a phone with airplane mode on.
2. **Offline-first, online-enhanced.** Everything core works with no network. Network
   unlocks only: AI evaluation of queued answers, and reference links.
3. **Local auto-save** (`localStorage`, namespaced `missionpack:<pack-id>`), plus an
   export/import code as the cross-device path. Never lose a kid's work.
4. **Mobile-first.** Designed at 390px. Test at 390 and 768. No horizontal overflow, ever.
5. **French woven in, never bolted on.** Vocabulary appears inside the sentences the kid
   is already reading, as tap-to-reveal. Interface labels are French. Content is English.

## 4. The pedagogical model

Each story pack is a **mission with a role**, not a chapter of a textbook:

- *nuclear-france*: "You are France's energy minister. It's 1974. There's a crisis."
- *les-baux*: "A dead fortress. A rock that named a metal. Your inheritance file is open."

Give the kid a **job title and a stake**, then let the sections be documents in their file.

**Every pack must contain a genuine surprise** — a fact that overturns the naive framing.
This is the single most important content requirement. Examples built so far:
- Making French electricity *completely free* only cuts a household bill ~39%.
- Taxing French power like New Jersey saves *more* than free reactors would.
- Aluminium is the most abundant metal in the crust yet once cost more than gold.
- The ruins at Les Baux aren't decay — they're a demolition the residents were billed for.

Find the equivalent for each new topic before writing a word. If a pack has no
surprise, it isn't ready.

**Cross-link packs.** Les Baux's bauxite section points at the nuclear pack (smelting is
electricity); the quarry marks point at the Pont du Gard conversation. Recurring threads
make the series feel like one world.

## 5. Structure of a story pack

7 sections ("Pièces"), ~500–900 words each, in this shape:

1. **The hook / the situation** — set the stakes, hand them the role.
2. **How it worked / scaled** — the mechanism. Usually the best simulator slot.
3. **The economics** — follow the money. Always.
4. **The environment / physical constraints.**
5. **The failures** — mandatory. Label it plainly ("read closely").
6. **Today & why it matters to you** — modern relevance, ideally touching the kids' own
   lives (AI data centres, over-tourism, their phone).
7. **Les Sources** — real references, with a media-literacy question attached (e.g. "which
   of these is a primary source?", "is the Dante legend evidence?").

Per section: 2–5 questions, 3–5 vocab words, optionally one interactive.

### Question tiers (point values are load-bearing — keep them)

| Type | Points | Behaviour |
|---|---|---|
| `mcq` | 10 first try, 5 after a miss | Instant feedback + explanation that teaches something *new*, not a restatement. |
| `selfcheck` | 8 / 5 / 2 (honour system) | They write first, then reveal a model answer and self-score. |
| `ai` | up to 20 | Queued in the outbox, graded by Claude against a rubric when online. |

Rules: `mcq` explanations must add a fact. `ai` questions must be genuinely arguable and
require ≥3 specific facts from the pack. Every rubric must reward acknowledging a
counter-argument and must state that any defensible position can earn full marks.

A section stamps **VALIDÉ** when all its non-AI questions are done.

## 6. Structure of a hunt pack

10–15 items, three tiers:

| Tier | Label | Points | Meaning |
|---|---|---|---|
| 1 | REPÉRAGE | 5 | Anyone can spot it. |
| 2 | ŒIL DE CHEVALIER | 10 | Needs a sharp eye. |
| 3 | SAVOIR DU DOSSIER | 15 | **Only findable if they read the story pack.** |

Tier 3 is the point of the whole hunt — it converts reading into seeing. Examples:
the sixteen-rayed star (needs the Balthazar legend), the "Post tenebras lux" window
(needs to know Les Baux was Protestant → Richelieu's motive), sheared-off tower faces
(needs to know 1632 was deliberate).

Mechanics every hunt must have:
- **Own photo = full points; web image = half**, and the web path *requires* a sentence
  on where they'd have seen it in person.
- **Observation items** (`obs:true`) — count something, type the number. Their data
  becomes evidence for a story-pack brief.
- **`reveal`** — the history unlocked *after* the find. This is where the teaching lives;
  write it as the payoff, not a caption.
- **Zone filters** (château / village / route / anywhere) so they can work by location.
- Photos downscaled to ~760px @ 0.72 JPEG before storage.

## 7. Technical contract

```
localStorage keys:  missionpack:<pack-id>            (state, no photos)
                    missionpack:<pack-id>:photo:<id> (one key per photo)
```
- Storage must degrade gracefully: feature-detect, and if unavailable show
  "⚠ AUTO-SAVE UNAVAILABLE — KEEP THE CODE" rather than failing silently.
- A `wiped` flag must suppress the `pagehide`/`visibilitychange` save during a reset,
  or reset races the auto-save and progress comes back from the dead. (Real bug, fixed.)
- Save codes: base64 of the state JSON, **excluding photo data**. Loading a code must
  *merge* (preserve in-memory photos), never blind-assign.
- AI endpoint lives in one config constant:
  ```js
  const CONFIG = { aiEndpoint:"https://api.anthropic.com/v1/messages", aiModel:"claude-sonnet-4-6" };
  ```
  Keyless only inside Claude.ai artifacts. **When hosted on the user's own site, this must
  point at a small proxy (e.g. a Cloudflare Worker) holding the API key server-side.**
  Never put an API key in the HTML.
- Report export: a standalone HTML blob download containing photos, answers, AI feedback,
  vocab and final rank. This is the kid's souvenir and the only thing that survives a
  cleared browser.

## 8. Design language

Deliberately **not** a generic ed-tech app. It's a government dossier / archive file.

```
--paper:#F4F2EA  --paper2:#ECE9DE  --card:#FBFAF5  --line:#C8C3B2
--ink:#22262E    --ink2:#5A5F6A
--navy:#16345F   --bleu:#0B57A4    --rouge:#C21F30  --amber:#E39A1D  --ok:#2E7D46
```
- Body: Georgia/serif. Headings: Arial Narrow, uppercase, letter-spaced. Numbers: monospace.
- Sticky header with a segmented **gauge** (PUISSANCE / PRESTIGE / OBSERVATION) + rank.
- Ranks are themed per pack (Stagiaire→Ministre; Page→Prince(sse) des Baux;
  Page→Maître/sse des Archives).
- Rotated red "classified" stamp on the cover; green **VALIDÉ** stamp on completed sections.
- Bottom dock: Sommaire · À évaluer · Sauvegarde · Rapport.
- Respect `prefers-reduced-motion`. Visible focus outlines. No `<form>` tags.

Keep the French interface labels identical across packs so the kids learn them once.

## 9. Repo layout (target)

```
/engine/engine.js      shared logic (extracted from the <script id="engine"> block)
/engine/style.css      shared design system
/packs/<id>.json       content only — the PACK / HUNT constant
/dist/<id>.html        built single-file distributable  ← what actually ships to kids
MISSION-PACKS.md       this file
```
The single-file build is the product. Never ship a pack that needs a server to work.

Hosting: GitHub Pages on the user's own domain (`cjoaoyl.github.io`). Send **links, not
files** — phone mail/message previews don't execute JS, which makes packs look broken,
and file:// gives unreliable localStorage.

## 10. Workflow for a new pack

1. **Research first.** Get current, verified facts. Find the *surprise* (§4).
2. **Propose before building** — sections, the surprise, the interactive, the modern hook.
   The user prefers a plan to review.
3. Build content (the PACK constant), then wire interactives.
4. **Test headlessly** (Playwright, 390px + 768px): every interactive, every question type,
   save/reload persistence, reset, report download, zero console errors, no overflow.
5. Ship the single file. Keep prose in chat short — the file is the deliverable.

**Interactives are bespoke per pack.** Don't reuse a slider because one exists; build the
one that makes *this* topic's mechanism tangible. Built so far: a 1974 strategy choice,
a reactor build-cost simulator (learning curve), a live cost stack with hypotheticals,
a CO₂ ordering game, a deathbed inheritance decision, an aluminium→kWh calculator,
a timeline sort.

## 11. Known constraints & honest limits

- **No shared live leaderboard** — each kid has their own file/origin. Competition is
  "compare your Rapports." A real leaderboard needs a backend; don't fake it.
- **AI grading needs the proxy** once self-hosted (§7).
- **Storage is per-origin.** Opened from a mail preview, progress won't persist.
- Never use `localStorage` inside Claude.ai *artifacts* — it's unsupported there. The
  packs use it because they ship as downloaded/hosted files, not as artifacts.

## 12. Existing packs

| File | Topic | Notes |
|---|---|---|
| `nuclear-france.html` | French nuclear power | 7 Pièces; cost-stack interactive; ties to AI data centres |
| `les-baux.html` | Les Baux-de-Provence | 7 Pièces; bauxite chapter cross-links to nuclear |
| `hunt-les-baux.html` | Les Baux field hunt | 14 items, 135 pts |
| `cost-stack.html` | (adult reference) electricity cost analysis | Not a kids' pack — source material |

Candidate future packs: Pont du Gard / Roman engineering, Arles & the Romans, the
Camargue, Van Gogh in Saint-Rémy, a nuclear-infrastructure hunt (Linky meters, pylons,
Tricastin cooling towers).
