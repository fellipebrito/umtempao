// ── umtempao.com · competitions registry ──────────────────────
// Two-level hub: the root (/) lists competitions; each competition
// hub (/<competition.slug>/) lists its boards. Adding a competition =
// new top-level folder + entry here. Adding a board = new entry in
// that competition's `boards` + its own folder under the competition.
//
// SLUG STANDARD: lowercase, hyphen-separated, accent-stripped.
// URL shape: /<competition.slug>/<board.slug>/

const COMPETITIONS = [
  {
    slug: "copa-do-mundo",
    name: "Copa do Mundo",
    tagline: "Painéis da maior competição do futebol — secas, marcos e contadores.",
    boards: [
      {
        slug: "sem-ganhar-de-um-campeao",
        sentence: "um tempão sem ganhar de um campeão",
        title: "Sem ganhar de um campeão",
        description: "Anos desde que cada seleção campeã venceu outra em Copa do Mundo.",
        image: "/copa-do-mundo/sem-ganhar-de-um-campeao/og-image.png",
      },
      {
        slug: "a-ultima-vez",
        sentence: "um tempão desde a última vez na Copa",
        title: "A última vez",
        description: "Toda seleção da história da Copa: últimas quartas, semi e final — e há quanto tempo.",
        image: "/copa-do-mundo/a-ultima-vez/og-image.png",
      },
    ],
  },
  // Future: { slug: "premier-league", ... }, { slug: "brasileirao", ... }
];

const competitionBySlug = (slug) => COMPETITIONS.find((c) => c.slug === slug);

Object.assign(window, { COMPETITIONS, competitionBySlug });
