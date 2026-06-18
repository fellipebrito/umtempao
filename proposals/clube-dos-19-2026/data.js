/* global window */
// ── CLUBE DOS 19 · 2026 LIVE variant · dataset + i18n ─────────
// Adds Mbappé and updates Messi for the 2026 World Cup (in progress).
// FROZEN as of 17 Jun 2026 — re-run the research pass after each new
// Argentina / France match (see CLAUDE.md "Clube dos 19 — live refresh").
//
// Attribution is SPLIT, on purpose:
//   • Base 23-metric sheet (5 retired/2022 players) ...... Marcel Pilati
//   • Mbappé column + Messi 2026 deltas ................... live web research
//     (ESPN / Wikipedia), NOT Pilati's hand-charted figures.
// Cells that are Pilati hand-charted stats and have no public source for
// Mbappé are left null and render as "—". We never invent those.
//
// Wrapped in an IIFE so only window.C19 leaks.
(function () {

const ASOF = { pt: "ATUALIZADO 17 JUN 2026", en: "UPDATED 17 JUN 2026" };

const PLAYERS = [
  { id: "messi", name: "Messi",    full: "Lionel Messi",   flag: "arg", years: "2006–2026", accent: "#FF3DA6", goals: 16 },
  { id: "klose", name: "Klose",    full: "Miroslav Klose", flag: "ger", years: "2002–2014", accent: "#FF8A3D", goals: 16 },
  { id: "r9",    name: "Ronaldo",  full: "Ronaldo (R9)",   flag: "bra", years: "1998–2006", accent: "#34E6D9", goals: 15 },
  { id: "muller",name: "G. Müller",full: "Gerd Müller",    flag: "ger", years: "1970–1974", accent: "#5BE37E", goals: 14 },
  { id: "mbappe",name: "Mbappé",   full: "Kylian Mbappé",  flag: "fra", years: "2018–2026", accent: "#4D7CFF", goals: 14 },
  { id: "pele",  name: "Pelé",     full: "Edson Arantes",  flag: "bra", years: "1958–1970", accent: "#FFE24D", goals: 12 },
];

// M(key, labelPt, labelEn, group, better, vals, opts)  — vals may include null (= "—")
const M = (key, label, en, group, better, vals, opts = {}) =>
  ({ key, label, en, group, better, vals, unit: opts.unit || "", disp: opts.disp || null, note: opts.note || null });

const METRICS = [
  // ── VOLUME ────────────────────────────────────────────────
  M("gols", "Gols em Copas", "World Cup goals", "Volume", "high",
    { r9: 15, messi: 16, pele: 12, muller: 14, klose: 16, mbappe: 14 },
    { disp: { r9: "14 (15)" }, note: { pt: "Messi e Klose: 16 (recorde). R9: 14 oficiais, 15 com o anulado.", en: "Messi & Klose: 16 (record). R9: 14 official, 15 with the disallowed one." } }),
  M("edicoes", "Copas disputadas", "World Cups played", "Volume", "high",
    { r9: 4, messi: 6, pele: 4, muller: 2, klose: 4, mbappe: 3 }),
  M("jogos", "Jogos", "Matches", "Volume", "high",
    { r9: 19, messi: 27, pele: 14, muller: 13, klose: 24, mbappe: 15 }),
  M("minutos", "Minutos em campo", "Minutes played", "Volume", "high",
    { r9: 1624, messi: 2400, pele: 1260, muller: 1230, klose: 1793, mbappe: 1221 },
    { unit: "min", note: { pt: "Minutos de 2026 do Messi são estimados (parcial).", en: "Messi's 2026 minutes are estimated (partial)." } }),
  M("jogosMarcando", "Jogos marcando", "Matches scoring", "Volume", "high",
    { r9: 11, messi: 12, pele: 8, muller: 9, klose: 11, mbappe: 8 }),

  // ── EFICIÊNCIA ────────────────────────────────────────────
  M("golJogo", "Gols por jogo", "Goals per match", "Eficiência", "high",
    { r9: 0.79, messi: 0.59, pele: 0.86, muller: 1.08, klose: 0.66, mbappe: 0.93 }),
  M("minGol", "Minutos por gol", "Minutes per goal", "Eficiência", "low",
    { r9: 116, messi: 150, pele: 105, muller: 87.8, klose: 112.1, mbappe: 87.2 }, { unit: "min" }),
  M("hatTricks", "Hat-tricks", "Hat-tricks", "Eficiência", "high",
    { r9: 0, messi: 1, pele: 1, muller: 2, klose: 1, mbappe: 1 }),
  M("golsUmJogo", "Recorde de gols num jogo", "Most goals in a match", "Eficiência", "high",
    { r9: 2, messi: 3, pele: 3, muller: 3, klose: 3, mbappe: 3 }),
  M("maisGolsEdicao", "Mais gols numa edição", "Most goals in one edition", "Eficiência", "high",
    { r9: 8, messi: 7, pele: 6, muller: 10, klose: 5, mbappe: 8 }, { disp: { r9: "7 (8)" } }),

  // ── CRIAÇÃO ───────────────────────────────────────────────
  M("assist", "Assistências", "Assists", "Criação", "high",
    { r9: 4, messi: 8, pele: 7, muller: 5, klose: 3, mbappe: 2 },
    { disp: { messi: "6 (8)", pele: "6 (7)", klose: "2 (3)" } }),
  M("golAssist", "Gols + assistências", "Goals + assists", "Criação", "high",
    { r9: 19, messi: 24, pele: 19, muller: 19, klose: 19, mbappe: 16 },
    { disp: { r9: "18 (19)", pele: "18 (19)", klose: "18 (19)" } }),
  M("partTotais", "Participações totais em gols", "Total goal involvements", "Criação", "high",
    { r9: 20, messi: 28, pele: 19, muller: 20, klose: 19, mbappe: 16 }),

  // ── DECISIVO ──────────────────────────────────────────────
  M("mataMata", "Gols no mata-mata", "Knockout-stage goals", "Decisivo", "high",
    { r9: 8, messi: 5, pele: 7, muller: 6, klose: 5, mbappe: 8 }),
  M("finais", "Gols em finais", "Goals in finals", "Decisivo", "high",
    { r9: 2, messi: 2, pele: 3, muller: 1, klose: 0, mbappe: 4 }),
  M("golVitoria", "Gols da vitória", "Winning goals", "Decisivo", "high",
    { r9: 3, messi: 2, pele: 3, muller: 6, klose: 1, mbappe: null }),
  M("artilheiro", "Edições como artilheiro", "Editions as top scorer", "Decisivo", "high",
    { r9: 1, messi: 0, pele: 0, muller: 1, klose: 1, mbappe: 1 }),
  M("craque", "Edições como craque do torneio", "Editions as best player", "Decisivo", "high",
    { r9: 1, messi: 2, pele: 1, muller: 0, klose: 0, mbappe: 0 }),

  // ── ESTILO ────────────────────────────────────────────────
  M("cabeceio", "Gols de cabeça", "Headed goals", "Estilo", "high",
    { r9: 1, messi: 0, pele: 2, muller: 5, klose: 7, mbappe: 0 }),
  M("chute", "Gols com os pés", "Goals with the feet", "Estilo", "high",
    { r9: 13, messi: 16, pele: 10, muller: 9, klose: 9, mbappe: 14 }),
  M("penalti", "Gols de pênalti", "Penalty goals", "Estilo", "high",
    { r9: 1, messi: 4, pele: 0, muller: 1, klose: 0, mbappe: 2 }),
  M("foraArea", "Gols de fora da área", "Goals from outside the box", "Estilo", "high",
    { r9: 2, messi: 5, pele: 2, muller: 0, klose: 0, mbappe: null }),
];

const GROUPS = ["Volume", "Eficiência", "Criação", "Decisivo", "Estilo"];
const GROUP_EN = { "Volume": "Volume", "Eficiência": "Efficiency", "Criação": "Creation",
  "Decisivo": "Decisive", "Estilo": "Style" };

// ── i18n strings (pt / en) ────────────────────────────────────
const STR = {
  wordmark:   { pt: "CLUBE DOS 19 · GOLS EM COPAS · 2026", en: "CLUBE DOS 19 · WORLD CUP GOALS · 2026" },
  nav:        { menu: { pt: "Menu", en: "Menu" }, p1: { pt: "1 · Ranking", en: "1 · Ranking" },
                p2: { pt: "2 · Barras", en: "2 · Bars" }, p3: { pt: "3 · Cards", en: "3 · Cards" } },
  goalsShort: { pt: "gols", en: "goals" },
  lowerBetter:{ pt: "menor é melhor", en: "lower is better" },
  menuTitleA: { pt: "Os reis da Copa,", en: "The kings of the World Cup," },
  menuTitleB: { pt: "frente a frente", en: "head to head" },
  menuIntro:  { pt: "Klose e Messi empatados em 16, Ronaldo, Gerd Müller, Mbappé e Pelé — os maiores artilheiros da Copa, agora com Mbappé e a Copa de 2026 em andamento. Três jeitos de comparar.",
                en: "Klose and Messi level on 16, Ronaldo, Gerd Müller, Mbappé and Pelé — the greatest World Cup scorers, now with Mbappé and the 2026 tournament in progress. Three ways to compare." },
  cardWord:   { pt: "Proposta", en: "Proposal" },
  card1Title: { pt: "Ranking", en: "Ranking" },
  card1Blurb: { pt: "Pódio dos artilheiros. Número-herói gigante no líder, troca a métrica e o pódio se reordena ao vivo.",
                en: "Scorers' podium. Giant hero number on the leader, switch the stat and it reorders live." },
  card1Tag:   { pt: "Foco: quem lidera cada estatística", en: "Focus: who leads each stat" },
  card2Title: { pt: "Barras de combate", en: "Combat bars" },
  card2Blurb: { pt: "Seis jogadores, uma métrica por vez, em barras neon estilo barra de vida de arcade.",
                en: "Six players, one stat at a time, in neon arcade health-bars." },
  card2Tag:   { pt: "Foco: comparar todos numa métrica", en: "Focus: compare everyone on one stat" },
  card3Title: { pt: "Player select", en: "Player select" },
  card3Blurb: { pt: "Grade de cards estilo seleção de personagem. Cada lenda com avatar e ficha-resumo. Toca pra abrir.",
                en: "Character-select card grid. Each legend with avatar and summary sheet. Tap to open." },
  card3Tag:   { pt: "Foco: perfil de cada jogador", en: "Focus: each player's profile" },
  p1Sub:      { pt: "Proposta 1 · Ranking", en: "Proposal 1 · Ranking" },
  p1Switch:   { pt: "Trocar estatística", en: "Switch stat" },
  p2Sub:      { pt: "Proposta 2 · Barras de combate", en: "Proposal 2 · Combat bars" },
  p2Title:    { pt: "6 lendas, uma estatística por vez", en: "6 legends, one stat at a time" },
  p2Clear:    { pt: "(clique de novo p/ limpar)", en: "(click again to clear)" },
  p3Sub:      { pt: "Proposta 3 · Player select", en: "Proposal 3 · Player select" },
  p3Title:    { pt: "Escolha sua lenda", en: "Pick your legend" },
  p3Intro:    { pt: "Toque num card para abrir a ficha completa. ★ marca os tópicos em que o jogador lidera. “—” = dado não apurado.",
                en: "Tap a card to open the full sheet. ★ marks the categories where the player leads. “—” = not charted." },
  p3LedFoot:  { pt: "Tópicos liderados", en: "Categories led" },
  goalsCap:   { pt: "GOLS", en: "GOALS" },
  p3Leads:    { pt: (a, b) => `lidera ${a} de ${b} tópicos`, en: (a, b) => `leads ${a} of ${b} categories` },
  leadTag:    { pt: "★ líder", en: "★ leads" },
  close:      { pt: "Fechar", en: "Close" },
  credit1:    { pt: "BASE: MARCEL PILATI · 2026 + MBAPPÉ: APURAÇÃO ESPN/WIKIPEDIA", en: "BASE: MARCEL PILATI · 2026 + MBAPPÉ: ESPN/WIKIPEDIA RESEARCH" },
  asOf:       ASOF,
};

// ── language resolution (?lang= → localStorage → pt) ──────────
function resolveLang() {
  try {
    const p = new URLSearchParams(window.location.search).get("lang");
    if (p === "en" || p === "pt") { localStorage.setItem("c19lang", p); return p; }
    return localStorage.getItem("c19lang") || "pt";
  } catch (e) { return "pt"; }
}
const lang = resolveLang();
const t = (obj) => (obj == null ? "" : (obj[lang] != null ? obj[lang] : obj.pt));
const L = (pt, en) => (lang === "en" ? en : pt);
const setLang = (l) => {
  try { localStorage.setItem("c19lang", l); } catch (e) {}
  const u = new URL(window.location.href);
  u.searchParams.set("lang", l);
  window.location.href = u.toString();
};
const withLang = (path) => path + (lang === "en" ? "?lang=en" : "");

const metricLabel = (m) => L(m.label, m.en);
const groupLabel = (g) => L(g, GROUP_EN[g]);

// ── null-safe helpers (a null value = stat not charted) ───────
const has = (v) => v != null;
const presentVals = (metric) => PLAYERS.map((p) => metric.vals[p.id]).filter(has);
const metricMax = (metric) => { const v = presentVals(metric); return v.length ? Math.max(...v) : 0; };
const metricMin = (metric) => { const v = presentVals(metric); return v.length ? Math.min(...v) : 0; };

function leadersOf(metric) {
  const entries = PLAYERS.map((p) => [p.id, metric.vals[p.id]]).filter((e) => has(e[1]));
  if (!entries.length) return [];
  const best = metric.better === "low"
    ? Math.min(...entries.map((e) => e[1]))
    : Math.max(...entries.map((e) => e[1]));
  return entries.filter((e) => e[1] === best).map((e) => e[0]);
}
// players sorted best→worst; null values always sort last
function rankFor(metric) {
  const BIG = metric.better === "low" ? Infinity : -Infinity;
  return PLAYERS.map((p) => ({ p, v: metric.vals[p.id] }))
    .sort((a, b) => {
      const av = has(a.v) ? a.v : BIG, bv = has(b.v) ? b.v : BIG;
      return metric.better === "low" ? av - bv : bv - av;
    });
}
const fmtVal = (m, id) => {
  const v = m.vals[id];
  if (!has(v)) return "—";
  return (m.disp && m.disp[id]) || String(v).replace(".", ",");
};
const playerById = (id) => PLAYERS.find((p) => p.id === id);

Object.assign(window, {
  C19: {
    PLAYERS, METRICS, GROUPS, GROUP_EN, STR,
    lang, t, L, setLang, withLang, metricLabel, groupLabel,
    leadersOf, rankFor, fmtVal, metricMax, metricMin, playerById,
  },
});

})();
