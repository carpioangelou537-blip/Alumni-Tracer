import { useState } from "react";
import Icon from "../ui/Icon";
import { EMPLOYMENT_OPTIONS } from "../../lib/constants";

export default function SurveyFormPanel({ me, onSubmit, submitLabel = "Submit survey" }) {
  const [employed, setEmployed] = useState(EMPLOYMENT_OPTIONS.includes(me.employed) ? me.employed : "Unemployed");
  const [jobTitle, setJobTitle] = useState(me.jobTitle || "");
  const [companyName, setCompanyName] = useState(me.companyName || "");
  const [businessName, setBusinessName] = useState(me.businessName || "");
  const [years, setYears] = useState(me.years || "");
  const [skillsText, setSkillsText] = useState(me.skills.join(", "));
  const [done, setDone] = useState(me.surveyCompleted);

  function submit(e) {
    e.preventDefault();
    const skills = skillsText.split(",").map((s) => s.trim()).filter(Boolean);
    onSubmit({
      employed,
      jobTitle: employed === "Employed" ? jobTitle.trim() : "",
      companyName: employed === "Employed" ? companyName.trim() : "",
      businessName: employed === "Self Employed" ? businessName.trim() : "",
      years: employed === "Employed" || employed === "Self Employed" ? years.trim() : "",
      skills,
    });
    setDone(true);
  }

  return (
    <div className="panel-block">
      <form className="panel-form" onSubmit={submit}>
        <label>Current employment status
          <select value={employed} onChange={(e) => setEmployed(e.target.value)}>
            {EMPLOYMENT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>

        {employed === "Employed" && (
          <>
            <label>Current job title
              <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Junior Web Developer" required />
            </label>
            <div className="row">
              <label>Company name
                <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Iligan Digital Solutions" required />
              </label>
              <label>Years employed
                <input value={years} onChange={(e) => setYears(e.target.value)} type="number" min="0" step="0.5" placeholder="e.g. 2" required />
              </label>
            </div>
          </>
        )}

        {employed === "Self Employed" && (
          <div className="row">
            <label>Business name
              <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Reyes Web Studio" required />
            </label>
            <label>Years in business
              <input value={years} onChange={(e) => setYears(e.target.value)} type="number" min="0" step="0.5" placeholder="e.g. 3" required />
            </label>
          </div>
        )}

        <label>Skills gained since graduating (comma separated)
          <input value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="React, SQL, Project Management" />
        </label>
        <button type="submit" className="btn-primary btn-block" style={{ maxWidth: 240 }}>{submitLabel}</button>
        {done && <span className="confirm-badge"><Icon name="check" size={13} /> Survey on file — this feeds AAO's analytics</span>}
      </form>
    </div>
  );
}