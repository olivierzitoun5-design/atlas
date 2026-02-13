# 🧬 Melanoma 2L Patient Journey Atlas

Interactive 8-layer strategic intelligence dashboard mapping the metastatic melanoma second-line patient journey — from diagnosis through treatment sequencing, critical friction zones, and outcomes.

Built for pharmaceutical C-suite positioning, medical affairs, and commercial strategy teams.

![React](https://img.shields.io/badge/React-18-61dafb?logo=react) ![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite) ![Recharts](https://img.shields.io/badge/Recharts-2-8884d8)

---

## Dashboard Layers

| Tab | Layer | Description |
|-----|-------|-------------|
| L0 | **Executive** | Funnel attrition (14,280 → 1,642), cost acceleration, emotional trajectory |
| L1 | **Patient Journey** | Interactive SVG mind map with clickable milestones, treatment badges, 4 pathway branches |
| L2 | **Patient Personas** | 5 archetype cards with demographics, socioeconomics, psychographics, and journey risk profiles |
| L3 | **Sequencing** | 2L pathway distribution (Ipi 28%, BRAF/MEK 21%, Trial 10%, No Tx 41%), rwOS/rwTTNT outcomes |
| L4 | **Friction** | Waterfall gap analysis, community vs academic differential, critical friction zone visualization |
| L5 | **Cost** | PMPM acceleration at progression, utilization spikes, treated vs untreated cost curves |
| L6 | **Prescribers** | Academic vs community split, 10-center volume table with LOT filter, mRNA-4359 eligibility, 14 KOL/DOLs |
| L7 | **Outcomes** | Brain mets vs no-brain survival curves, proactive screening opportunity |

## Key Features

- **Interactive Journey Map** — SVG decision tree with clickable nodes, animated selection rings, treatment type badges, and expandable detail panels with social listening intelligence
- **mRNA-4359 Trial Intelligence** — Filter academic centers by line of therapy to identify CPI-refractory patients eligible for Moderna's mRNA-4359 (NCT05533697), with active trial site mapping
- **Patient Personas** — 5 evidence-based archetypes covering 100% of the addressable pool, each with 20+ demographic/socioeconomic/psychographic attributes and persona-specific intervention strategies
- **KOL/DOL Network** — 14 key opinion leaders with publication metrics, h-index, trial roles, NCCN membership, and Moderna investigator status
- **Social Listening Integration** — 20 published sources (JMIR Cancer n=864, Reddit NLP n=72,524, BMC Cancer n=35, ScienceDirect PRO n=19) mapped to each journey stage
- **Emotional Trajectory** — 4-metric tracking (Energy, Hope, Anxiety, Autonomy) with critical friction zone overlay

## Data Sources

All data is illustrative and derived from published literature, conference presentations, and publicly available clinical trial registries. This dashboard is designed as a strategic positioning tool and does not contain proprietary patient data.

Key sources include:
- SEER/NCI melanoma incidence and survival statistics
- Published RWD studies on melanoma treatment sequencing
- ClinicalTrials.gov (NCT05533697 — mRNA-4359)
- JMIR Cancer, BMC Cancer, ScienceDirect, PMC peer-reviewed publications
- Reddit NLP analysis (published academic studies)
- ASCO/ESMO conference abstracts

---

## Quick Start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/melanoma-atlas.git
cd melanoma-atlas

# Install
npm install

# Dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploy to Vercel

### Option A: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B: GitHub Integration
1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Vercel auto-detects Vite — click **Deploy**

The included `vercel.json` handles framework detection and SPA routing.

## Deploy to Railway

### Option A: Dockerfile (recommended)
1. Push to GitHub
2. Go to [railway.app/new](https://railway.app/new)
3. Select **Deploy from GitHub repo**
4. Railway detects the `Dockerfile` automatically
5. Set port to `3000` if not auto-detected

### Option B: Nixpacks (auto-detect)
Railway's Nixpacks will auto-detect the Vite project:
1. Push to GitHub
2. Import in Railway
3. It will run `npm install && npm run build` and serve from `dist/`

## Deploy to Netlify

```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

Or connect GitHub repo → Netlify auto-detects Vite.

---

## Project Structure

```
melanoma-atlas/
├── index.html              # Entry HTML
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite configuration
├── vercel.json             # Vercel deployment config
├── Dockerfile              # Railway / Docker deployment
├── .gitignore
├── README.md
├── public/                 # Static assets (empty)
└── src/
    ├── main.jsx            # React entry point
    └── App.jsx             # Full dashboard component (~1,900 lines)
```

## Tech Stack

- **React 18** — Functional components with hooks
- **Recharts** — Charts (line, bar, pie, area)
- **Vite 5** — Build tooling
- **Pure CSS-in-JS** — No external CSS framework (inline styles for portability)
- **SVG** — Hand-crafted journey map with interactive nodes

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

---

## License

Proprietary. For internal strategic use only. Not for distribution without authorization.

## Contact

Built by Publicis Health strategic intelligence team.
