import Icon from "../ui/Icon";
import EmptyState from "../ui/EmptyState";
import SkillRecommendations from "./SkillRecommendations";

export default function CareerToolsPanel({ me, jobs }) {
  const scored = jobs
    .map((j) => ({ ...j, overlap: j.skills.filter((s) => me.skills.some((ms) => ms.toLowerCase() === s.toLowerCase())) }))
    .sort((a, b) => b.overlap.length - a.overlap.length);

  return (
    <div className="panel-block">
      <div className="list-block">
        {scored.length === 0 && <EmptyState icon="brief" text="No postings yet — check back once the AAO publishes openings." />}
        {scored.map((j) => (
          <div className="list-item" key={j.id}>
            <div className="list-item-main">
              <div className="list-item-title">{j.title}</div>
              <div className="list-item-sub">{j.company}</div>
              <div className="chip-row" style={{ marginTop: 6 }}>
                {j.skills.map((s) => (
                  <span className={`chip ${j.overlap.includes(s) ? "match" : ""}`} key={s}>{s}</span>
                ))}
              </div>
            </div>
            {j.overlap.length > 0 && <span className="pill ok">{j.overlap.length} skill match{j.overlap.length === 1 ? "" : "es"}</span>}
            {j.link ? (
              <a
                href={j.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ whiteSpace: "nowrap", padding: "8px 14px", background: "linear-gradient(135deg, #8b1e3f, #5c0f1a)", color: "#fff", boxShadow: "0 10px 20px -10px rgba(92, 15, 26, 0.7)" }}
              >
                <Icon name="arrow" size={12} /> Visit Posting
              </a>
            ) : (
              <button
                className="btn-primary"
                style={{ whiteSpace: "nowrap", padding: "8px 14px", opacity: 0.82, cursor: "not-allowed", background: "linear-gradient(135deg, #8b1e3f, #5c0f1a)", color: "#fff", boxShadow: "0 10px 20px -10px rgba(92, 15, 26, 0.7)" }}
                type="button"
                disabled
              >
                <Icon name="arrow" size={12} /> Visit Posting
              </button>
            )}
          </div>
        ))}
      </div>
      <SkillRecommendations me={me} jobs={jobs} />
    </div>
  );
}