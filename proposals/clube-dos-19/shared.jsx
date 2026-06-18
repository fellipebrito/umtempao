/* global React, window */
// ── CLUBE DOS 19 · shared UI kit ──────────────────────────────
// 16-bit arcade CRT system: Space Mono, neon-on-deep-purple, hard
// non-blurred shadows, chunky pixel frames, scanline veil.
// Includes the SNES-style player avatars (head + nation kit).
// Wrapped in an IIFE so only window.UI leaks (pages destructure these
// names, which would otherwise collide in global scope).
(function () {

const { STR, t, withLang, lang, setLang } = window.C19;

// ════════════════════════════════════════════════════════════
// SNES PLAYER AVATARS — 16×16 pixel sprites (head + uniform).
// Each sprite is 16 rows × 16 chars; chars map to a per-player
// palette. '.' = transparent. Authored to read at ~32-72px.
//   b outline · H hair · 2 skin · e eye · m mouth · f facial hair
//   j jersey · k jersey trim/collar · w jersey white (stripes)
// ════════════════════════════════════════════════════════════
const SPRITES = {
  // Ronaldo R9 — shaved head + iconic front tuft, Brazil kit
  r9: { pal: { b: "#161023", H: "#15110E", 2: "#C68642", e: "#161023", m: "#6E3A2A", j: "#FFD400", k: "#1E7A3E" },
    rows: [
      "...bbbbbbbbbb...", "...b22222222b...", "...b222HH222b...", "...b222HH222b...",
      "...b22e22e22b...", "...b22222222b...", "...b22222222b...", "...b222mm222b...",
      "....b222222b....", "......2222......", "....kk2222kk....", "..jjjjjkkjjjjj..",
      "..jjjjjjjjjjjj..", ".jjjjjjjjjjjjjj.", "jjjjjjjjjjjjjjjj", "jjjjjjjjjjjjjjjj",
    ] },
  // Pelé — short black hair, dark skin, Brazil kit
  pele: { pal: { b: "#161023", H: "#0E0B08", 2: "#5A3A22", e: "#161023", m: "#3A2418", j: "#FFD400", k: "#1E7A3E" },
    rows: [
      "...bbbbbbbbbb...", "...bHHHHHHHHb...", "...bHHHHHHHHb...", "...bH222222Hb...",
      "...b22e22e22b...", "...b22222222b...", "...b22222222b...", "...b222mm222b...",
      "....b222222b....", "......2222......", "....kk2222kk....", "..jjjjjkkjjjjj..",
      "..jjjjjjjjjjjj..", ".jjjjjjjjjjjjjj.", "jjjjjjjjjjjjjjjj", "jjjjjjjjjjjjjjjj",
    ] },
  // Messi — brown hair + beard, Argentina sky-blue/white stripes
  messi: { pal: { b: "#161023", H: "#5A3A22", 2: "#E8B98C", e: "#161023", m: "#8A4A38", f: "#2E2014", w: "#EDF3F0", k: "#5AA9E6" },
    rows: [
      "...bbbbbbbbbb...", "...bHHHHHHHHb...", "...bHHHHHHHHb...", "...bH222222Hb...",
      "...bH2e22e2Hb...", "...b22222222b...", "...b2f2222f2b...", "...bf22mm22fb...",
      "....bf2222fb....", "......2222......", "....ww2222ww....", "..wkwkwkwkwkwk..",
      "..wkwkwkwkwkwk..", ".wkwkwkwkwkwkwk.", "wkwkwkwkwkwkwkwk", "wkwkwkwkwkwkwkwk",
    ] },
  // Gerd Müller — 70s sideburns + mustache, Germany white kit
  muller: { pal: { b: "#161023", H: "#2E2014", 2: "#E3AE84", e: "#161023", m: "#8A4A38", f: "#241A10", j: "#F2F2F2", k: "#15110E" },
    rows: [
      "...bbbbbbbbbb...", "...bHHHHHHHHb...", "...bHHHHHHHHb...", "...bH222222Hb...",
      "...bH2e22e2Hb...", "...bH222222Hb...", "...b22222222b...", "...b22ffff22b...",
      "....b22mm22b....", "......2222......", "....kk2222kk....", "..jjjjjkkjjjjj..",
      "..jjjjjjjjjjjj..", ".jjjjjjjjjjjjjj.", "jjjjjjjjjjjjjjjj", "jjjjjjjjjjjjjjjj",
    ] },
  // Klose — short brown hair, clean, Germany white kit
  klose: { pal: { b: "#161023", H: "#6E4A2C", 2: "#E6B488", e: "#161023", m: "#8A4A38", j: "#F2F2F2", k: "#15110E" },
    rows: [
      "...bbbbbbbbbb...", "...bHHHHHHHHb...", "...bHHHHHHHHb...", "...bH222222Hb...",
      "...b22e22e22b...", "...b22222222b...", "...b22222222b...", "...b222mm222b...",
      "....b222222b....", "......2222......", "....kk2222kk....", "..jjjjjkkjjjjj..",
      "..jjjjjjjjjjjj..", ".jjjjjjjjjjjjjj.", "jjjjjjjjjjjjjjjj", "jjjjjjjjjjjjjjjj",
    ] },
};

// render a sprite → array of <rect>, merging horizontal runs of one color
function spriteRects(sprite) {
  const out = [];
  sprite.rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === ".") { x++; continue; }
      let w = 1;
      while (x + w < row.length && row[x + w] === ch) w++;
      out.push(<rect key={`${x}-${y}`} x={x} y={y} width={w} height={1} fill={sprite.pal[ch] || "#f0f"} />);
      x += w;
    }
  });
  return out;
}

