/* global React, ReactDOM */
// ── App: live board + tap-through nation card + EN/PT toggle ──

const { LangCtx } = window;
const rowOf = (nation) => window.DROUGHT.find((r) => r.nation === nation);

// ── EN / PT-BR segmented toggle ───────────────────────────────
function LangToggle({ lang, setLang }) {
  const seg = (val, label) => (
    <button onClick={() => setLang(val)} style={{
      padding: "9px 16px", border: "none", cursor: "pointer",
      background: lang === val ? "var(--sx-yellow)" : "transparent",
      color: lang === val ? "#0C0820" : "var(--sx-ink-dim)",
      font: "700 12px var(--ttt-font-ui)", letterSpacing: "0.08em",
    }}>{label}</button>
  );
  return (
    <div style={{
      position: "fixed", bottom: 18, left: "50%", transform: "translateX(-50%)", zIndex: 50,
      display: "flex", alignItems: "center", gap: 10,
      background: "var(--sx-crt-900)", border: "3px solid var(--sx-cyan)",
      boxShadow: "6px 6px 0 rgba(0,0,0,0.5)", padding: "6px 8px 6px 12px",
      fontFamily: "var(--ttt-font-ui)",
    }}>
      <window.PixelBall size={16} />
      <span style={{ font: "var(--ttt-t-micro)", letterSpacing: "0.12em", color: "var(--sx-ink-faint)" }}>LANG</span>
      <div style={{ display: "flex", border: "2px solid var(--sx-crt-600)" }}>
        {seg("en", "EN")}
        {seg("pt", "PT-BR")}
      </div>
    </div>
  );
}

// Read ?nation= / ?lang= once on mount so /s/<nation>.html deep-links
// land on the live board with the right nation pre-selected.
function readInitialQuery() {
  const p = new URLSearchParams(window.location.search);
  const lang = p.get("lang") === "pt" ? "pt" : "en";
  const nation = p.get("nation");
  const valid = nation && window.DROUGHT.some((r) => r.nation === nation);
  return { lang, nation: valid ? nation : null };
}

// ── App ───────────────────────────────────────────────────────
function App() {
  const initial = React.useMemo(readInitialQuery, []);
  const [lang, setLang] = React.useState(initial.lang);
  const [selectedNation, setSelectedNation] = React.useState(initial.nation);
  const ctx = React.useMemo(() => ({ lang, replay: 0 }), [lang]);

  const onShare = React.useCallback((row, l) => {
    if (typeof window.shareNation === "function") window.shareNation(row.nation, l);
  }, []);

  return (
    <LangCtx.Provider value={ctx}>
      {selectedNation
        ? <window.NationCard
            row={rowOf(selectedNation)}
            onBack={() => setSelectedNation(null)}
            onShare={onShare}
          />
        : <window.BoardMobile onSelectNation={setSelectedNation} />}
      <LangToggle lang={lang} setLang={setLang} />
    </LangCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
