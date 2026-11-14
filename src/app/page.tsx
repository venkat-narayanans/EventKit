"use client";

import React from "react";
import { useFestraStore } from "@/lib/store";
import { ExploreView } from "@/components/views/ExploreView";
import { FestDetailView } from "@/components/views/FestDetailView";
import { PipelineView } from "@/components/views/PipelineView";
import { JudgingStudioView } from "@/components/views/JudgingStudioView";
import { LeaderboardView } from "@/components/views/LeaderboardView";
import { CertificateStudioView } from "@/components/views/CertificateStudioView";
import { NAACDossierView } from "@/components/views/NAACDossierView";

export default function HomePage() {
  const { activeTab } = useFestraStore();

  return (
    <div className="w-full">
      {activeTab === "explore" && <ExploreView />}
      {activeTab === "fest" && <FestDetailView />}
      {activeTab === "pipeline" && <PipelineView />}
      {activeTab === "judging" && <JudgingStudioView />}
      {activeTab === "leaderboard" && <LeaderboardView />}
      {activeTab === "certificates" && <CertificateStudioView />}
      {activeTab === "naac" && <NAACDossierView />}
    </div>
  );
}
