export default function ChatLauncher() {
  return (
    <details style={{ position: "fixed", right: 18, bottom: 18, zIndex: 1000 }}>
      <summary style={{ listStyle: "none", cursor: "pointer", borderRadius: 999, background: "#ff7a1a", color: "#111", fontWeight: 900, padding: "13px 18px", boxShadow: "0 10px 30px rgba(0,0,0,.35)" }}>Ask ArmorTech</summary>
      <div style={{ position: "absolute", right: 0, bottom: 58, width: "min(390px, calc(100vw - 28px))", height: "min(610px, calc(100vh - 110px))", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,122,26,.55)", background: "#090909", boxShadow: "0 22px 70px rgba(0,0,0,.55)" }}>
        <iframe title="ArmorTech Service Desk" src="https://armortechrepair.com/assistant" style={{ width: "100%", height: "100%", border: 0, display: "block" }} allow="clipboard-write" />
      </div>
    </details>
  );
}