// PlayerAvatar — head+kit sprite framed in the player's accent.
function PlayerAvatar({ id, size = 48, accent, frame = true, style = {} }) {
  const p = window.C19.playerById(id);
  const sp = SPRITES[id];
  const ring = accent || (p && p.accent) || "var(--sx-cyan)";
  return (
    <span style={{
      display: "inline-block", lineHeight: 0, background: "var(--sx-crt-900)",
      border: frame ? `2px solid ${ring}` : "none",
      boxShadow: frame ? "var(--sx-num-shadow-sm)" : "none", ...style,
    }}>
      <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" style={{ display: "block" }}>
        {sp ? spriteRects(sp) : null}
      </svg>
    </span>
  );
}

// tiny nation flag chip (kept for nation clarity where useful)
function FlagChip({ code, size = 20, style = {} }) {
  return (
    <img src={`/flags/${code}.svg`} alt={code} width={size} height={size * (20 / 30)}
      style={{ display: "block", imageRendering: "pixelated", border: "1px solid var(--sx-crt-900)", ...style }} />
  );
}

// ── primitives ────────────────────────────────────────────────
function Scanlines({ opacity = 0.4 }) {
  return <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
    background: "var(--sx-scanline)", mixBlendMode: "multiply", opacity }} />;
}

function Cap({ children, color = "var(--sx-accent)", style = {} }) {
  return <span style={{ font: "var(--ttt-t-micro)", letterSpacing: "0.14em",
    textTransform: "uppercase", color, ...style }}>{children}</span>;
}

function PixelBall({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ display: "block" }}>
      <rect x="2" y="0" width="6" height="10" fill="var(--sx-chalk)" />
      <rect x="0" y="2" width="10" height="6" fill="var(--sx-chalk)" />
      <rect x="1" y="1" width="8" height="8" fill="var(--sx-chalk)" />
      <rect x="4" y="3" width="2" height="2" fill="var(--sx-crt-900)" />
      <rect x="2" y="5" width="2" height="2" fill="var(--sx-crt-900)" />
      <rect x="6" y="5" width="2" height="2" fill="var(--sx-crt-900)" />
      <rect x="4" y="7" width="2" height="1" fill="var(--sx-crt-900)" />
    </svg>
  );
}

function BigNumber({ value, size = 120, color = "var(--sx-number)", shadow }) {
  return <span style={{ fontFamily: "var(--ttt-font-display)", fontWeight: 700, color, fontSize: size,
    lineHeight: 0.82, letterSpacing: "-0.04em", textShadow: shadow || "var(--sx-num-shadow)",
    fontVariantNumeric: "tabular-nums", display: "inline-block", WebkitFontSmoothing: "none" }}>{value}</span>;
}

function Wordmark({ small }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <PixelBall size={small ? 18 : 22} />
      <Cap color="var(--sx-ink-dim)" style={{ fontSize: small ? 11 : 12 }}>{t(STR.wordmark)}</Cap>
    </div>
  );
}

function Credit() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <Cap color="var(--sx-ink-faint)" style={{ fontSize: 10 }}>{t(STR.credit1)}</Cap>
      <a href="https://fellipebrito.com" target="_blank" rel="noopener" style={{ textDecoration: "none" }}>
        <Cap color="var(--sx-ink-dim)" style={{ fontSize: 11 }}>BUILT BY FELLIPE BRITO · FELLIPEBRITO.COM</Cap>
      </a>
    </div>
  );
}

// PT/EN toggle + proposal switcher, fixed top-right
function ProposalNav({ current }) {
  const items = [
    ["index.html", t(STR.nav.menu)],
    ["p1-leaderboard.html", t(STR.nav.p1)],
    ["p2-statbars.html", t(STR.nav.p2)],
    ["p3-cards.html", t(STR.nav.p3)],
  ];
  const langBtn = (val, label) => (
    <button key={val} onClick={() => setLang(val)} style={{
      font: "var(--ttt-t-micro)", letterSpacing: "0.06em", cursor: "pointer", padding: "5px 8px",
      color: lang === val ? "var(--sx-crt-900)" : "var(--sx-ink-dim)",
      background: lang === val ? "var(--sx-magenta)" : "transparent",
      border: `2px solid ${lang === val ? "var(--sx-magenta)" : "var(--sx-crt-600)"}`,
    }}>{label}</button>
  );
  return (
    <div style={{ position: "fixed", top: 12, right: 12, zIndex: 50, display: "flex", flexWrap: "wrap",
      gap: 4, padding: 6, justifyContent: "flex-end", maxWidth: "calc(100vw - 24px)",
      background: "var(--sx-crt-900)", border: "2px solid var(--sx-crt-600)", boxShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}>
      {items.map(([href, label]) => {
        const on = href === current;
        return (
          <a key={href} href={withLang(href)} style={{
            font: "var(--ttt-t-micro)", letterSpacing: "0.08em", textDecoration: "none", padding: "5px 9px",
            color: on ? "var(--sx-crt-900)" : "var(--sx-ink-dim)",
            background: on ? "var(--sx-cyan)" : "transparent",
            border: `2px solid ${on ? "var(--sx-cyan)" : "var(--sx-crt-600)"}` }}>{label}</a>
        );
      })}
      <span style={{ width: 2, background: "var(--sx-crt-600)", margin: "0 2px" }} />
      {langBtn("pt", "PT")}
      {langBtn("en", "EN")}
    </div>
  );
}

Object.assign(window, { UI: {
  Scanlines, Cap, PixelBall, BigNumber, Wordmark, Credit, ProposalNav,
  PlayerAvatar, FlagChip, SPRITES,
} });

})();
