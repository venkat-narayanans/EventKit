"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Event } from "@/types";
import { Header } from "@/components/Header";
import { CreateEventModal } from "@/components/organizer/CreateEventModal";
import { EventRegistrationQrModal } from "@/components/organizer/EventRegistrationQrModal";
import { EventsManager } from "@/components/organizer/EventsManager";
import { SubmissionsManager } from "@/components/organizer/SubmissionsManager";
import { JudgingRubricsStudio } from "@/components/organizer/JudgingRubricsStudio";
import { LeaderboardManager } from "@/components/organizer/LeaderboardManager";
import { CertificateDesigner } from "@/components/organizer/CertificateDesigner";
import { ComplianceDossier } from "@/components/organizer/ComplianceDossier";
import { StudentPortal } from "@/components/portal/StudentPortal";
import { LandingPage } from "@/components/landing/LandingPage";

export default function HomePage() {
  const { viewMode, setViewMode, activeSection, setSelectedEventId } = useStore();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // QR Modal State
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrInitialEventId, setQrInitialEventId] = useState<string | null>(null);

  // Read URL query parameters and pathname on initial mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view");
    const eventParam = params.get("event");
    const path = window.location.pathname.toLowerCase();

    if (viewParam === "portal" || path === "/portal") {
      setViewMode("portal");
    } else if (
      viewParam === "dashboard" ||
      path === "/dashboard" ||
      path === "/workspace" ||
      path === "/organizer"
    ) {
      setViewMode("dashboard");
    }

    if (eventParam) {
      setSelectedEventId(eventParam);
    }
  }, [setViewMode, setSelectedEventId]);

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

  const openQrModal = (eventId?: string) => {
    setQrInitialEventId(eventId || null);
    setIsQrModalOpen(true);
  };

  const closeQrModal = () => {
    setIsQrModalOpen(false);
    setQrInitialEventId(null);
  };

  if (viewMode === "landing") {
    return (
      <>
        <LandingPage />
        <EventRegistrationQrModal
          isOpen={isQrModalOpen}
          onClose={closeQrModal}
          initialEventId={qrInitialEventId}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header
        onOpenCreateEvent={openCreateEvent}
        onOpenQrModal={() => openQrModal()}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4">
        {viewMode === "portal" ? (
          <StudentPortal />
        ) : (
          <>
            {activeSection === "events" && (
              <EventsManager
                onOpenCreate={openCreateEvent}
                onEditEvent={openEditEvent}
                onOpenQrModal={openQrModal}
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

      <EventRegistrationQrModal
        isOpen={isQrModalOpen}
        onClose={closeQrModal}
        initialEventId={qrInitialEventId}
      />
    </div>
  );
}
