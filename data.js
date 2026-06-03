// ── Drought Board data ────────────────────────────────────────
// "Years since a champion nation last beat a fellow World Cup
// champion in a World Cup match." Sorted longest-first.
// Every label exists EN + pt-BR; layout is designed to the longer
// (pt-BR) string. Precise "Xy Yd" computed to a fixed as-of date
// (2026-06-03); the big number is whole years.

const PHASE = {
  group:   { en: "Group stage",   pt: "Fase de grupos" },
  r16:     { en: "Round of 16",   pt: "Oitavas de final" },
  quarter: { en: "Quarter-final", pt: "Quartas de final" },
  semi:    { en: "Semi-final",    pt: "Semifinal" },
  final:   { en: "Final",         pt: "Final" },
};

const NATION = {
  england:   { en: "England",   pt: "Inglaterra", kit: "#F4F8F0", kitInk: "#D4122A" },
  brazil:    { en: "Brazil",    pt: "Brasil",     kit: "#FFD93B", kitInk: "#1F8A45" },
  spain:     { en: "Spain",     pt: "Espanha",    kit: "#ED2939", kitInk: "#FFCE2E" },
  italy:     { en: "Italy",     pt: "Itália",     kit: "#1FA85A", kitInk: "#F4F8F0" },
  uruguay:   { en: "Uruguay",   pt: "Uruguai",    kit: "#74B4E4", kitInk: "#2C3F9E" },
  germany:   { en: "Germany",   pt: "Alemanha",   kit: "#2A2A2A", kitInk: "#FFCE2E" },
  france:    { en: "France",    pt: "França",     kit: "#2A37A0", kitInk: "#F4F8F0" },
  argentina: { en: "Argentina", pt: "Argentina",  kit: "#74B4E4", kitInk: "#2C3F9E" },
};

// rank order is longest-first; ties broken by precise days
const DROUGHT = [
  { rank: 1, nation: "england",   beat: "argentina", score: "1-0",
    scorePt: "1-0", phase: "group",   wc: 2002, years: 24, precise: { en: "23y 361d", pt: "23a 361d" } },
  { rank: 2, nation: "brazil",    beat: "germany",   score: "2-0",
    scorePt: "2-0", phase: "final",   wc: 2002, years: 24, precise: { en: "23y 339d", pt: "23a 339d" } },
  { rank: 3, nation: "spain",     beat: "germany",   score: "1-0",
    scorePt: "1-0", phase: "semi",    wc: 2010, years: 16, precise: { en: "15y 331d", pt: "15a 331d" } },
  { rank: 4, nation: "italy",     beat: "england",   score: "2-1",
    scorePt: "2-1", phase: "group",   wc: 2014, years: 12, precise: { en: "11y 354d", pt: "11a 354d" } },
  { rank: 5, nation: "uruguay",   beat: "italy",     score: "1-0",
    scorePt: "1-0", phase: "group",   wc: 2014, years: 12, precise: { en: "11y 344d", pt: "11a 344d" } },
  { rank: 6, nation: "germany",   beat: "argentina", score: "1-0",
    scorePt: "1-0", phase: "final",   wc: 2014, years: 12, precise: { en: "11y 325d", pt: "11a 325d" } },
  { rank: 7, nation: "france",    beat: "england",   score: "2-1",
    scorePt: "2-1", phase: "quarter", wc: 2022, years: 3,  precise: { en: "3y 175d",  pt: "3a 175d" } },
  { rank: 8, nation: "argentina", beat: "france",    score: "3-3 (4-2 pens)",
    scorePt: "3-3 (4-2 pên.)", phase: "final", wc: 2022, years: 3, precise: { en: "3y 167d", pt: "3a 167d" } },
];

// ── i18n: every UI label, EN + pt-BR ──────────────────────────
const STR = {
  years:        { en: "YEARS",  pt: "ANOS" },
  yearsLc:      { en: "years",  pt: "anos" },
  boardTitle:   { en: "CHAMPIONS' DROUGHT BOARD", pt: "PLACAR DA SECA DOS CAMPEÕES" },
  boardSub:     { en: "Years since a World Cup champion last beat a fellow champion",
                  pt: "Anos desde que um campeão mundial venceu outro campeão" },
  asOf:         { en: "AS OF JUN 2026 · 8 CHAMPIONS",
                  pt: "EM JUN 2026 · 8 CAMPEÕES" },
  rank:         { en: "RANK",   pt: "POS" },
  nation:       { en: "NATION", pt: "SELEÇÃO" },
  drought:      { en: "DROUGHT", pt: "SECA" },
  lastWin:      { en: "LAST WIN OVER A CHAMPION", pt: "ÚLTIMA VITÓRIA SOBRE CAMPEÃO" },
  beatLabel:    { en: "BEAT",   pt: "VENCEU" },
  worldCup:     { en: "WORLD CUP", pt: "COPA DO MUNDO" },
  longest:      { en: "LONGEST", pt: "MAIOR SECA" },
  shortest:     { en: "SHORTEST", pt: "MENOR SECA" },
  shareCta:     { en: "SHARE", pt: "COMPARTILHAR" },
  tapDetail:    { en: "TAP A NATION FOR DETAIL", pt: "TOQUE NUMA SELEÇÃO PARA DETALHE" },
  precise:      { en: "TO THE DAY", pt: "ATÉ O DIA" },
  // headline templates — {N} and {NATION} substituted
  headline:     { en: "years since {NATION} beat a fellow World Cup champion",
                  pt: "anos desde que {NATION} venceu um campeão mundial em Copa" },
  // share copy (title + text) — {NATION} substituted
  shareTitle:   { en: "Champions' Drought Board", pt: "Placar da Seca dos Campeões" },
  shareText:    { en: "{NATION}: {YEARS}y since last beating a World Cup champion.",
                  pt: "{NATION}: {YEARS}a desde a última vitória sobre um campeão mundial." },
};

function shareText(row, lang) {
  const nation = lz(NATION[row.nation], lang);
  return lz(STR.shareText, lang).replace("{NATION}", nation).replace("{YEARS}", row.years);
}

function lz(obj, lang) { return obj ? (obj[lang] || obj.en) : ""; }

// detail line: "{Opponent} · {score} · {phase} · {WC} World Cup"
function detailLine(row, lang) {
  const opp = lz(NATION[row.beat], lang);
  const score = lang === "pt" ? row.scorePt : row.score;
  const phase = lz(PHASE[row.phase], lang);
  const wc = lang === "pt" ? `Copa de ${row.wc}` : `${row.wc} World Cup`;
  return `${opp} · ${score} · ${phase} · ${wc}`;
}
function headlineText(row, lang) {
  const nation = lz(NATION[row.nation], lang);
  return lz(STR.headline, lang).replace("{NATION}", nation);
}

Object.assign(window, { DROUGHT, NATION, PHASE, STR, lz, detailLine, headlineText, shareText });
