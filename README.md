# 🌌 Finance AI Agent | Neural Financial Ecosystem

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-0B1120?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)](https://tailwindcss.com/)

---

## 🧠 Product Narrative

Finance AI Agent is a **high-fidelity, frontend-first financial experience** that turns a mortgage contract into a structured savings narrative:

- **Analysis:** upload a PDF or paste text → extract key parameters → compute savings → generate a clean report.
- **Consultation:** a live voice AI banker that discusses the result with real-time transcript.
- **History:** a local archive of analyses with search, sort, rename, detail view and bulk actions.

The UI is intentionally “OS-like”: glass surfaces, cinematic gradients, and motion-driven UX built to feel premium and responsive.

---

## 🚀 Live Demo

👉 https://finance-ai-agent-jade.vercel.app/

---

## 📸 Screenshots

| Dashboard | Analysis |
|---|---|
| ![Dashboard](public/screenshots/dashboard.svg) | ![Analysis](public/screenshots/analysis.svg) |

| Consultation | History |
|---|---|
| ![Consultation](public/screenshots/consultation.svg) | ![History](public/screenshots/history.svg) |

---

## ✨ Key Features

- **Mortgage Analysis**
  - PDF upload + text input
  - savings estimate and top bank alternatives
  - HTML report generation
- **AI Consultation**
  - voice connection via Vapi + live transcript chat
  - contextualized with savings / fixation extracted from analysis
- **History**
  - search, sorting, multiselect, smooth delete + animated reflow
  - detail modal + renaming by stable `id`
- **Design System**
  - shared UI components (PageHeader, PageBackground, Modal, …)
  - global motion + utilities in `globals.css`

---

## 🏗️ Architecture & Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **UI:** React 19 + TypeScript
- **Styling:** Tailwind CSS 4 (+ `tailwindcss-animate`)
- **Animace:** Framer Motion
- **AI Analysis:** Google Generative AI (Gemini) via Server Actions
- **Voice:** Vapi Web SDK
- **Storage:** `localStorage` (no database yet)

---

## 🔐 Environment Variables

Create `.env.local` in the project root:

```bash
# Required (server-side analysis)
GEMINI_API_KEY=your_key

# Required (client-side voice)
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_public_key

# Optional (Make.com webhook integration)
MAKE_WEBHOOK_URL=https://hook.make.com/...
MAKE_DEFAULT_PHONE=
```

Note: `NEXT_PUBLIC_GEMINI_API_KEY` exists as a fallback but is discouraged (it would expose the key to the client).

---

## 📂 Project Structure

```
src/
  app/
    page.tsx                 # Dashboard
    analysis/
      page.tsx               # Analysis UI
      actions.ts             # Server Actions (Gemini + Make)
    consultation/
      page.tsx               # Voice + chat
    history/
      page.tsx               # Local archive
    components/
      ui/                    # Shared UI (Modal, PageHeader, …)
      analysis/              # Analysis modules
      consultation/          # Consultation modules
      history/               # History modules
      dashboard/             # Dashboard modules
  hooks/                     # Feature hooks / page logic
  lib/                       # Utilities (formatting, HTML report)
  types/                     # Shared types
```

---

## ⚙️ Local Development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

---

## 🧾 Data & Privacy Notes

- Analysis history is stored in `localStorage` (locally in the user’s browser).
- For analysis, document content is sent to the AI model (Gemini) via a server action.
- Voice consultation runs via the Vapi Web SDK.
- Optionally, results can be forwarded to Make.com via a webhook.

---

## 🔮 Roadmap

- **User accounts & multi-device sync** (auth, secure storage, profile-bound history)
- Insurance 2.0 module (coverage checks + optimization)
- Wealth Management feed (investments / crypto / assets)
- Extended reporting + export flows

---

## 👤 Author

**Jan Pivoňka (Peony)**

- GitHub: https://github.com/janpivonka
- Live: https://finance-ai-agent-jade.vercel.app/

---

SYSTEM_STATUS: NEURAL_ECOSYSTEM_ONLINE // HISTORY_ANIMATIONS_STABLE // READY_FOR_UPGRADE
