import { useEffect, useMemo, useState } from "react";
import { ADMIN_FEATURES, getAlumniFeatures } from "../../lib/constants";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { AdminDashboardOverview, AlumniDashboardOverview } from "./DashboardOverviews";
import LoginAndVerificationPanel from "../panels/LoginAndVerificationPanel";
import ManageUsersPanel from "../panels/ManageUsersPanel";
import AlumniInfoPanel from "../panels/AlumniInfoPanel";
import SurveyResultsPanel from "../panels/SurveyResultsPanel";
import NotifyComposerPanel from "../panels/NotifyComposerPanel";
import AnalyticsPanel from "../panels/AnalyticsPanel";
import JobsAdminPanel from "../panels/JobsAdminPanel";
import EventsAdminPanel from "../panels/EventsAdminPanel";
import SurveyFormPanel from "../panels/SurveyFormPanel";
import JobAlignmentPanel from "../panels/JobAlignmentPanel";
import CareerToolsPanel from "../panels/CareerToolsPanel";
import EventsAlumniPanel from "../panels/EventsAlumniPanel";
import ProfileModal from "../modals/ProfileModal";
import SurveyModal from "../modals/SurveyModal";

export default function Dashboard({ role, name, me, domain, onLogout }) {
  const features = useMemo(() => (role === "admin" ? ADMIN_FEATURES : getAlumniFeatures()), [role]);
  const [active, setActive] = useState(features[0]?.title || "Dashboard");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [surveyOpen, setSurveyOpen] = useState(Boolean(me && role === "alumni" && !me.surveyCompleted));

  useEffect(() => {
    if (!features.some((f) => f.title === active)) {
      setActive(features[0]?.title || "Dashboard");
    }
  }, [features, active]);

  useEffect(() => {
    if (me && role === "alumni") {
      setSurveyOpen(!me.surveyCompleted);
    }
  }, [me, role]);

  const surveyLocked = role === "alumni" && me && !me.surveyCompleted;
  const { alumni, jobs, events, notifications, surveyResponses, skillsHistory, courseRecommendations, jobApplications, actions } = domain;

  function getBadge(featureTitle) {
    if (role === "admin") {
      switch (featureTitle) {
        case "Dashboard":
          return alumni.filter((a) => a.verificationStatus === "pending").length || null;
        case "Login & Verification":
          return alumni.filter((a) => a.verificationStatus === "pending").length || null;
        case "Manage User Accounts":
          return alumni.length || null;
        case "View Alumni Information":
          return alumni.length || null;
        case "View Survey Results":
          return surveyResponses.length || null;
        case "Manage Notifications":
          return notifications.length || null;
        case "View AI Analytics":
          return jobs.length || null;
        case "Career Tools & Job Postings":
          return jobs.length || null;
        case "Manage Event Posting":
          return events.length || null;
        default:
          return null;
      }
    }

    switch (featureTitle) {
      case "Dashboard":
        return me?.surveyCompleted ? "Done" : null;
      case "Complete the Alumni Survey":
        return me?.surveyCompleted ? "Done" : "!";
      case "Job Alignment": {
        const matchedJobs = jobs.filter((j) => j.skills.some((s) => me?.skills?.some((ms) => ms.toLowerCase() === s.toLowerCase()))).length;
        return matchedJobs > 0 ? matchedJobs : null;
      }
      case "Career Tools":
        return jobs.length || null;
      case "Events & Activities":
        return events.length || null;
      default:
        return null;
    }
  }

  function handleGoto(target) {
    const match = features.find((f) => f.title === target);
    if (match) {
      setActive(match.title);
    } else if (target === "Dashboard") {
      setActive("Dashboard");
    }
    setNotifOpen(false);
  }

  const panel = (() => {
    if (role === "admin") {
      switch (active) {
        case "Dashboard":
          return <AdminDashboardOverview alumni={alumni} jobs={jobs} events={events} notifications={notifications} onNavigate={handleGoto} />;
        case "Login & Verification":
          return <LoginAndVerificationPanel alumni={alumni} onApprove={actions.approveAlumni} onReject={actions.rejectAlumni} />;
        case "Manage User Accounts":
          return <ManageUsersPanel alumni={alumni} onAdd={actions.addAlumni} onRemove={actions.removeAlumni} />;
        case "View Alumni Information":
          return <AlumniInfoPanel alumni={alumni} skillsHistory={skillsHistory} />;
        case "View Survey Results":
          return <SurveyResultsPanel alumni={alumni} surveyResponses={surveyResponses} />;
        case "Manage Notifications":
          return <NotifyComposerPanel notifications={notifications} onSend={actions.sendNotification} />;
        case "View AI Analytics":
          return <AnalyticsPanel alumni={alumni} jobs={jobs} surveyResponses={surveyResponses} />;
        case "Career Tools & Job Postings":
          return <JobsAdminPanel jobs={jobs} onAdd={actions.addJob} onRemove={actions.removeJob} />;
        case "Manage Event Posting":
          return <EventsAdminPanel events={events} onAdd={actions.addEvent} onRemove={actions.removeEvent} />;
        default:
          return <AdminDashboardOverview alumni={alumni} jobs={jobs} events={events} notifications={notifications} onNavigate={handleGoto} />;
      }
    }

    switch (active) {
      case "Dashboard":
        return <AlumniDashboardOverview me={me || { name: name || "You", skills: [], surveyCompleted: false }} jobs={jobs} events={events} notifications={notifications} onNavigate={handleGoto} />;
      case "Complete the Alumni Survey":
        return (
          <SurveyFormPanel
            me={me || { name: name || "You", skills: [], surveyCompleted: false }}
            surveyHistory={surveyResponses.filter((response) => !response.userId || response.userId === me?.userId)}
            onSubmit={(payload) => {
              actions.submitSurvey(payload);
              setActive("Dashboard");
            }}
          />
        );
      case "Job Alignment":
        return <JobAlignmentPanel me={me || { name: name || "You", skills: [], surveyCompleted: false, employed: "Unknown" }} jobs={jobs} recommendations={courseRecommendations.filter((rec) => !rec.userId || rec.userId === me?.userId)} />;
      case "Career Tools":
        return (
          <CareerToolsPanel
            me={me || { name: name || "You", skills: [], surveyCompleted: false }}
            jobs={jobs}
            onApply={actions.applyJob}
            jobApplications={jobApplications.filter((row) => !me || row.userId === me.userId)}
          />
        );
      case "Events & Activities":
        return <EventsAlumniPanel events={events} me={me || { name: name || "You" }} onRsvp={actions.rsvpEvent} />;
      default:
        return <AlumniDashboardOverview me={me || { name: name || "You", skills: [], surveyCompleted: false }} jobs={jobs} events={events} notifications={notifications} onNavigate={handleGoto} />;
    }
  })();

  return (
    <div className="dash-shell">
      <DashboardSidebar
        role={role}
        me={me}
        features={features}
        active={active}
        onSelect={setActive}
        getBadge={getBadge}
        surveyLocked={surveyLocked}
        onLogout={onLogout}
      />

      <main className="dash-main">
        <DashboardHeader
          role={role}
          name={name}
          me={me}
          notifications={notifications}
          notifOpen={notifOpen}
          onToggleNotif={() => setNotifOpen((value) => !value)}
          surveyLocked={surveyLocked}
          onGoto={handleGoto}
          onCloseNotif={() => setNotifOpen(false)}
          onOpenProfile={() => setProfileOpen(true)}
        />

        <div className="dash-page">
          {panel}
        </div>
      </main>

      {role === "alumni" && profileOpen && me && (
        <ProfileModal
          me={me}
          onSave={(patch) => {
            actions.updateSelf(patch);
            setProfileOpen(false);
          }}
          onClose={() => setProfileOpen(false)}
        />
      )}

      {role === "alumni" && surveyOpen && me && (
        <SurveyModal
          me={me}
          onSubmit={(payload) => {
            actions.submitSurvey(payload);
            setSurveyOpen(false);
            setActive("Dashboard");
          }}
          onClose={() => {
            if (!me.surveyCompleted) {
              setSurveyOpen(true);
              return;
            }
            setSurveyOpen(false);
            setActive("Dashboard");
          }}
        />
      )}
    </div>
  );
}