"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { Header } from "@/components/Header";
import { CreateEventModal } from "@/components/organizer/CreateEventModal";
import { EventsManager } from "@/components/organizer/EventsManager";
import { SubmissionsManager } from "@/components/organizer/SubmissionsManager";
import { JudgingRubricsStudio } from "@/components/organizer/JudgingRubricsStudio";
import { LeaderboardManager } from "@/components/organizer/LeaderboardManager";
import { CertificateDesigner } from "@/components/organizer/CertificateDesigner";
import { ComplianceDossier } from "@/components/organizer/ComplianceDossier";
import { StudentPortal } from "@/components/portal/StudentPortal";
import { LandingPage } from "@/components/landing/LandingPage";

export default function HomePage() {
  const { viewMode, activeSection } = useStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (viewMode === "landing") {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header onOpenCreateEvent={() => setIsCreateModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4">
        {viewMode === "portal" ? (
          <StudentPortal />
        ) : (
          <>
            {activeSection === "events" && (
              <EventsManager onOpenCreate={() => setIsCreateModalOpen(true)} />
            )}
            {activeSection === "submissions" && <SubmissionsManager />}
            {activeSection === "judging" && <JudgingRubricsStudio />}
            {activeSection === "leaderboard" && <LeaderboardManager />}
            {activeSection === "certificates" && <CertificateDesigner />}
            {activeSection === "compliance" && <ComplianceDossier />}
          </>
        )}
      </main>

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
