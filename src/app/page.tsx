"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { Event } from "@/types";
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
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const openCreateEvent = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const openEditEvent = (ev: Event) => {
    setEditingEvent(ev);
    setIsEventModalOpen(true);
  };

  const closeEventModal = () => {
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  if (viewMode === "landing") {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header onOpenCreateEvent={openCreateEvent} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4">
        {viewMode === "portal" ? (
          <StudentPortal />
        ) : (
          <>
            {activeSection === "events" && (
              <EventsManager
                onOpenCreate={openCreateEvent}
                onEditEvent={openEditEvent}
              />
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
        isOpen={isEventModalOpen}
        onClose={closeEventModal}
        editingEvent={editingEvent}
      />
    </div>
  );
}
