# umtempao.com — project guide

Viral sports "drought / milestone" boards. Brand: **um tempão…** (pt-BR). Each board
completes the phrase and shows day-accurate counters ("X anos, Y dias desde…").

## Stack — read this first

**Static site on GitHub Pages. NOT Next.js. No bundler, no SSR, no @vercel/og / Satori.**

- Pages are plain HTML + **React UMD + Babel-in-browser** (`<script type="text/babel">`). "Routes" = folders with `index.html`; deep state via `?query=` params.
- OG/share cards are **Playwright screenshots** of a React card component at 1200×630 (`scripts/bake-*.mjs`), committed as PNGs. There is no server-side image generation.
- Counters tick **client-side** from anchor dates (see `copa-do-mundo/a-ultima-vez/counter.jsx`).
- Custom domain via `CNAME` (`umtempao.com`). Deploy = `.github/workflows/deploy.yml` runs `npm run build` and uploads the whole dir.

If a brief assumes Next.js / Satori / a "Counter Engine" module — it's wrong about this repo. Build on the real stack.

## URL structure (two-level)

```
/                                    competition selector  (index.html)
/<competition>/                      competition hub        (e.g. /copa-do-mundo/)
/<competition>/<board>/              a board
/<competition>/<board>/?n=<slug>     board sub-view (e.g. country page)
/<competition>/<board>/s/<...>.html  pre-baked share shells (OG unfurl)
/<competition>/<board>/og/<...>.png  baked OG images
```

Registry: **`competitions.js`** (`COMPETITIONS` → each has `boards[]`), loaded absolutely by both hubs.
Shared assets live at root and are linked with **absolute** paths so nesting depth never matters:
`/colors_and_type.css`, `/tokens-soccer.css`, `/fonts/`, `/flags/`, `/data/`, `/scripts/`, `/competitions.js`.

Slugs: lowercase, hyphenated, accent-stripped, pt-BR.

## Boards

- `copa-do-mundo/sem-ganhar-de-um-campeao/` — 8 WC champions ranked by years since they last beat a fellow champion. Bilingual (data in `data.js`).
- `copa-do-mundo/a-ultima-vez/` — every nation that ever played a men's WC; last quartas/semi/final + live counters + country pages. Bilingual EN/PT (`?lang=en`); strings in `counter.jsx#I18N`.

## Data pipeline (a-ultima-vez)

`scripts/build-nations.mjs` downloads the jfjelstul/worldcup `matches.csv` and derives
`data/nations.json` (+ a window-attached twin `copa-do-mundo/a-ultima-vez/nations.data.js`).
Era→stage rules are **data**, not code: `data/tournament-formats.json`. 2026 qualifiers: `data/qualified-2026.json`.

- **9 test gates fail the build** (`process.exit(1)`) if any stage year is wrong — never hand-write stage years; every number comes from the CSV.
- Dataset `*_team_code` is **ISO-3166** (`deu`), not FIFA (`ger`) — `build-nations.mjs` has a FIFA override map. Flags key off the FIFA code.

## Flags

Flat pixel-art SVGs, `viewBox="0 0 30 20"` (3:2), Satori-safe (no fonts/filters/refs), keyed by
**lowercase FIFA code** at `/flags/<fifa>.svg`. `scripts/check-flags.mjs` writes `data/flags-manifest.json`
and **fails the build** if any nation's flag is missing — never render a blank. (Champions board uses its own
procedural `<Flag>` in `flags.jsx`, not these files.)

## Build & bake

```
npm run build          # build:nations (CSV + gates) → build:share → build:ulv-share → check:flags
npm run serve          # python http.server on :8000 (needed for bakes)
npm run bake:og        # champions board OG (Playwright) — node scripts/bake-og-image.mjs <nation>
npm run bake:ulv-og    # a-ultima-vez OG: 249 cards — append `all` for every nation; board card baked separately
```

`npm run build` is what CI runs; it must stay green. Counters in baked cards are frozen at bake time —
re-bake when data changes meaningfully.

## Add a new competition

1. New top-level folder `/<competition>/` with an `index.html` hub (copy `copa-do-mundo/index.html`, swap the `competitionBySlug` call).
2. Add an entry to `COMPETITIONS` in `competitions.js`.
3. Boards go under `/<competition>/<board>/`.

