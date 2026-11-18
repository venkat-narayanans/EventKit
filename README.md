# FESTRA (EventKit) — Campus Event Operations & Accreditation Platform

All-in-one event operations studio for college technical fests, hackathons, symposiums, and paper presentations. Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Zustand**, and **Vitest**.

---

## Core Features

- **Events & 3-Level Roster Drill-Down:** Create and edit event tracks (venue, dates, prize breakdown, registration fees, UPI ID, rules). Click any event to view registration analytics and registered teams, and click any team to inspect individual teammates' details, roles, and registered email IDs.
- **Student Portal & Digital Admit Pass:** Self-service squad registration with live iPhone Apple Wallet pass preview, encrypted QR admit token, and Phase 3 code freeze submission.
- **Milestone Submissions & Git Audit Terminal:** Track 3-stage project submissions with automated commit cadence auditing, repository links, live demos, and slide decks.
- **Custom Rubrics & Live Judging Studio:** Configure custom weighted judging criteria (100% total) and score teams in real time with normalized Z-score leaderboard calculations.
- **Leaderboard Finalization & Winner Certificates:** Lock the Top 3 finalized standings and auto-generate Winner Certificates pre-filled with Leaderboard Place (`1st / 2nd / 3rd`), Team Name, Project Title, and every winning member's registered email ID.
- **Canva-Style Certificate Studio & 1-Click Bulk Generation:**
  - Drag-and-drop canvas with alignment snapping, custom college logos, Dean/HOD signature PNGs, vector seals, 5 designer themes, custom Canva artwork uploads, and full typography controls.
  - 1-click **Uniform Participation Certificate** generation (identical design across all participants — only student name & verification ID change) + **Winner Certificates** from the finalized leaderboard.
  - Full gallery view with search, full-screen lightbox, Hi-Res PNG / Vector SVG / Multi-Page PDF export, 1-click LinkedIn verification, and individual/bulk email dispatch to registered email IDs.
- **Institutional NAAC & NIRF Compliance Dossier:** Exportable IQAC audit sheet mapping NAAC Criteria 3.3.2 and 5.3.3 with live demographic and attendance metrics.

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts
- `npm run dev` — Start local development server
- `npm run build` — Create production build
- `npm run start` — Run production server
- `npm test` — Run Vitest unit test suite
