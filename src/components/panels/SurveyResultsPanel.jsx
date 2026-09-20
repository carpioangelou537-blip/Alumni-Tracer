import { isEmployedStatus } from "../../lib/utils";
import Icon from "../ui/Icon";
import EmptyState from "../ui/EmptyState";

export default function SurveyResultsPanel({ alumni, surveyResponses }) {
  const total = alumni.length;
  const completed = alumni.filter((a) => a.surveyCompleted).length;
  const employed = alumni.filter((a) => isEmployedStatus(a.employed)).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  const empPct = total ? Math.round((employed / total) * 100) : 0;
  const done = alumni.filter((a) => a.surveyCompleted);

  return (
    <div className="panel-block">
      <div className="access-check-row">
        <div className="access-check-item">
          <Icon name="chart" size={16} />
          <span>Each submitted survey is stored in the survey responses table and drives these stats.</span>
        </div>
        <div className="access-check-stat">
          <b>{surveyResponses ? surveyResponses.length : "-"}</b>
          <span>responses recorded</span>
        </div>
      </div>
      <div className="bar-row" style={{ marginTop: 4 }}>
        <div className="bar-label">Survey completion</div>
        <div className="bar-track"><div className="bar-fill" style={{ width: `${pct}%` }} /></div>
        <div className="bar-value">{pct}%</div>
      </div>
      <div className="bar-row">
        <div className="bar-label">Employed alumni</div>
        <div className="bar-track"><div className="bar-fill" style={{ width: `${empPct}%` }} /></div>
        <div className="bar-value">{empPct}%</div>
      </div>
      <div className="list-block" style={{ marginTop: 18 }}>
        {done.length === 0 && <EmptyState icon="chart" text="No survey responses yet. They'll appear here as alumni submit theirs." />}
        {done.map((a) => (
          <div className="list-item" key={a.id}>
            <div className="list-item-main">
              <div className="list-item-title">{a.name}{a.isSelf ? " (You)" : ""}</div>
              <div className="list-item-sub">{a.program} · {a.employed}</div>
            </div>
            <div className="chip-row">{a.skills.slice(0, 3).map((s) => <span className="chip" key={s}>{s}</span>)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}