## Clube dos 19 (proposals) + 2026 live refresh

Standalone infographic prototypes under `proposals/clube-dos-19*/` — NOT registered in
`competitions.js`, reachable only by direct URL. Compares the greatest men's WC goalscorers
across ~23 metrics. Two folders:

- `proposals/clube-dos-19/` — the **locked base**: 5 players, all numbers hand-charted by
  **Marcel Pilati** (source `~/Downloads/Clubedos19.html`). Don't edit its data.
- `proposals/clube-dos-19-2026/` — **live variant**: adds **Mbappé** + updates **Messi** for
  the 2026 World Cup. `topicosLider` dropped (Pilati's 110-metric count is obsolete here).

Architecture: each folder has its own `data.js` (`window.C19`); both reuse
`proposals/clube-dos-19/shared.jsx` (`window.UI`). Players are **16×16 pixel SNES avatars**
in `shared.jsx` `SPRITES` (head + nation kit, NOT `/flags/`). Bilingual EN/PT (`?lang=` +
localStorage). Share card: `share-card.html` per folder → `node scripts/bake-c19-og.mjs <slug>`
→ `og-image.png` (committed); OG/Twitter tags point at it. The 2026 `data.js` helpers
(`leadersOf`/`rankFor`/`fmtVal`/`metricMax`) are **null-safe** — a `null` value = "stat not
charted", renders as `—`. Never invent a hand-charted cell to fill a blank.

**DATA INTEGRITY RULE:** the base sheet is Pilati's rigorous manual charting. The 2026 variant
splits attribution in its footer (`STR.credit1`): base = Marcel Pilati, Mbappé + 2026 deltas =
live web research (ESPN/Wikipedia). Only ~6 metrics are reliably crawlable (goals, editions,
matches, goals/game, hat-tricks, finals goals + arithmetic from a goal-by-goal list). The other
~17 are hand-charted (body part, game phase, individual vs assisted, winning goals, exact
penalties, min/goal) — for Mbappé/2026 they stay `null` unless a real source confirms them.

### How to refresh after a new Argentina / France match (live WC)

It's frozen at a date (`STR.asOf` + the magenta stamp). Re-run when Messi/Mbappé play again:

1. **Research the match(es)**, citing sources (don't trust memory — these are post-cutoff):
   - Headline (HIGH conf., crawlable): new WC goals total, matches +1, hat-trick?, goals in a
     match record, finals goals (if a final), Golden Boot/Ball.
     Good sources: ESPN player "World Cup history/stats" page; Wikipedia "List of international
     goals scored by <player>" (goal-by-goal: date, stage, opponent, foot/header); the match
     report for how each goal was scored (foot/head, in/out of box, penalty, assisted/solo).
   - Derived (`~`): jogosMarcando, mataMata (if knockout), chute vs cabeceio, foraArea, penalti —
     only from the goal-by-goal detail; otherwise leave as-is and note it.
   - `minutos`/`minGol`: live minutes aren't reliably published mid-tournament → estimate and keep
     the `note` flagging it as partial, or leave prior value.
2. **Show Fellipe a verification table** (value + confidence per cell) and get sign-off BEFORE
   editing — same flow used to add Mbappé. Bake only confirmed cells.
3. Edit `proposals/clube-dos-19-2026/data.js`: bump the confirmed `vals`, update `ASOF` to the new
   date, adjust `note`s. Leave unconfirmed hand-charted cells `null`.
4. Re-bake the card: `npm run serve` (if not up) then `node scripts/bake-c19-og.mjs clube-dos-19-2026`.
   Eyeball `og-image.png`. WhatsApp caches previews — share a `?v=N` URL or use FB's Sharing Debugger.
5. Commit + push (`main` auto-deploys via `deploy.yml`); verify `https://umtempao.com/proposals/clube-dos-19-2026/`.

## Conventions

- Conventional commits (`feat:`/`fix:`/`refactor:`/`chore:`…), separate commits per logical unit.
- **NEVER** add Claude/Anthropic attribution to git content — a commit-msg hook blocks it. Use `Generated by NOVA` if any.
- Match existing patterns; absolute asset paths; keep `data/sources/` (the downloaded CSV) gitignored.
