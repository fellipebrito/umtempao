/* global window */
// ── CLUBE DOS 19 · dataset + i18n ─────────────────────────────
// Head-to-head of the five greatest men's World Cup goalscorers.
// Source: "Clube dos 19" comparison sheet (Clubedos19.html).
// Numbers transcribed verbatim; where the source shows a disputed /
// alternate figure in parentheses we keep it in `disp`.
//
// Wrapped in an IIFE so only window.C19 leaks into the shared global
// lexical scope (the proposal pages destructure these names).
(function () {

const PLAYERS = [
  { id: "klose", name: "Klose",    full: "Miroslav Klose", flag: "ger", years: "2002–2014", accent: "#FF8A3D", goals: 16 },
  { id: "r9",    name: "Ronaldo",  full: "Ronaldo (R9)",   flag: "bra", years: "1998–2006", accent: "#34E6D9", goals: 15 },
  { id: "muller",name: "G. Müller",full: "Gerd Müller",    flag: "ger", years: "1970–1974", accent: "#5BE37E", goals: 14 },
  { id: "messi", name: "Messi",    full: "Lionel Messi",   flag: "arg", years: "2006–2022", accent: "#FF3DA6", goals: 13 },
  { id: "pele",  name: "Pelé",     full: "Edson Arantes",  flag: "bra", years: "1958–1970", accent: "#FFE24D", goals: 12 },
];

// M(key, labelPt, labelEn, group, better, vals, opts)
//   better: "high" = bigger wins · "low" = smaller wins (e.g. min/goal)
const M = (key, label, en, group, better, vals, opts = {}) =>
  ({ key, label, en, group, better, vals, unit: opts.unit || "", disp: opts.disp || null, note: opts.note || null });

const METRICS = [
  // ── VOLUME ────────────────────────────────────────────────
  M("gols", "Gols em Copas", "World Cup goals", "Volume", "high",
    { r9: 15, messi: 13, pele: 12, muller: 14, klose: 16 },
    { disp: { r9: "14 (15)" }, note: { pt: "R9: 14 oficiais, 15 contando o anulado", en: "R9: 14 official, 15 counting the disallowed one" } }),
  M("edicoes", "Copas disputadas", "World Cups played", "Volume", "high",
    { r9: 4, messi: 5, pele: 4, muller: 2, klose: 4 }),
  M("jogos", "Jogos", "Matches", "Volume", "high",
    { r9: 19, messi: 26, pele: 14, muller: 13, klose: 24 }),
  M("minutos", "Minutos em campo", "Minutes played", "Volume", "high",
    { r9: 1624, messi: 2315, pele: 1260, muller: 1230, klose: 1793 }, { unit: "min" }),
  M("jogosMarcando", "Jogos marcando", "Matches scoring", "Volume", "high",
    { r9: 11, messi: 11, pele: 8, muller: 9, klose: 11 }),

  // ── EFICIÊNCIA ────────────────────────────────────────────
  M("golJogo", "Gols por jogo", "Goals per match", "Eficiência", "high",
    { r9: 0.79, messi: 0.50, pele: 0.86, muller: 1.08, klose: 0.66 }),
  M("minGol", "Minutos por gol", "Minutes per goal", "Eficiência", "low",
    { r9: 116, messi: 178.1, pele: 105, muller: 87.8, klose: 112.1 }, { unit: "min" }),
  M("hatTricks", "Hat-tricks", "Hat-tricks", "Eficiência", "high",
    { r9: 0, messi: 0, pele: 1, muller: 2, klose: 1 }),
  M("golsUmJogo", "Recorde de gols num jogo", "Most goals in a match", "Eficiência", "high",
    { r9: 2, messi: 2, pele: 3, muller: 3, klose: 3 }),
  M("maisGolsEdicao", "Mais gols numa edição", "Most goals in one edition", "Eficiência", "high",
    { r9: 8, messi: 7, pele: 6, muller: 10, klose: 5 }, { disp: { r9: "7 (8)" } }),

  // ── CRIAÇÃO ───────────────────────────────────────────────
  M("assist", "Assistências", "Assists", "Criação", "high",
    { r9: 4, messi: 8, pele: 7, muller: 5, klose: 3 },
    { disp: { messi: "6 (8)", pele: "6 (7)", klose: "2 (3)" } }),
  M("golAssist", "Gols + assistências", "Goals + assists", "Criação", "high",
    { r9: 19, messi: 21, pele: 19, muller: 19, klose: 19 },
    { disp: { r9: "18 (19)", messi: "19 (21)", pele: "18 (19)", klose: "18 (19)" } }),
  M("partTotais", "Participações totais em gols", "Total goal involvements", "Criação", "high",
    { r9: 20, messi: 25, pele: 19, muller: 20, klose: 19 }),

  // ── DECISIVO ──────────────────────────────────────────────
  M("mataMata", "Gols no mata-mata", "Knockout-stage goals", "Decisivo", "high",
    { r9: 8, messi: 5, pele: 7, muller: 6, klose: 5 }),
  M("finais", "Gols em finais", "Goals in finals", "Decisivo", "high",
    { r9: 2, messi: 2, pele: 3, muller: 1, klose: 0 }),
  M("golVitoria", "Gols da vitória", "Winning goals", "Decisivo", "high",
    { r9: 3, messi: 2, pele: 3, muller: 6, klose: 1 }),
  M("artilheiro", "Edições como artilheiro", "Editions as top scorer", "Decisivo", "high",
    { r9: 1, messi: 0, pele: 0, muller: 1, klose: 1 }),
  M("craque", "Edições como craque do torneio", "Editions as best player", "Decisivo", "high",
    { r9: 1, messi: 2, pele: 1, muller: 0, klose: 0 }),

  // ── ESTILO ────────────────────────────────────────────────
  M("cabeceio", "Gols de cabeça", "Headed goals", "Estilo", "high",
    { r9: 1, messi: 0, pele: 2, muller: 5, klose: 7 }),
  M("chute", "Gols com os pés", "Goals with the feet", "Estilo", "high",
    { r9: 13, messi: 13, pele: 10, muller: 9, klose: 9 }),
  M("penalti", "Gols de pênalti", "Penalty goals", "Estilo", "high",
    { r9: 1, messi: 4, pele: 0, muller: 1, klose: 0 }),
  M("foraArea", "Gols de fora da área", "Goals from outside the box", "Estilo", "high",
    { r9: 2, messi: 4, pele: 2, muller: 0, klose: 0 }),

  // ── PLACAR FINAL ──────────────────────────────────────────
  M("topicosLider", "Tópicos em que lidera", "Categories led (full sheet)", "Resumo", "high",
    { r9: 30, messi: 35, pele: 32, muller: 46, klose: 32 }),
];

const GROUPS = ["Volume", "Eficiência", "Criação", "Decisivo", "Estilo", "Resumo"];
const GROUP_EN = { "Volume": "Volume", "Eficiência": "Efficiency", "Criação": "Creation",
  "Decisivo": "Decisive", "Estilo": "Style", "Resumo": "Summary" };

// ── i18n strings (pt / en) ────────────────────────────────────
const STR = {
  wordmark:   { pt: "CLUBE DOS 19 · GOLS EM COPAS", en: "CLUBE DOS 19 · WORLD CUP GOALS" },
  nav:        { menu: { pt: "Menu", en: "Menu" }, p1: { pt: "1 · Ranking", en: "1 · Ranking" },
                p2: { pt: "2 · Barras", en: "2 · Bars" }, p3: { pt: "3 · Cards", en: "3 · Cards" } },
  goalsShort: { pt: "gols", en: "goals" },
  lowerBetter:{ pt: "menor é melhor", en: "lower is better" },
  // menu
  menuTitleA: { pt: "Os 5 reis da Copa,", en: "The 5 kings of the World Cup," },
  menuTitleB: { pt: "frente a frente", en: "head to head" },
  menuIntro:  { pt: "Klose, Ronaldo, Gerd Müller, Messi e Pelé — os maiores artilheiros da história das Copas, comparados em mais de 20 estatísticas. Três jeitos de contar a mesma história. Escolha um.",
                en: "Klose, Ronaldo, Gerd Müller, Messi and Pelé — the greatest goalscorers in World Cup history, compared across 20+ stats. Three ways to tell the same story. Pick one." },
  cardWord:   { pt: "Proposta", en: "Proposal" },
  card1Title: { pt: "Ranking", en: "Ranking" },
  card1Blurb: { pt: "Pódio dos artilheiros. Número-herói gigante no líder, ranking vertical, troca a métrica e o pódio se reordena ao vivo.",
                en: "Scorers' podium. Giant hero number on the leader, vertical ranking, switch the stat and it reorders live." },
  card1Tag:   { pt: "Foco: quem lidera cada estatística", en: "Focus: who leads each stat" },
  card2Title: { pt: "Barras de combate", en: "Combat bars" },
  card2Blurb: { pt: "Cinco jogadores, uma métrica por vez, em barras neon estilo barra de vida de arcade. Navega por grupos de stats.",
                en: "Five players, one stat at a time, in neon arcade health-bars. Browse by stat group." },
  card2Tag:   { pt: "Foco: comparar todos numa métrica", en: "Focus: compare everyone on one stat" },
  card3Title: { pt: "Player select", en: "Player select" },
  card3Blurb: { pt: "Grade de cards estilo seleção de personagem. Cada lenda com avatar, ficha-resumo e tópicos liderados. Toca pra abrir.",
                en: "Character-select card grid. Each legend with avatar, summary sheet and categories led. Tap to open." },
  card3Tag:   { pt: "Foco: perfil de cada jogador", en: "Focus: each player's profile" },
  // p1
  p1Sub:      { pt: "Proposta 1 · Ranking", en: "Proposal 1 · Ranking" },
  p1Switch:   { pt: "Trocar estatística", en: "Switch stat" },
  // p2
  p2Sub:      { pt: "Proposta 2 · Barras de combate", en: "Proposal 2 · Combat bars" },
  p2Title:    { pt: "5 lendas, uma estatística por vez", en: "5 legends, one stat at a time" },
  p2Clear:    { pt: "(clique de novo p/ limpar)", en: "(click again to clear)" },
  // p3
  p3Sub:      { pt: "Proposta 3 · Player select", en: "Proposal 3 · Player select" },
  p3Title:    { pt: "Escolha sua lenda", en: "Pick your legend" },
  p3Intro:    { pt: "Toque num card para abrir a ficha completa. ★ marca os tópicos em que o jogador lidera o grupo.",
                en: "Tap a card to open the full sheet. ★ marks the categories where the player leads the group." },
  p3LedFoot:  { pt: "Tópicos liderados", en: "Categories led" },
  goalsCap:   { pt: "GOLS", en: "GOALS" },
  p3Leads:    { pt: (a, b) => `lidera ${a} de ${b} tópicos`, en: (a, b) => `leads ${a} of ${b} categories` },
  leadTag:    { pt: "★ líder", en: "★ leads" },
  close:      { pt: "Fechar", en: "Close" },
  credit1:    { pt: "DADOS · CLUBE DOS 19", en: "DATA · CLUBE DOS 19" },
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
// preserve current lang when linking between proposal pages
const withLang = (path) => path + (lang === "en" ? "?lang=en" : "");

const metricLabel = (m) => L(m.label, m.en);
const groupLabel = (g) => L(g, GROUP_EN[g]);

// leader id(s) for a metric, respecting better high/low
function leadersOf(metric) {
  const entries = PLAYERS.map((p) => [p.id, metric.vals[p.id]]);
  const best = metric.better === "low"
    ? Math.min(...entries.map((e) => e[1]))
    : Math.max(...entries.map((e) => e[1]));
  return entries.filter((e) => e[1] === best).map((e) => e[0]);
}
// players sorted best→worst for a metric
function rankFor(metric) {
  return PLAYERS.map((p) => ({ p, v: metric.vals[p.id] }))
    .sort((a, b) => metric.better === "low" ? a.v - b.v : b.v - a.v);
}
const fmtVal = (m, id) => (m.disp && m.disp[id]) || String(m.vals[id]).replace(".", ",");
const playerById = (id) => PLAYERS.find((p) => p.id === id);

Object.assign(window, {
  C19: {
    PLAYERS, METRICS, GROUPS, GROUP_EN, STR,
    lang, t, L, setLang, withLang, metricLabel, groupLabel,
    leadersOf, rankFor, fmtVal, playerById,
  },
});

})();
