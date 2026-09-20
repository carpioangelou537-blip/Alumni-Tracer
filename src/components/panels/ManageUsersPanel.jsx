import { useState } from "react";
import Icon from "../ui/Icon";
import { ProgramSelect, YearSelect } from "../ui/Selects";
import { StatusPill, VerifyPill } from "../ui/Pills";

export default function ManageUsersPanel({ alumni, onAdd, onRemove }) {
  const [name, setName] = useState("");
  const [program, setProgram] = useState("BS Computer Science");
  const [year, setYear] = useState(String(new Date().getFullYear()));

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), program, gradYear: year });
    setName("");
  }

  return (
    <div className="panel-block">
      <form className="panel-form" onSubmit={submit}>
        <div className="row">
          <label>
            Full name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Juan Dela Cruz" />
          </label>
          <ProgramSelect value={program} onChange={setProgram} />
          <YearSelect value={year} onChange={setYear} />
        </div>
        <button type="submit" className="btn-ghost" style={{ alignSelf: "flex-start" }}>
          <Icon name="plus" size={14} /> Add alumnus
        </button>
      </form>

      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Program</th><th>Year</th><th>Survey</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {alumni.map((a) => (
              <tr key={a.id}>
                <td>{a.name}{a.isSelf ? " (You)" : ""}</td>
                <td>{a.program}</td>
                <td>{a.gradYear}</td>
                <td><StatusPill status={a.surveyCompleted} /></td>
                <td><VerifyPill status={a.verificationStatus} /></td>
                <td>
                  {!a.isSelf && (
                    <button className="btn-danger" onClick={() => onRemove(a.id)} aria-label={`Remove ${a.name}`}>
                      <Icon name="trash" size={15} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}