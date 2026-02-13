import { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ReferenceLine, ReferenceArea
} from "recharts";

const C = {
  bg: "#f8f9fc", surface: "#ffffff", alt: "#f1f3f9",
  border: "#e2e6ef", text: "#1a1d2e", muted: "#4a5068", dim: "#8891a8",
  indigo: "#4f46e5", violet: "#7c3aed", emerald: "#059669",
  red: "#dc2626", amber: "#d97706", cyan: "#0891b2",
  rose: "#e11d48", orange: "#ea580c", sky: "#0284c7",
};

const bg = (c) => `${c}10`;

// ── Shared Data ──
const FUNNEL = [
  { stage: "1L Melanoma (IO)", value: 14280, pct: 100 },
  { stage: "Progressed ≤12m", value: 8854, pct: 62 },
  { stage: "Reached 2L Tx", value: 6712, pct: 47 },
  { stage: "Completed 2L", value: 3892, pct: 27 },
  { stage: "Reached 3L", value: 1642, pct: 11.5 },
];

const COST_ACCEL = [
  { m: "-6", pre: 4200 }, { m: "-4", pre: 5100 }, { m: "-2", pre: 7800 },
  { m: "0", pre: 12600, post: 12600 },
  { m: "+2", post: 19200 }, { m: "+4", post: 22100 }, { m: "+6", post: 19600 },
];

const SEQ = [
  { name: "PD-1→Ipi", pct: 28, brafMut: 15, brafWT: 35 },
  { name: "PD-1→BRAF/MEK", pct: 21, brafMut: 38, brafWT: 0 },
  { name: "PD-1→Trial", pct: 10, brafMut: 8, brafWT: 12 },
  { name: "PD-1→No Tx", pct: 41, brafMut: 14, brafWT: 40 },
];

const OUTCOMES = [
  { cluster: "PD-1→Ipi", medOS: 14.2, rwTTNT: 6.8 },
  { cluster: "BRAF/MEK", medOS: 18.6, rwTTNT: 9.4 },
  { cluster: "Trial", medOS: 21.4, rwTTNT: 8.2 },
  { cluster: "No Tx", medOS: 6.8, rwTTNT: 3.1 },
];

const FRICTION = [
  { step: "1L → Imaging", days: 42, target: 30, gap: 12 },
  { step: "Imaging → Dx", days: 18, target: 7, gap: 11 },
  { step: "Dx → Decision", days: 28, target: 14, gap: 14 },
  { step: "Decision → 2L", days: 21, target: 7, gap: 14 },
];

const GAP_DIST = [
  { range: "0-30d", community: 12, academic: 28 },
  { range: "31-60d", community: 24, academic: 38 },
  { range: "61-90d", community: 32, academic: 22 },
  { range: "91-120d", community: 20, academic: 8 },
  { range: ">120d", community: 12, academic: 4 },
];

const COST_MO = [
  { m: "M-4", treated: 5400, untreated: 4600 },
  { m: "M-2", treated: 8200, untreated: 6400 },
  { m: "Prog", treated: 14200, untreated: 12600 },
  { m: "M+2", treated: 19800, untreated: 8400 },
  { m: "M+4", treated: 19600, untreated: 6800 },
  { m: "M+6", treated: 17400, untreated: 4200 },
];

const UTIL = [
  { m: "Hosp", pre: 18, post: 42 },
  { m: "ER", pre: 24, post: 68 },
  { m: "Steroids", pre: 31, post: 72 },
  { m: "Brain", pre: 6, post: 19 },
];

const REFERRALS = [
  { from: "SE", to: "Moffitt", vol: 142 },
  { from: "NE", to: "MSK", vol: 238 },
  { from: "MW", to: "U Chicago", vol: 96 },
  { from: "W", to: "UCLA", vol: 184 },
  { from: "SW", to: "MD Anderson", vol: 312 },
];

// ── Prescriber & Academic Center Data ──
var SETTING = [
  { setting: "Community", pts1L: 9700, pts2L: 2850, ptsNo2L: 3920, pct: 68 },
  { setting: "Academic", pts1L: 4580, pts2L: 3860, ptsNo2L: 1930, pct: 32 },
];

var ACADEMIC = [
  { center: "MD Anderson", region: "SW", total: 1420, lot1: 1420, lot2: 680, lot3: 185, cpiRef: 312, brainFree: 248, ecog01: 234, eligible4359: 186, trial4359: true },
  { center: "MSK", region: "NE", total: 1280, lot1: 1280, lot2: 615, lot3: 162, cpiRef: 281, brainFree: 224, ecog01: 212, eligible4359: 168, trial4359: false },
  { center: "Dana-Farber", region: "NE", total: 890, lot1: 890, lot2: 428, lot3: 118, cpiRef: 196, brainFree: 156, ecog01: 148, eligible4359: 117, trial4359: true },
  { center: "UCLA", region: "W", total: 760, lot1: 760, lot2: 365, lot3: 94, cpiRef: 167, brainFree: 133, ecog01: 126, eligible4359: 100, trial4359: false },
  { center: "Moffitt", region: "SE", total: 680, lot1: 680, lot2: 327, lot3: 88, cpiRef: 150, brainFree: 119, ecog01: 113, eligible4359: 90, trial4359: false },
  { center: "U Chicago", region: "MW", total: 520, lot1: 520, lot2: 250, lot3: 68, cpiRef: 114, brainFree: 91, ecog01: 86, eligible4359: 68, trial4359: true },
  { center: "UCSF", region: "W", total: 480, lot1: 480, lot2: 230, lot3: 63, cpiRef: 106, brainFree: 84, ecog01: 80, eligible4359: 63, trial4359: true },
  { center: "Wash U / Siteman", region: "MW", total: 410, lot1: 410, lot2: 197, lot3: 54, cpiRef: 90, brainFree: 72, ecog01: 68, eligible4359: 54, trial4359: true },
  { center: "OHSU", region: "W", total: 340, lot1: 340, lot2: 163, lot3: 42, cpiRef: 75, brainFree: 60, ecog01: 56, eligible4359: 45, trial4359: true },
  { center: "GW University", region: "E", total: 220, lot1: 220, lot2: 106, lot3: 28, cpiRef: 48, brainFree: 38, ecog01: 36, eligible4359: 29, trial4359: true },
];

const SURV = Array.from({ length: 25 }, (_, i) => ({
  month: i,
  brainMets: Math.round(100 * Math.exp(-0.08 * i)),
  noBrain: Math.round(100 * Math.exp(-0.04 * i)),
}));

// ── Patient Personas ──
var PERSONAS = [
  {
    id: "retiree", name: "Richard", age: 68, label: "The Sun-Belt Retiree",
    pctPool: 38, color: C.amber, icon: "🌅",
    demo: { gender: "Male (72% of cohort)", race: "White non-Hispanic (92%)", region: "Southeast / Southwest Sun Belt", insurance: "Medicare FFS (74%), Medicare Advantage (26%)", marital: "Married (68%)", education: "High school / some college" },
    socio: { income: "$38K–62K fixed retirement income", employment: "Retired — limited schedule flexibility", caregiver: "Spouse primary caregiver (often also elderly)", digital: "Low — relies on adult children for portal access", transport: "Rural/suburban — 45+ min to academic center", housing: "Single-family home, Sun Belt retirement community" },
    psycho: { healthLit: "Moderate — trusts physician authority, fewer questions", decisionStyle: "Deferential — 'Whatever you think, doc'", copingStyle: "Stoic minimization — downplays symptoms to family", fearProfile: "Burden on spouse > death itself", infoSeeking: "Low — avoids googling, watches TV health segments", socialSupport: "Church community, veteran's group, limited peer cancer support", brandAffinity: "Traditional — trusts branded institutions over digital health" },
    journey: "Most likely to fall into 'The Limbo.' Deferential decision-making + rural access barriers + low digital engagement = highest risk of becoming the invisible 41%. Spouse caregiver burnout accelerates disengagement. Least likely to self-advocate for trial enrollment.",
    intervention: "Proactive nurse navigator outreach (phone, not portal). Caregiver respite support. Transportation assistance for academic referral. Community oncologist → academic warm-handoff at progression.",
  },
  {
    id: "professional", name: "David", age: 52, label: "The Working Professional",
    pctPool: 24, color: C.indigo, icon: "💼",
    demo: { gender: "Male (64%)", race: "White (85%), higher Black representation (8%) vs retiree", region: "Urban / suburban metro corridors", insurance: "Commercial PPO/HMO (62%), some early Medicare", marital: "Married with dependents (58%)", education: "College degree or higher (71%)" },
    socio: { income: "$85K–140K household", employment: "Active career — treatment competes with work obligations", caregiver: "Spouse + adult sibling network", digital: "High — uses patient portal, googles extensively", transport: "Urban — <30 min to academic center", housing: "Suburban single-family, strong community ties" },
    psycho: { healthLit: "High — researches options independently, asks detailed questions", decisionStyle: "Collaborative — wants data and shared decision-making", copingStyle: "Problem-solving — treats cancer like a project to manage", fearProfile: "Loss of career identity and provider role > mortality", infoSeeking: "Very high — Reddit, clinical trial databases, PubMed abstracts", socialSupport: "Work colleagues, online melanoma communities, strong family unit", brandAffinity: "Evidence-driven — trusts academic centers and published data" },
    journey: "Most engaged patient but highest burnout risk. Information overload at progression creates decision paralysis. Financial toxicity from work interruption + copays compounds at 2L. Most likely to demand trial access but frustrated by enrollment barriers.",
    intervention: "Shared decision-making platform with RWD outcomes. Financial navigation at 2L start. Flexible infusion scheduling. Employer-facing leave support resources. Clinical trial matching within 48h of progression.",
  },
  {
    id: "youngadult", name: "Melissa", age: 34, label: "The Young Adult Warrior",
    pctPool: 12, color: C.rose, icon: "⚡",
    demo: { gender: "Female (55% in <40 cohort)", race: "White (89%), rising Hispanic incidence", region: "Distributed — follows tanning bed / UV exposure patterns", insurance: "Commercial (72%), ACA marketplace (18%), uninsured (10%)", marital: "Single or newly partnered (62%)", education: "College degree (68%)" },
    socio: { income: "$42K–75K (early career)", employment: "Early-to-mid career — fears career derailment", caregiver: "Parents as primary caregivers, friends as secondary", digital: "Very high — TikTok, Instagram melanoma communities, Reddit", transport: "Urban — mobile but work-constrained", housing: "Renting, financially precarious, potential relocation for care" },
    psycho: { healthLit: "Variable — high digital fluency but may lack medical context", decisionStyle: "Activist — researches aggressively, seeks multiple opinions", copingStyle: "Public sharing — blogs, social media, peer advocacy", fearProfile: "Fertility, body image, missing life milestones (marriage, children)", infoSeeking: "Extremely high — social media first, then oncologist", socialSupport: "Online melanoma warrior community, AYA cancer groups, friends", brandAffinity: "Anti-establishment — skeptical of pharma, trusts peer experience" },
    journey: "Disproportionately BRAF-mutant (58% vs 45% overall). Higher IO response rates but devastating irAE impact on body image and fertility. Social media amplifies both hope and despair. Most vocal about system failures — drives online narrative. Likely to travel for trial access.",
    intervention: "AYA-specific psycho-oncology. Fertility preservation counseling pre-1L. Peer navigator (young adult survivor). Social media-friendly trial information. Body image support through irAE management.",
  },
  {
    id: "minority", name: "James", age: 58, label: "The Underserved & Late-Diagnosed",
    pctPool: 14, color: C.violet, icon: "🔍",
    demo: { gender: "Male (60%)", race: "Black (42%), Hispanic (35%), Asian (23%)", region: "Urban safety-net hospital catchments", insurance: "Medicaid (38%), uninsured→emergency Medicaid (22%), Medicare disability (18%)", marital: "Single or divorced (48%)", education: "High school or less (54%)" },
    socio: { income: "<$35K household", employment: "Hourly wage / gig economy — cannot miss work for treatment", caregiver: "Fragmented — extended family, community health workers", digital: "Low-to-moderate — smartphone but limited data plan", transport: "Public transit dependent — 60-90 min each way to cancer center", housing: "Urban rental, housing instability risk during treatment" },
    psycho: { healthLit: "Low — language barriers common, medical mistrust", decisionStyle: "Passive with institutional mistrust — accepts but does not trust", copingStyle: "Faith-based coping and fatalism", fearProfile: "Financial catastrophe > disease progression", infoSeeking: "Low — relies on community health workers and faith leaders", socialSupport: "Church community, family network, limited cancer-specific support", brandAffinity: "Community-based — trusts local providers, skeptical of academic 'experiments'" },
    journey: "Diagnosed at later stage (62% stage III-IV at presentation vs 42% white patients). Acral/mucosal melanoma subtypes overrepresented. 2.3x more likely to become the 'invisible 41%'. Structural barriers compound at every friction point. Lowest trial enrollment (3% vs 10% overall). Worst survival outcomes across all lines.",
    intervention: "Community health worker bridge programs. Culturally concordant navigation. Transportation vouchers. Medicaid prior-auth fast-tracking. Faith-leader health literacy partnerships. Acral-specific screening campaigns.",
  },
  {
    id: "elderly", name: "Margaret", age: 78, label: "The Frail Elderly",
    pctPool: 12, color: "#6b7280", icon: "🏠",
    demo: { gender: "Female (52% in 75+ cohort)", race: "White (94%)", region: "Rural and small-town America", insurance: "Medicare + Medigap or Medicare Advantage", marital: "Widowed (54%)", education: "High school (62%)" },
    socio: { income: "$22K–38K (Social Security + pension)", employment: "Retired", caregiver: "Adult children (often remote), home health aide", digital: "Very low — no smartphone in 35%, caregiver manages portal", transport: "Depends on family or medical transport services", housing: "Aging in place, assisted living, or with adult child" },
    psycho: { healthLit: "Low — polypharmacy confusion, hearing/vision impairments", decisionStyle: "Surrogate-dependent — adult children often drive decisions", copingStyle: "Acceptance / resignation — 'I've had a good life'", fearProfile: "Loss of independence and nursing home placement > death", infoSeeking: "Minimal — relies entirely on oncologist and family", socialSupport: "Shrinking social circle, church, senior center", brandAffinity: "Physician-dependent — 'My doctor knows best'" },
    journey: "ECOG 2+ at baseline (42%). Underrepresented in clinical trials by design (age/comorbidity exclusions). Highest irAE mortality. Most likely to receive BSC/hospice at progression. Community oncologists default to 'comfort care' even when 2L is appropriate. Invisible in RWD because claims end at hospice enrollment.",
    intervention: "Geriatric oncology assessment at progression. Caregiver decision-support tools. Simplified treatment regimens. Home-based or satellite infusion. Proactive palliative care integration (not 'giving up').",
  },
];

// ── KOL / DOL Data ──
var KOLS = [
  { name: "Antoni Ribas, MD, PhD", inst: "UCLA", role: "Dir, Tumor Immunology Program", focus: "CPI resistance, PD-1 development", pubs: 580, hIndex: 142, trials: "KEYNOTE-002/006 PI", tier: "T1", type: "KOL", moderna: false, nccn: true },
  { name: "Jedd Wolchok, MD, PhD", inst: "MSK", role: "Chief, Melanoma & Immunotherapeutics", focus: "Ipi+Nivo combo, CPI biomarkers", pubs: 520, hIndex: 138, trials: "CheckMate-067/069 PI", tier: "T1", type: "KOL", moderna: false, nccn: true },
  { name: "Ryan Sullivan, MD", inst: "MGH / Dana-Farber", role: "Assoc Dir, Melanoma Program", focus: "Novel IO combos, mRNA vaccines", pubs: 210, hIndex: 68, trials: "mRNA-4359 Coordinating PI", tier: "T1", type: "KOL", moderna: true, nccn: true },
  { name: "F. Stephen Hodi, MD", inst: "Dana-Farber", role: "Dir, Melanoma Center", focus: "CPI biology, irAE management", pubs: 450, hIndex: 125, trials: "Ipi landmark trials PI", tier: "T1", type: "KOL", moderna: false, nccn: true },
  { name: "Hussein Tawbi, MD, PhD", inst: "MD Anderson", role: "Dept Chair, Melanoma Med Onc", focus: "Brain mets, IO combinations", pubs: 220, hIndex: 62, trials: "CheckMate-204 (brain mets) PI", tier: "T1", type: "KOL", moderna: false, nccn: true },
  { name: "Jason Luke, MD, FACP", inst: "UPMC Hillman", role: "Dir, Cancer Immunotherapeutics", focus: "IO combos, tumor microenvironment", pubs: 260, hIndex: 72, trials: "Multiple IO combo trials PI", tier: "T1", type: "KOL", moderna: false, nccn: true },
  { name: "Adil Daud, MD", inst: "UCSF", role: "Dir, Melanoma Clinical Research", focus: "Novel IO agents, mRNA platforms", pubs: 180, hIndex: 58, trials: "mRNA-4359 Site PI", tier: "T1", type: "KOL", moderna: true, nccn: false },
  { name: "Douglas Johnson, MD, MSCI", inst: "Vanderbilt", role: "Assoc Prof, Medicine", focus: "irAE biology, CPI toxicity", pubs: 240, hIndex: 70, trials: "irAE registries, combo IO", tier: "T1", type: "KOL", moderna: false, nccn: true },
  { name: "Michael Atkins, MD", inst: "Georgetown", role: "Deputy Dir, Georgetown Lombardi", focus: "Kidney cancer / melanoma IO", pubs: 380, hIndex: 108, trials: "Multiple melanoma IO trials", tier: "T1", type: "KOL", moderna: false, nccn: true },
  { name: "Omid Hamid, MD", inst: "The Angeles Clinic", role: "Chief, Translational Research", focus: "Community IO delivery, CPI trials", pubs: 190, hIndex: 65, trials: "KEYNOTE melanoma PI", tier: "T2", type: "DOL", moderna: false, nccn: false },
  { name: "April Salama, MD", inst: "Duke", role: "Assoc Prof, Medicine", focus: "Melanoma IO, clinical trial design", pubs: 130, hIndex: 42, trials: "Multiple melanoma combination trials", tier: "T2", type: "DOL", moderna: false, nccn: true },
  { name: "Sapna Patel, MD", inst: "MD Anderson", role: "Assoc Prof, Melanoma Med Onc", focus: "Rare melanoma subtypes, health disparities", pubs: 95, hIndex: 32, trials: "Acral/mucosal melanoma studies", tier: "T2", type: "DOL", moderna: false, nccn: false },
  { name: "Harriet Kluger, MD", inst: "Yale", role: "Prof, Medicine (Medical Oncology)", focus: "Brain mets, biomarkers", pubs: 170, hIndex: 55, trials: "Brain mets IO trials", tier: "T2", type: "DOL", moderna: false, nccn: false },
  { name: "Sunandana Kummar, MD", inst: "OHSU", role: "Dir, Phase 1 Clinical Trials", focus: "Early-phase IO, novel agents", pubs: 200, hIndex: 60, trials: "mRNA-4359 Site PI", tier: "T2", type: "DOL", moderna: true, nccn: false },
];

// ── Patient Journey with Social Listening ──
const JOURNEY = [
  {
    id: "dx", phase: "DIAGNOSIS", week: 0, color: C.violet,
    title: "Metastatic Melanoma Diagnosis",
    energy: 40, hope: 50, anxiety: 88, autonomy: 22,
    emotion: "Shock & Disorientation",
    voice: "The doctor said 'metastatic' and I stopped hearing anything after that. My wife had to drive us home.",
    slSource: "JMIR Cancer European SML, n=864 posts, 14 countries",
    sentiment: [
      { label: "Negative thoughts / sadness", pct: 33, c: C.red },
      { label: "Anxiety", pct: 17, c: C.amber },
      { label: "Distress", pct: 14, c: C.orange },
      { label: "Fear", pct: 13, c: C.rose },
      { label: "Emotionally affected", pct: 25, c: C.violet },
    ],
    themes: ["70% of posts discussing impact mentioned emotional burden as primary — above physical (24%) and social (17%)", "Treatment sequencing was the #1 treatment topic discussed (47%)", "Information need at diagnosis drives social media posting behavior"],
    insight: "70% of melanoma social media posts discussing disease impact cited emotional burden as the primary impact — far exceeding physical (24%), social (17%), and financial (4%) impacts.",
    clinical: "Median age 63. BRAF V600E/K in ~45%. 84% report distress at diagnosis (ScienceDirect PRO, n=19). Patient recall of first visit: <30% retained.",
    frictions: [
      { t: "18-day wait biopsy → oncology", s: "medium", d: "<30% of first visit info retained" },
      { t: "BRAF testing adds 7-14 days", s: "high", d: "28% start 1L without complete profiling" },
    ],
    pharma: [
      { type: "Dx Support", icon: "🧬", imp: "HIGH", label: "Reflex molecular testing at biopsy", detail: "Trigger BRAF/PD-L1/TMB panel at biopsy confirmation. Eliminates 10-14d gap.", metric: "Gap", from: "14d", to: "0d", delta: "-14d" },
    ],
  },
  {
    id: "1l", phase: "1L IO START", week: 3, color: C.indigo,
    title: "First-Line Immunotherapy Begins",
    energy: 55, hope: 74, anxiety: 55, autonomy: 42,
    emotion: "Cautious Optimism",
    voice: "Starting treatment felt like finally doing something. Immunotherapy is the breakthrough — it has to work.",
    slSource: "BMC Cancer qualitative, n=35 ICI patients",
    sentiment: [
      { label: "IO as 'only viable option'", pct: 58, c: C.indigo },
      { label: "Positive expectations", pct: 53, c: C.emerald },
      { label: "Need additional guidance", pct: 42, c: C.amber },
      { label: "Uncertainty despite hope", pct: 68, c: C.orange },
    ],
    themes: ["Metastatic patients rarely weigh pros/cons — IO perceived as only choice", "Trajectory described as 'intense' by both patient groups", "Strong need to '(re)gain control' during treatment"],
    insight: "53% reported positive expectations at start, but 68% simultaneously reported pervasive uncertainty — a fragile optimism that makes IO failure especially devastating.",
    clinical: "~52% combo nivo+ipi, ~48% PD-1 mono. Combo ORR 58% but grade 3-4 irAE 59%. Community combo use: 42% vs 68% academic.",
    frictions: [
      { t: "Community under-prescribing combo IO", s: "high", d: "42% community vs 68% academic" },
    ],
    pharma: [
      { type: "Support", icon: "🛡", imp: "HIGH", label: "Nurse navigator onboarding", detail: "IO-trained navigator with irAE monitoring at week 1, 3, 6.", metric: "Early d/c", from: "14%", to: "8%", delta: "-6pts" },
      { type: "HCP", icon: "⚕️", imp: "HIGH", label: "Community irAE confidence program", detail: "Peer mentoring connecting community to academic IO specialists.", metric: "Combo Rx", from: "42%", to: "61%", delta: "+19pts" },
    ],
  },
  {
    id: "scan", phase: "FIRST SCAN", week: 12, color: C.cyan,
    title: "Week 12 — Scanxiety",
    energy: 48, hope: 68, anxiety: 78, autonomy: 32,
    emotion: "Peak Anticipatory Dread",
    voice: "The week before my scan I couldn't sleep. I snapped at my kids. When the report said 'partial response' I cried in the parking lot.",
    slSource: "Melanoma Institute Australia + MRA 2024 Patient Forum + Reddit r/melanoma",
    sentiment: [
      { label: "Anticipatory anxiety", pct: 92, c: C.red },
      { label: "Sleep disruption", pct: 71, c: C.amber },
      { label: "Can't concentrate", pct: 64, c: C.orange },
      { label: "Relief if good news", pct: 88, c: C.emerald },
    ],
    themes: ["Scanxiety peaks 24-48h before appointment (MIA clinical observation)", "MRA dedicated 2024 forum session to scanxiety as #1 patient concern", "62% access portal results before physician discussion"],
    insight: "Scanxiety is the most universally reported psychological burden during IO. It recurs every 12 weeks, never fully resolves, and each scan resets the emotional clock to baseline dread.",
    clinical: "Pseudoprogression 5-10% creates ambiguity. 8% switched off IO prematurely. ORR combo: 58%, mono: 42%.",
    frictions: [
      { t: "Pseudoprogression → premature IO switch in 8%", s: "high", d: "ctDNA could resolve in 89% of cases" },
      { t: "3-7 day result delay amplifies anxiety spiral", s: "medium", d: "62% see portal before oncologist" },
    ],
    pharma: [
      { type: "Detection", icon: "🔬", imp: "HIGH", label: "ctDNA monitoring", detail: "Confirms true progression vs pseudo with 89% accuracy.", metric: "Premature switch", from: "8%", to: "2%", delta: "-6pts" },
    ],
  },
  {
    id: "irae", phase: "irAE CRISIS", week: 18, color: C.amber,
    title: "Immune-Related Adverse Events",
    energy: 30, hope: 55, anxiety: 80, autonomy: 25,
    emotion: "Betrayed by Treatment",
    voice: "The immunotherapy was supposed to fight the cancer, not my own body. High-dose steroids made me feel like the cure was killing me.",
    slSource: "ScienceDirect PRO (n=19) + Dresden HRQoL pilot + BMC Cancer (n=35)",
    sentiment: [
      { label: "Distress", pct: 84, c: C.red },
      { label: "Fatigue", pct: 68, c: C.amber },
      { label: "Skin changes / pruritus", pct: 53, c: C.orange },
      { label: "Pain", pct: 30, c: C.rose },
    ],
    themes: ["84% report distress during ICI therapy (ScienceDirect)", "Survivors report persistent joint pain, memory difficulty, emotional distress", "Both active + post-treatment groups share fatigue and sexual dysfunction"],
    insight: "84% report distress during ICI. Survivors continue to report aching joints, memory issues, and emotional distress — irAE impact extends far beyond the active treatment window.",
    clinical: "Grade 3-4 irAEs: 59% combo, 21% mono. Colitis 17%, hepatitis 15%. IO permanently d/c in 36% of combo patients.",
    frictions: [
      { t: "36% combo patients permanently d/c IO for irAE", s: "high", d: "Higher in community settings" },
      { t: "Steroid courses may blunt IO efficacy", s: "high", d: "Early steroids → 15% PFS reduction" },
    ],
    pharma: [
      { type: "Support", icon: "🏥", imp: "CRITICAL", label: "irAE rapid response network", detail: "24/7 hotline + specialist triage. Reduces IO d/c from 36% to 21%.", metric: "IO d/c", from: "36%", to: "21%", delta: "-15pts" },
    ],
  },
  {
    id: "prog", phase: "PROGRESSION", week: 36, color: C.red,
    title: "Disease Progression Confirmed",
    energy: 20, hope: 22, anxiety: 95, autonomy: 15,
    emotion: "Devastation & Existential Terror",
    voice: "IO was the miracle drug. If that didn't work, what possibly could? Am I going to die?",
    slSource: "PMC Psych Review (13 studies) + EMJ 2025 Distress-Outcomes + Reddit NLP (72,524 posts)",
    sentiment: [
      { label: "Fear of progression", pct: 74, c: C.rose },
      { label: "Hopelessness", pct: 41, c: C.violet },
      { label: "Anger / frustration", pct: 33, c: C.orange },
      { label: "Anxiety", pct: 28, c: C.amber },
      { label: "Depression", pct: 19, c: C.red },
    ],
    themes: ["Short-term survivors: significantly more depression-loaded posts (Reddit NLP)", "Emotional distress directly impacts next-line treatment response", "Fear of recurrence/progression is dominant theme across all melanoma social media"],
    insight: "Distress is a clinical biomarker: EMJ 2025 showed high-distress patients had nearly half the IO response rate (37% vs 69%). Psychological intervention at progression is a clinical imperative.",
    clinical: "Median PFS: 6.9m mono, 11.5m combo. 42-day imaging delay. 34% miss post-progression appointment.",
    frictions: [
      { t: "42-day imaging delay to confirm progression", s: "critical", d: "Target 30d. 12d excess per interval" },
      { t: "No consensus 2L pathway", s: "critical", d: "NCCN: multiple options, no strong preference" },
      { t: "34% miss first post-progression appointment", s: "high", d: "Emotional collapse delays engagement" },
    ],
    pharma: [
      { type: "Intervene", icon: "⚡", imp: "CRITICAL", label: "48h progression response protocol", detail: "Nurse navigator within 48h, psycho-oncology referral, 2L discussion in 7d.", metric: "Gap", from: "109d", to: "86d", delta: "-23d" },
      { type: "HCP", icon: "🧠", imp: "CRITICAL", label: "2L sequencing decision engine", detail: "RWD-informed options by BRAF/brain mets/prior IO.", metric: "Decision", from: "28d", to: "11d", delta: "-17d" },
    ],
  },
  {
    id: "limbo", phase: "THE LIMBO", week: 42, color: C.rose,
    title: "Between Worlds — The Danger Zone",
    energy: 15, hope: 18, anxiety: 96, autonomy: 10,
    emotion: "Abandonment & Existential Dread",
    voice: "I'm in no-man's land. Nobody's calling. I google survival stats at 3am. The system has forgotten I exist.",
    slSource: "Cross-synthesis: JMIR SML + BMC Cancer + Reddit NLP + PMC Review",
    sentiment: [
      { label: "Feeling abandoned", pct: 62, c: C.red },
      { label: "Info-seeking spike", pct: 71, c: C.amber },
      { label: "Existential dread", pct: 58, c: C.rose },
      { label: "Anger at delays", pct: 44, c: C.orange },
      { label: "Isolation", pct: 38, c: C.violet },
    ],
    themes: ["Highest online distress language and catastrophic thinking during gap", "Shift from 'fighting' to 'waiting' and 'forgotten' language", "'Living in the twilight zone' — qualitative research on liminal space", "Caregivers report helplessness as primary emotion"],
    insight: "Most under-studied, most dangerous period. Patients show highest rates of online distress language and catastrophic thinking. 41% never receive 2L — many fall off here, invisible to pharma and healthcare.",
    clinical: "Median gap 109d (target 58). Community 127d vs academic 82d. 41% receive no 2L. Trial window shrinks 38%.",
    frictions: [
      { t: "109-day total gap (target 58)", s: "critical", d: "51d excess = PS decline + trial window closure" },
      { t: "Community gap 45 days longer than academic", s: "critical", d: "127d vs 82d" },
      { t: "41% NEVER receive 2L therapy", s: "critical", d: "rwOS 6.8m untreated vs 14-21m treated" },
    ],
    pharma: [
      { type: "Bridge", icon: "🌉", imp: "CRITICAL", label: "Care continuity bridge", detail: "Weekly nurse check-ins, psycho-oncology, active coordination during gap.", metric: "Retention", from: "61%", to: "84%", delta: "+23pts" },
      { type: "Connect", icon: "🔗", imp: "CRITICAL", label: "Rapid academic warm-handoff", detail: "Pre-built referral pathways, electronic transfer in 48h.", metric: "Referral", from: "23d", to: "9d", delta: "-14d" },
      { type: "Access", icon: "🧭", imp: "HIGH", label: "AI trial matching at progression", detail: "Automated matching by biomarker and geography.", metric: "Enrollment", from: "10%", to: "22%", delta: "+12pts" },
    ],
  },
  {
    id: "2ld", phase: "2L DECISION", week: 48, color: C.amber,
    title: "Treatment Selection",
    energy: 24, hope: 35, anxiety: 80, autonomy: 30,
    emotion: "Fragile Resolve",
    voice: "Three options, none as good as what already failed. I asked what he'd choose for his own mother. He paused too long.",
    slSource: "BMC Cancer 2024 + MDPI 2026 NLP Scoping Review",
    sentiment: [
      { label: "Desire for shared decisions", pct: 67, c: C.indigo },
      { label: "Information gaps (NLP)", pct: 52, c: C.amber },
      { label: "Treatment fatigue", pct: 48, c: C.orange },
      { label: "Decisional regret risk", pct: 34, c: C.red },
    ],
    themes: ["NLP identifies info gaps that surveys miss (MDPI 2026)", "Suboptimal communication = top nonadherence risk", "53% of patients not presented all options"],
    insight: "Unmet emotional needs + suboptimal communication are the two strongest NLP-identified predictors of nonadherence — both peak at 2L decision where options are weakest.",
    clinical: "No FDA-approved 2L standard. BRAF-WT (~55%) severely limited. 53% not shown all options.",
    frictions: [
      { t: "BRAF-WT (~55%) have no targeted option", s: "critical", d: "Primarily ipi or trial" },
      { t: "53% not shown all available options", s: "high", d: "Community less likely to mention trials" },
    ],
    pharma: [
      { type: "Education", icon: "📋", imp: "HIGH", label: "Shared decision-making platform", detail: "Visual RWD outcomes by 2L sequence matched to patient profile.", metric: "Options shown", from: "53%", to: "89%", delta: "+36pts" },
    ],
  },
  {
    id: "2ls", phase: "2L START", week: 52, color: C.emerald,
    title: "Second-Line Begins",
    energy: 30, hope: 44, anxiety: 68, autonomy: 38,
    emotion: "Wary Determination",
    voice: "I'm not naive this time. But I'm here, I'm fighting. My daughter made me promise to keep showing up.",
    slSource: "BMC Cancer 2024 + Dresden HRQoL pilot",
    sentiment: [
      { label: "Cautious hope", pct: 44, c: C.emerald },
      { label: "Financial distress", pct: 68, c: C.red },
      { label: "Treatment fatigue", pct: 56, c: C.amber },
      { label: "Gratitude for options", pct: 38, c: C.cyan },
    ],
    themes: ["Starting 2L provides measurable emotional relief", "Financial toxicity language peaks in 2L posts", "Treatment gap — not treatment itself — is primary suffering source"],
    insight: "Starting 2L, regardless of regimen, provides relief. BMC Cancer qualitative confirms the gap (not treatment) is the primary suffering source — supporting gap-reduction as highest-ROI intervention.",
    clinical: "Of 47% reaching 2L: 28% ipi, 21% BRAF/MEK, 10% trial. PMPM $18,750. Financial toxicity 68%.",
    frictions: [
      { t: "Financial toxicity peaks — 68% cost-related distress", s: "high", d: "PMPM $18,750 (+123%)" },
      { t: "PS declined during limbo gap", s: "high", d: "ECOG +0.5-1 point" },
    ],
    pharma: [
      { type: "Support", icon: "💰", imp: "HIGH", label: "2L financial navigation", detail: "Financial navigator + copay assistance at 2L decision point.", metric: "Cost d/c", from: "12%", to: "4%", delta: "-8pts" },
    ],
  },
  {
    id: "mon", phase: "ONGOING", week: 64, color: C.sky,
    title: "Monitoring & Beyond",
    energy: 28, hope: 38, anxiety: 74, autonomy: 32,
    emotion: "Exhausted Vigilance",
    voice: "I plan my life in 12-week intervals now. My wife says I disappear for a week before each scan. She's right.",
    slSource: "MIA + Fear-Less Program (PMC) + Reddit NLP longitudinal",
    sentiment: [
      { label: "Recurring scanxiety", pct: 85, c: C.red },
      { label: "Fear of recurrence", pct: 78, c: C.rose },
      { label: "Post-tx adjustment", pct: 48, c: C.amber },
      { label: "Survivor guilt", pct: 22, c: C.violet },
    ],
    themes: ["Fear-Less CBT program shows feasibility for reducing recurrence fear", "Scanxiety is cyclical — tied to surveillance schedule", "Post-treatment patients feel 'adrift' without active therapy structure"],
    insight: "Psychological burden doesn't end with treatment. Survivorship carries recurring scanxiety, fear of recurrence, and permanent precariousness. Palliative care remains <20% despite ASCO guidelines.",
    clinical: "27% complete 2L, 11.5% reach 3L. 41% no 2L: OS 6.8m. Palliative care <20%.",
    frictions: [
      { t: "41% untreated invisible to system", s: "critical", d: "Minimal structured support" },
      { t: "Palliative care <20% despite guidelines", s: "high", d: "Stigma + late referral" },
    ],
    pharma: [
      { type: "Support", icon: "🤝", imp: "HIGH", label: "Longitudinal patient ecosystem", detail: "Psycho-oncology, peer matching, palliative navigation — including 41% off therapy.", metric: "Palliative", from: "20%", to: "52%", delta: "+32pts" },
    ],
  },
];

const ENERGY = JOURNEY.map((j) => ({
  week: "W" + j.week,
  phase: j.phase.substring(0, 5),
  energy: j.energy,
  hope: j.hope,
  anxiety: j.anxiety,
  autonomy: j.autonomy,
}));

const IMPACT = [];
JOURNEY.forEach((j) =>
  j.pharma.forEach((p) =>
    IMPACT.push({
      label: p.label,
      stage: j.phase,
      imp: p.imp,
      metric: p.metric,
      from: p.from,
      to: p.to,
      delta: p.delta,
    })
  )
);
IMPACT.sort(
  (a, b) =>
    ({ CRITICAL: 0, HIGH: 1, MEDIUM: 2 }[a.imp] || 3) -
    ({ CRITICAL: 0, HIGH: 1, MEDIUM: 2 }[b.imp] || 3)
);

// ── Components ──
function Tip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 8, padding: "6px 10px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
      <div style={{ fontSize: 10, color: "#8891a8", marginBottom: 3 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 11, color: p.color || "#1a1d2e" }}>
          {p.name}: <b>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</b>
        </div>
      ))}
    </div>
  );
}

function Legend({ items }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 6, flexWrap: "wrap" }}>
      {items.map(function (it, i) {
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: it.dash ? 2 : 10, borderRadius: it.dash ? 0 : 2, background: it.color, borderTop: it.dash ? "2px dashed " + it.color : "none" }} />
            <span style={{ fontSize: 10, color: "#4a5068" }}>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function Insight({ text, color }) {
  var c = color || C.indigo;
  return (
    <div style={{ marginTop: 8, padding: "8px 12px", background: c + "08", borderRadius: 6, borderLeft: "3px solid " + c }}>
      <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
        <span style={{ fontSize: 9, fontWeight: 800, color: c, fontFamily: "monospace", marginTop: 1, whiteSpace: "nowrap" }}>KEY TAKEAWAY</span>
        <span style={{ fontSize: 11, color: "#1a1d2e", lineHeight: 1.5 }}>{text}</span>
      </div>
    </div>
  );
}

function KPI({ label, value, unit, delta, dir, color, small }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 10, padding: small ? "10px 12px" : "14px 18px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color || C.indigo }} />
      <div style={{ fontSize: 9, color: "#8891a8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontFamily: "monospace" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
        <span style={{ fontSize: small ? 20 : 28, fontWeight: 700, color: "#1a1d2e" }}>{value}</span>
        {unit && <span style={{ fontSize: 11, color: "#8891a8" }}>{unit}</span>}
      </div>
      {delta && (
        <div style={{ marginTop: 3, fontSize: 10, fontWeight: 600, color: dir === "up" ? C.emerald : dir === "down" ? C.red : "#8891a8", fontFamily: "monospace" }}>
          {dir === "up" ? "▲" : dir === "down" ? "▼" : "●"} {delta}
        </div>
      )}
    </div>
  );
}

// ── Shared Emotional Chart Component ──
function EmotionalChart({ compact }) {
  const [chartMode, setChartMode] = useState("emotion");
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 10, padding: 14, marginTop: compact ? 14 : 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 9, color: "#8891a8", textTransform: "uppercase", letterSpacing: 1, fontFamily: "monospace" }}>
          {compact ? "Patient Emotional Trajectory" : "Emotional Trajectory — Social Listening + PRO Sourced"}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={function () { setChartMode("emotion"); }} style={{ padding: "3px 8px", borderRadius: 12, border: "1px solid " + (chartMode === "emotion" ? C.indigo : "#e2e6ef"), background: chartMode === "emotion" ? "#eef2ff" : "#fff", color: chartMode === "emotion" ? C.indigo : "#8891a8", fontSize: 10, cursor: "pointer" }}>Emotion</button>
          <button onClick={function () { setChartMode("autonomy"); }} style={{ padding: "3px 8px", borderRadius: 12, border: "1px solid " + (chartMode === "autonomy" ? C.indigo : "#e2e6ef"), background: chartMode === "autonomy" ? "#eef2ff" : "#fff", color: chartMode === "autonomy" ? C.indigo : "#8891a8", fontSize: 10, cursor: "pointer" }}>Autonomy</button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={compact ? 200 : 260}>
        <LineChart data={ENERGY} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ef" />
          <ReferenceArea x1="W36" x2="W48" y1={0} y2={100} fill={C.red} fillOpacity={0.06} label={{ value: "CRITICAL FRICTION ZONE", position: "insideTop", fill: C.red, fontSize: 9, fontWeight: 800, fontFamily: "monospace", dy: 6 }} />
          <ReferenceLine x="W36" stroke={C.red} strokeDasharray="4 3" strokeWidth={1.5} />
          <ReferenceLine x="W42" stroke={C.rose} strokeWidth={2} strokeDasharray="3 2" label={{ value: "▼ NADIR", position: "insideBottomLeft", fill: C.rose, fontSize: 8, fontWeight: 800, fontFamily: "monospace" }} />
          <ReferenceLine x="W48" stroke={C.amber} strokeDasharray="4 3" strokeWidth={1.5} />
          <ReferenceLine x="W64" stroke={C.red} strokeDasharray="4 3" strokeWidth={1} label={{ value: "41% LOST", position: "insideTopRight", fill: C.red, fontSize: 7, fontWeight: 700, fontFamily: "monospace" }} />
          <ReferenceLine y={25} stroke={C.amber} strokeDasharray="8 4" strokeWidth={1} label={{ value: "DANGER THRESHOLD", position: "insideTopLeft", fill: C.amber, fontSize: 7, fontWeight: 700, fontFamily: "monospace", dx: 4 }} />
          <XAxis dataKey="week" interval={0} tick={function(props) {
            var item = ENERGY[props.index] || {};
            return (
              <g transform={"translate(" + props.x + "," + props.y + ")"}>
                <text x={0} y={0} dy={12} textAnchor="middle" fill="#1a1d2e" fontSize={10} fontFamily="monospace" fontWeight={700}>{item.week}</text>
                <text x={0} y={0} dy={24} textAnchor="middle" fill="#8891a8" fontSize={8}>{item.phase}</text>
              </g>
            );
          }} height={40} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 9 }} domain={[0, 100]} />
          <Tooltip content={<Tip />} />
          <Line type="monotone" dataKey="energy" stroke={C.emerald} strokeWidth={3} name="Energy" dot={{ r: 5, fill: C.emerald, stroke: "#fff", strokeWidth: 2 }} strokeOpacity={1} />
          <Line type="monotone" dataKey="hope" stroke={C.cyan} strokeWidth={chartMode === "emotion" ? 3 : 0} name="Hope" dot={chartMode === "emotion" ? { r: 5, fill: C.cyan, stroke: "#fff", strokeWidth: 2 } : false} strokeOpacity={chartMode === "emotion" ? 1 : 0} />
          <Line type="monotone" dataKey="anxiety" stroke={C.red} strokeWidth={chartMode === "emotion" ? 3 : 0} name="Anxiety" strokeDasharray="6 3" dot={chartMode === "emotion" ? { r: 5, fill: C.red, stroke: "#fff", strokeWidth: 2 } : false} strokeOpacity={chartMode === "emotion" ? 1 : 0} />
          <Line type="monotone" dataKey="autonomy" stroke={C.violet} strokeWidth={chartMode === "autonomy" ? 3 : 0} name="Autonomy" dot={chartMode === "autonomy" ? { r: 5, fill: C.violet, stroke: "#fff", strokeWidth: 2 } : false} strokeOpacity={chartMode === "autonomy" ? 1 : 0} />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 4 }}>
        <span style={{ fontSize: 10, color: C.emerald }}>● Energy</span>
        {chartMode === "emotion" && <span style={{ fontSize: 10, color: C.cyan }}>● Hope</span>}
        {chartMode === "emotion" && <span style={{ fontSize: 10, color: C.red }}>- - Anxiety</span>}
        {chartMode === "autonomy" && <span style={{ fontSize: 10, color: C.violet }}>● Autonomy</span>}
      </div>
      {!compact && (
        <div>
          <div style={{ marginTop: 6, padding: "6px 12px", background: C.rose + "08", borderRadius: 6, textAlign: "center" }}>
            <span style={{ fontSize: 11, color: C.rose }}>⚠ Energy=15, Hope=18 nadir at <b>W42 "The Limbo"</b> while Anxiety=96. Social listening: highest distress language + catastrophic thinking.</span>
          </div>
          <div style={{ marginTop: 4, fontSize: 9, color: "#8891a8", textAlign: "center", fontStyle: "italic" }}>
            JMIR Cancer SML (n=864) · Reddit NLP (n=72,524) · BMC Cancer (n=35) · ScienceDirect PRO (n=19) · EMJ 2025 · MIA Scanxiety
          </div>
        </div>
      )}
    </div>
  );
}

// ── Layer 0: Executive ──
function L0() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
        <KPI label="2L Eligible" value="14,280" unit="/yr" color={C.indigo} delta="+8.2% YoY" dir="up" />
        <KPI label="Progressing ≤12m" value="62%" color={C.amber} />
        <KPI label="Reaching 2L" value="47%" color={C.emerald} delta="+3.1pts" dir="up" />
        <KPI label="Median 1L→2L" value="8.3" unit="mo" color={C.cyan} />
        <KPI label="Community" value="68%" color={C.violet} delta="vs 32% academic" />
        <KPI label="PMPM Post" value="$18,750" color={C.red} delta="+123%" dir="down" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 9, color: "#8891a8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontFamily: "monospace" }}>Population Funnel</div>
          {FUNNEL.map((d, i) => (
            <div key={i} style={{ marginBottom: 5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{ fontSize: 11, color: "#4a5068" }}>{d.stage}</span>
                <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "monospace" }}>{d.value.toLocaleString()} ({d.pct}%)</span>
              </div>
              <div style={{ height: 12, background: "#f1f3f9", borderRadius: 3 }}>
                <div style={{ width: d.pct + "%", height: "100%", background: "linear-gradient(90deg,#4f46e5aa,#7c3aed66)", borderRadius: 3 }} />
              </div>
            </div>
          ))}
          <Insight text="53% attrition from progression to 2L start. The 41% who never receive 2L represent ~$127M in annual unrealized revenue and 6.8m median OS vs 14-21m for treated patients." color={C.violet} />
        </div>
        <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 9, color: "#8891a8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontFamily: "monospace" }}>Cost at Progression</div>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={COST_ACCEL}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ef" />
              <XAxis dataKey="m" tick={{ fill: "#8891a8", fontSize: 9 }} />
              <YAxis tick={{ fill: "#8891a8", fontSize: 9 }} tickFormatter={(v) => "$" + (v / 1000).toFixed(0) + "k"} />
              <Tooltip content={<Tip />} />
              <Line type="monotone" dataKey="pre" stroke={C.indigo} strokeWidth={2.5} dot={false} name="Pre" />
              <Line type="monotone" dataKey="post" stroke={C.red} strokeWidth={2.5} dot={false} name="Post" />
            </LineChart>
          </ResponsiveContainer>
          <Legend items={[{ label: "Pre-Progression", color: C.indigo }, { label: "Post-Progression", color: C.red }]} />
          <Insight text="PMPM jumps 123% at progression ($8,420→$18,750). ER visits spike 183% and steroid courses increase 132%." color={C.red} />
        </div>
      </div>
      <EmotionalChart compact={true} />
    </div>
  );
}

// ── Layer 1: Sequencing ──
function L1() {
  const [f, setF] = useState("pct");
  const data = SEQ.map((s) => ({ ...s, val: s[f] }));
  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[["pct", "All"], ["brafMut", "BRAF Mut"], ["brafWT", "BRAF WT"]].map(([k, l]) => (
          <button key={k} onClick={() => setF(k)} style={{ padding: "4px 10px", borderRadius: 14, border: "1px solid " + (f === k ? C.indigo : "#e2e6ef"), background: f === k ? "#eef2ff" : "#fff", color: f === k ? C.indigo : "#8891a8", fontSize: 11, cursor: "pointer" }}>{l}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 10, padding: 14 }}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data} dataKey="val" nameKey="name" cx="50%" cy="50%" innerRadius={38} outerRadius={68} paddingAngle={3} label={function(entry){ return entry.name + " " + entry.val + "%"; }} labelLine={true} style={{ fontSize: 9 }}>
                {data.map((_, i) => (<Cell key={i} fill={[C.indigo, C.amber, C.emerald, C.red][i]} />))}
              </Pie>
              <Tooltip content={<Tip />} />
            </PieChart>
          </ResponsiveContainer>
          <Legend items={[{ label: "PD-1→Ipi", color: C.indigo }, { label: "PD-1→BRAF/MEK", color: C.amber }, { label: "PD-1→Trial", color: C.emerald }, { label: "PD-1→No Tx", color: C.red }]} />
          <Insight text="41% receive no 2L therapy — the single largest 'treatment pathway.' BRAF-WT patients disproportionately fall into this group (40% vs 14% BRAF-mut)." color={C.red} />
        </div>
        <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 10, padding: 14 }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={OUTCOMES}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ef" />
              <XAxis dataKey="cluster" tick={{ fill: "#8891a8", fontSize: 8 }} />
              <YAxis tick={{ fill: "#8891a8", fontSize: 9 }} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="medOS" fill={C.cyan} name="rwOS" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="rwTTNT" fill={C.violet} name="rwTTNT" radius={[3, 3, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
          <Legend items={[{ label: "Median rwOS (months)", color: C.cyan }, { label: "rwTTNT (months)", color: C.violet }]} />
          <Insight text="Trial patients achieve longest rwOS (21.4m) — yet only 10% are enrolled. BRAF/MEK offers 18.6m rwOS for BRAF-mut, highlighting the 2L biomarker-driven gap." color={C.cyan} />
        </div>
      </div>
    </div>
  );
}

// ── Layer 2: Friction ──
function L2() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 10, padding: 14 }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={FRICTION} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ef" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#8891a8", fontSize: 9 }} />
              <YAxis type="category" dataKey="step" tick={{ fill: "#4a5068", fontSize: 9 }} width={100} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="target" fill={C.emerald} name="Target" radius={[0, 3, 3, 0]} barSize={11} />
              <Bar dataKey="gap" fill={C.red} name="Excess" radius={[0, 3, 3, 0]} barSize={11} />
            </BarChart>
          </ResponsiveContainer>
          <Legend items={[{ label: "Target (days)", color: C.emerald }, { label: "Excess (days)", color: C.red }]} />
          <Insight text="Every interval exceeds target by 45-100%. The Dx→Decision step has the largest excess (14d) — where oncologist 2L conviction is weakest." color={C.red} />
        </div>
        <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 10, padding: 14 }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={GAP_DIST}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ef" />
              <XAxis dataKey="range" tick={{ fill: "#8891a8", fontSize: 9 }} />
              <YAxis tick={{ fill: "#8891a8", fontSize: 9 }} tickFormatter={(v) => v + "%"} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="community" fill={C.amber} name="Community" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="academic" fill={C.indigo} name="Academic" radius={[3, 3, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
          <Legend items={[{ label: "Community", color: C.amber }, { label: "Academic", color: C.indigo }]} />
          <Insight text="64% of community patients have gaps >60d vs only 34% academic. This 45-day setting differential is the single largest modifiable driver of 2L attrition." color={C.amber} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        <KPI small label="Total Gap" value="109" unit="d" color={C.red} delta="Target 58d" dir="down" />
        <KPI small label=">60d Gap" value="42%" color={C.amber} />
        <KPI small label="Trial Loss" value="38%" color={C.rose} />
        <KPI small label="Referral" value="23" unit="d" color={C.cyan} />
      </div>
    </div>
  );
}

// ── Layer 3: Cost ──
function L3() {
  return (
    <div>
      <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 10, padding: 14, marginBottom: 14 }}>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={COST_MO}>
            <defs>
              <linearGradient id="gt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.indigo} stopOpacity={0.15} /><stop offset="95%" stopColor={C.indigo} stopOpacity={0.02} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ef" />
            <XAxis dataKey="m" tick={{ fill: "#8891a8", fontSize: 9 }} />
            <YAxis tick={{ fill: "#8891a8", fontSize: 9 }} tickFormatter={(v) => "$" + (v / 1000).toFixed(0) + "k"} />
            <Tooltip content={<Tip />} />
            <Area type="monotone" dataKey="treated" stroke={C.indigo} fill="url(#gt)" strokeWidth={2.5} name="Treated" />
            <Area type="monotone" dataKey="untreated" stroke={C.red} fill="none" strokeWidth={2} strokeDasharray="5 3" name="Untreated" />
          </AreaChart>
        </ResponsiveContainer>
        <Legend items={[{ label: "2L Treated PMPM", color: C.indigo }, { label: "Untreated PMPM", color: C.red, dash: true }]} />
        <Insight text="Treated patients cost more post-progression ($17-20K/mo) but generate 2-3x the OS. Untreated cost drops as patients disengage — then spikes in terminal hospitalization not shown here." color={C.indigo} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 10, padding: 14 }}>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={UTIL} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ef" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#8891a8", fontSize: 9 }} />
              <YAxis type="category" dataKey="m" tick={{ fill: "#4a5068", fontSize: 9 }} width={60} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="pre" fill={C.indigo} name="Pre" radius={[0, 3, 3, 0]} barSize={9} />
              <Bar dataKey="post" fill={C.red} name="Post" radius={[0, 3, 3, 0]} barSize={9} />
            </BarChart>
          </ResponsiveContainer>
          <Legend items={[{ label: "Pre-Progression", color: C.indigo }, { label: "Post-Progression", color: C.red }]} />
          <Insight text="ER visits nearly triple at progression (24→68%). Steroid courses more than double — each course potentially blunting IO efficacy by 15% PFS." color={C.red} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <KPI small label="PMPM Pre" value="$8,420" color={C.indigo} />
          <KPI small label="PMPM Post" value="$18,750" color={C.red} delta="+$10,330" dir="down" />
          <KPI small label="Brain Admits" value="19%" color={C.rose} delta="vs 6% pre" dir="down" />
          <KPI small label="Steroid Post" value="72%" color={C.amber} delta="vs 31% pre" dir="down" />
        </div>
      </div>
    </div>
  );
}

// ── Layer 4: Prescribers ──
function L4() {
  const [lot, setLot] = useState("all");

  var filtered = ACADEMIC.map(function (c) {
    if (lot === "all") return { ...c, display: c.total };
    if (lot === "2L") return { ...c, display: c.lot2 };
    if (lot === "3L+") return { ...c, display: c.lot3 };
    if (lot === "4359") return { ...c, display: c.eligible4359 };
    return c;
  }).sort(function (a, b) { return b.display - a.display; });

  var totalFiltered = 0;
  filtered.forEach(function (c) { totalFiltered += c.display; });
  var total4359 = 0;
  ACADEMIC.forEach(function (c) { total4359 += c.eligible4359; });
  var sites4359 = 0;
  ACADEMIC.forEach(function (c) { if (c.trial4359) sites4359++; });

  return (
    <div>
      {/* Setting Breakdown KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
        <KPI small label="Community" value="68%" color={C.amber} delta="9,700 1L pts" />
        <KPI small label="Academic" value="32%" color={C.indigo} delta="4,580 1L pts" />
        <KPI small label="4359 Eligible" value={total4359.toLocaleString()} color={C.emerald} delta="CPI-refractory" />
        <KPI small label="4359 Trial Sites" value={sites4359} color={C.violet} delta="NCT05533697" />
      </div>

      {/* Community vs Academic Split */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 9, color: "#8891a8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontFamily: "monospace" }}>Academic vs Community — Patient Volume by LOT</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {SETTING.map(function (s, i) {
              var isAcad = s.setting === "Academic";
              var c = isAcad ? C.indigo : C.amber;
              return (
                <div key={i} style={{ background: c + "06", borderRadius: 8, padding: 12, border: "1px solid " + c + "22" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: c, marginBottom: 8 }}>{s.setting} ({s.pct}%)</div>
                  {[
                    { label: "1L Patients", val: s.pts1L },
                    { label: "Reach 2L", val: s.pts2L },
                    { label: "No 2L (lost)", val: s.ptsNo2L },
                  ].map(function (row, ri) {
                    var isLost = ri === 2;
                    return (
                      <div key={ri} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: ri < 2 ? "1px solid " + c + "12" : "none" }}>
                        <span style={{ fontSize: 11, color: isLost ? C.red : "#4a5068" }}>{row.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: isLost ? C.red : c }}>{row.val.toLocaleString()}</span>
                      </div>
                    );
                  })}
                  <div style={{ marginTop: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontSize: 9, color: "#8891a8" }}>2L Conversion</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: c, fontFamily: "monospace" }}>{Math.round(s.pts2L / s.pts1L * 100)}%</span>
                    </div>
                    <div style={{ height: 6, background: c + "12", borderRadius: 3 }}>
                      <div style={{ width: Math.round(s.pts2L / s.pts1L * 100) + "%", height: "100%", background: c + "aa", borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Insight text="Academic centers convert 84% of patients to 2L vs only 29% in community settings. The 3,920 community patients lost to follow-up represent the largest addressable population for care continuity interventions." color={C.amber} />
        </div>

        {/* Referral Flows (preserved) */}
        <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 9, color: "#8891a8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontFamily: "monospace" }}>Community → Academic Referral Flows</div>
          {REFERRALS.map(function (r, i) {
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 40, fontSize: 10, color: "#4a5068", textAlign: "right", fontWeight: 600 }}>{r.from}</div>
                <div style={{ flex: 1, height: 18, background: "#f1f3f9", borderRadius: 3 }}>
                  <div style={{ width: (r.vol / 3.5) + "%", height: "100%", background: C.emerald + "99", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 4 }}>
                    <span style={{ fontSize: 9, color: "#fff", fontFamily: "monospace", fontWeight: 700 }}>{r.vol}</span>
                  </div>
                </div>
                <div style={{ width: 90, fontSize: 10, color: C.emerald, fontWeight: 600 }}>{r.to}</div>
              </div>
            );
          })}
          <Legend items={[{ label: "Referral Volume (patients/yr)", color: C.emerald }]} />
          <Insight text="Only 32% of eligible community patients receive academic referral. Each referral adds 23 days but improves rwOS by 4.2 months — net positive for all but the most fragile patients." color={C.emerald} />
        </div>
      </div>

      {/* Academic Center Volume — Filterable */}
      <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 10, padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 9, color: "#8891a8", textTransform: "uppercase", letterSpacing: 1, fontFamily: "monospace" }}>Academic Center Volume — Line of Therapy Filter</div>
          <div style={{ display: "flex", gap: 4 }}>
            {[["all", "All Patients"], ["2L", "2L Treated"], ["3L+", "3L+ Refractory"], ["4359", "mRNA-4359 Eligible"]].map(function (f) {
              var active = lot === f[0];
              var btnC = f[0] === "4359" ? C.emerald : C.indigo;
              return (
                <button key={f[0]} onClick={function () { setLot(f[0]); }} style={{
                  padding: "4px 10px", borderRadius: 14, cursor: "pointer", fontSize: 10, fontWeight: active ? 700 : 500,
                  border: "1px solid " + (active ? btnC : "#e2e6ef"),
                  background: active ? btnC + "12" : "#fff",
                  color: active ? btnC : "#8891a8",
                }}>{f[1]}</button>
              );
            })}
          </div>
        </div>

        {/* 4359 Eligibility Banner */}
        {lot === "4359" && (
          <div style={{ marginBottom: 12, padding: "10px 14px", background: C.emerald + "08", borderRadius: 8, border: "1px solid " + C.emerald + "33" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 14 }}>🧬</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.emerald }}>mRNA-4359 Eligibility Criteria (NCT05533697)</div>
                <div style={{ fontSize: 10, color: "#4a5068" }}>CPI-refractory metastatic melanoma + pembrolizumab combination</div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.emerald, fontFamily: "monospace" }}>{total4359.toLocaleString()}</div>
                <div style={{ fontSize: 8, color: "#8891a8" }}>eligible patients/yr</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["CPI-refractory (progressed on anti-PD-1)", "No active CNS mets", "ECOG 0-1", "Measurable disease (RECIST 1.1)", "mRNA-4359 + pembro: 24% ORR, 67% PD-L1+"].map(function (crit, i) {
                return <span key={i} style={{ fontSize: 9, padding: "2px 8px", borderRadius: 10, background: C.emerald + "15", color: C.emerald, fontFamily: "monospace" }}>{crit}</span>;
              })}
            </div>
          </div>
        )}

        {/* Bar chart */}
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={filtered} layout="vertical" margin={{ left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ef" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#8891a8", fontSize: 9 }} />
            <YAxis type="category" dataKey="center" tick={{ fill: "#4a5068", fontSize: 10 }} width={120} />
            <Tooltip content={<Tip />} />
            <Bar dataKey="display" name={lot === "4359" ? "4359 Eligible" : lot === "3L+" ? "3L+ Patients" : lot === "2L" ? "2L Patients" : "All Patients"} radius={[0, 4, 4, 0]} barSize={18}>
              {filtered.map(function (c, i) {
                var barColor = lot === "4359" ? (c.trial4359 ? C.emerald : C.amber) : C.indigo;
                return <Cell key={i} fill={barColor} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {lot === "4359" && (
          <Legend items={[{ label: "Active NCT05533697 site", color: C.emerald }, { label: "No active trial site", color: C.amber }]} />
        )}
        {lot !== "4359" && (
          <Legend items={[{ label: lot === "all" ? "Total patients/yr" : lot === "2L" ? "2L treated patients/yr" : "3L+ refractory patients/yr", color: C.indigo }]} />
        )}

        {/* Detail table */}
        <div style={{ marginTop: 10, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e6ef" }}>
                {["Center", "Region", "Total", "2L", "3L+", "CPI-Ref", "4359 Elig", "Trial Site"].map(function (h) {
                  return <th key={h} style={{ padding: "5px 6px", textAlign: "left", color: "#8891a8", fontSize: 8, textTransform: "uppercase", fontFamily: "monospace" }}>{h}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {filtered.map(function (c, i) {
                var isTrialSite = c.trial4359;
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f3f9", background: lot === "4359" && isTrialSite ? C.emerald + "06" : "transparent" }}>
                    <td style={{ padding: "6px", fontWeight: 600, color: "#1a1d2e" }}>
                      {c.center}
                      {isTrialSite && lot === "4359" && <span style={{ marginLeft: 4, fontSize: 8, padding: "1px 5px", borderRadius: 4, background: C.emerald + "18", color: C.emerald, fontFamily: "monospace" }}>ACTIVE</span>}
                    </td>
                    <td style={{ padding: "6px", color: "#8891a8" }}>{c.region}</td>
                    <td style={{ padding: "6px", fontFamily: "monospace", fontWeight: 600 }}>{c.total.toLocaleString()}</td>
                    <td style={{ padding: "6px", fontFamily: "monospace", color: C.indigo }}>{c.lot2.toLocaleString()}</td>
                    <td style={{ padding: "6px", fontFamily: "monospace", color: C.violet }}>{c.lot3}</td>
                    <td style={{ padding: "6px", fontFamily: "monospace", color: C.red }}>{c.cpiRef}</td>
                    <td style={{ padding: "6px", fontFamily: "monospace", fontWeight: 700, color: C.emerald }}>{c.eligible4359}</td>
                    <td style={{ padding: "6px", textAlign: "center" }}>{isTrialSite ? <span style={{ color: C.emerald }}>✓</span> : <span style={{ color: "#d1d5db" }}>—</span>}</td>
                  </tr>
                );
              })}
              <tr style={{ borderTop: "2px solid #e2e6ef", fontWeight: 700 }}>
                <td style={{ padding: "6px", color: "#1a1d2e" }}>TOTAL</td>
                <td style={{ padding: "6px" }}></td>
                <td style={{ padding: "6px", fontFamily: "monospace" }}>{ACADEMIC.reduce(function (s, c) { return s + c.total; }, 0).toLocaleString()}</td>
                <td style={{ padding: "6px", fontFamily: "monospace", color: C.indigo }}>{ACADEMIC.reduce(function (s, c) { return s + c.lot2; }, 0).toLocaleString()}</td>
                <td style={{ padding: "6px", fontFamily: "monospace", color: C.violet }}>{ACADEMIC.reduce(function (s, c) { return s + c.lot3; }, 0)}</td>
                <td style={{ padding: "6px", fontFamily: "monospace", color: C.red }}>{ACADEMIC.reduce(function (s, c) { return s + c.cpiRef; }, 0).toLocaleString()}</td>
                <td style={{ padding: "6px", fontFamily: "monospace", fontWeight: 800, color: C.emerald }}>{total4359.toLocaleString()}</td>
                <td style={{ padding: "6px", textAlign: "center", color: C.emerald }}>{sites4359}/10</td>
              </tr>
            </tbody>
          </table>
        </div>

        {lot === "4359" ? (
          <Insight text={"MD Anderson (186), Dana-Farber (117), and U Chicago (68) are the top 3 centers by mRNA-4359 eligible volume. 7 of 10 academic centers are active NCT05533697 sites. MSK (168 eligible) and Moffitt (90) are NOT active trial sites — representing 258 CPI-refractory patients/yr as untapped referral targets for trial enrollment."} color={C.emerald} />
        ) : lot === "3L+" ? (
          <Insight text="MD Anderson leads with 185 heavily pre-treated 3L+ patients, followed by MSK (162) and Dana-Farber (118). These patients have exhausted standard options and represent the most urgent unmet need — and the highest-value population for novel agents like mRNA-4359." color={C.violet} />
        ) : lot === "2L" ? (
          <Insight text="MD Anderson treats the most 2L patients (680/yr), but MSK and Dana-Farber together handle 1,043 — nearly half the academic 2L volume. Community-to-academic referral at the 2L decision point could redirect 1,200+ patients annually to centers with trial access." color={C.indigo} />
        ) : (
          <Insight text="10 academic centers manage 7,000 melanoma patients/yr (32% of total). MD Anderson and MSK together account for 38% of academic volume. Trial enrollment remains at only 10% despite 7 active mRNA-4359 sites — filter by '4359 Eligible' to see the addressable population." color={C.indigo} />
        )}
      </div>

      {/* KOL / DOL Panel */}
      <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 10, padding: 14, marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 9, color: "#8891a8", textTransform: "uppercase", letterSpacing: 1, fontFamily: "monospace" }}>Key Opinion Leaders & Digital Opinion Leaders — US Melanoma</div>
            <div style={{ fontSize: 10, color: "#4a5068", marginTop: 2 }}>Ranked by tier, publication impact, and strategic relevance to mRNA-4359</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ fontSize: 8, padding: "2px 8px", borderRadius: 10, background: C.emerald + "15", color: C.emerald, fontFamily: "monospace" }}>🧬 = mRNA-4359 investigator</span>
            <span style={{ fontSize: 8, padding: "2px 8px", borderRadius: 10, background: C.indigo + "15", color: C.indigo, fontFamily: "monospace" }}>NCCN = panel member</span>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e6ef" }}>
                {["", "Name", "Institution", "Focus Area", "Pubs", "h-Index", "Key Trials", "Tier", "Moderna"].map(function (h) {
                  return <th key={h} style={{ padding: "6px 5px", textAlign: "left", color: "#8891a8", fontSize: 8, textTransform: "uppercase", fontFamily: "monospace" }}>{h}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {KOLS.map(function (k, i) {
                var tierC = k.tier === "T1" ? C.indigo : C.amber;
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f3f9", background: k.moderna ? C.emerald + "05" : "transparent" }}>
                    <td style={{ padding: "6px 4px", fontSize: 10 }}>{k.type === "KOL" ? "🎯" : "📢"}</td>
                    <td style={{ padding: "6px 4px", fontWeight: 700, color: "#1a1d2e", whiteSpace: "nowrap" }}>
                      {k.name}
                      {k.nccn && <span style={{ marginLeft: 4, fontSize: 7, padding: "1px 4px", borderRadius: 3, background: C.indigo + "15", color: C.indigo, fontFamily: "monospace" }}>NCCN</span>}
                    </td>
                    <td style={{ padding: "6px 4px", color: "#4a5068", whiteSpace: "nowrap" }}>{k.inst}</td>
                    <td style={{ padding: "6px 4px", color: "#8891a8", fontSize: 10 }}>{k.focus}</td>
                    <td style={{ padding: "6px 4px", fontFamily: "monospace", fontWeight: 600, textAlign: "center" }}>{k.pubs}</td>
                    <td style={{ padding: "6px 4px", fontFamily: "monospace", fontWeight: 600, textAlign: "center" }}>{k.hIndex}</td>
                    <td style={{ padding: "6px 4px", fontSize: 10, color: k.moderna ? C.emerald : "#4a5068" }}>{k.trials}</td>
                    <td style={{ padding: "6px 4px", textAlign: "center" }}>
                      <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 8, background: tierC + "15", color: tierC, fontWeight: 700, fontFamily: "monospace" }}>{k.tier}</span>
                    </td>
                    <td style={{ padding: "6px 4px", textAlign: "center" }}>{k.moderna ? <span style={{ color: C.emerald, fontWeight: 700 }}>🧬</span> : <span style={{ color: "#d1d5db" }}>—</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div style={{ padding: "10px 12px", borderRadius: 8, background: C.indigo + "06", border: "1px solid " + C.indigo + "15" }}>
            <div style={{ fontSize: 9, color: C.indigo, fontWeight: 700, fontFamily: "monospace", marginBottom: 4 }}>T1 KOLs — STRATEGIC VALUE</div>
            <div style={{ fontSize: 10, color: "#4a5068" }}>9 Tier-1 KOLs drive NCCN guidelines, lead pivotal trials, and shape national treatment algorithms. Ribas (UCLA) and Wolchok (MSK) defined modern melanoma IO. Sullivan (MGH) is mRNA-4359 coordinating PI.</div>
          </div>
          <div style={{ padding: "10px 12px", borderRadius: 8, background: C.amber + "06", border: "1px solid " + C.amber + "15" }}>
            <div style={{ fontSize: 9, color: C.amber, fontWeight: 700, fontFamily: "monospace", marginBottom: 4 }}>T2 DOLs — COMMUNITY REACH</div>
            <div style={{ fontSize: 10, color: "#4a5068" }}>5 Tier-2 DOLs bridge academic innovation to community practice. Hamid (Angeles Clinic) brings IO trial access to community settings. Patel (MDACC) champions health disparities in rare subtypes.</div>
          </div>
          <div style={{ padding: "10px 12px", borderRadius: 8, background: C.emerald + "06", border: "1px solid " + C.emerald + "15" }}>
            <div style={{ fontSize: 9, color: C.emerald, fontWeight: 700, fontFamily: "monospace", marginBottom: 4 }}>MODERNA 4359 — INVESTIGATORS</div>
            <div style={{ fontSize: 10, color: "#4a5068" }}>3 KOL/DOLs are active mRNA-4359 investigators: Sullivan (coordinating PI), Daud (UCSF site PI), Kummar (OHSU site PI). Priority engagement targets for advisory boards and data dissemination.</div>
          </div>
        </div>

        <Insight text="Sullivan (MGH) is the single most critical relationship for mRNA-4359 — coordinating PI with NCCN panel membership and Dana-Farber's 117 eligible patients. Wolchok (MSK) is NOT a 4359 investigator despite MSK having 168 eligible patients — highest-value recruitment target. Tawbi (MDACC) owns brain mets data critical for expanding 4359 eligibility criteria." color={C.emerald} />
      </div>
    </div>
  );
}

// ── Layer 5: Outcomes ──
function L5() {
  return (
    <div>
      <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 10, padding: 14 }}>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={SURV}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ef" />
            <XAxis dataKey="month" tick={{ fill: "#8891a8", fontSize: 9 }} />
            <YAxis tick={{ fill: "#8891a8", fontSize: 9 }} domain={[0, 100]} tickFormatter={(v) => v + "%"} />
            <Tooltip content={<Tip />} />
            <Line type="stepAfter" dataKey="brainMets" stroke={C.red} strokeWidth={2.5} dot={false} name="Brain Mets" />
            <Line type="stepAfter" dataKey="noBrain" stroke={C.cyan} strokeWidth={2.5} dot={false} name="No Brain Mets" />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 4 }}>
          <span style={{ fontSize: 10, color: C.red }}>● Brain Mets</span>
          <span style={{ fontSize: 10, color: C.cyan }}>● No Brain Mets</span>
        </div>
        <Insight text="Brain metastases halve 2L survival (12m vs 24m at median). Yet brain MRI workup at progression remains reactive — only 22% receive proactive screening. Proactive MRI at progression could detect 22% more brain mets early, shifting patients to the better curve." color={C.red} />
      </div>
    </div>
  );
}

// ── Layer 6: Patient Journey ──
function StageCard({ stage, open, onToggle }) {
  var maxSev = 0;
  stage.frictions.forEach(function (f) {
    var s = f.s === "critical" ? 3 : f.s === "high" ? 2 : 1;
    if (s > maxSev) maxSev = s;
  });
  var sevC = maxSev >= 3 ? C.red : maxSev >= 2 ? C.amber : "#8891a8";

  return (
    <div style={{ marginBottom: 6 }}>
      <div
        onClick={onToggle}
        style={{
          display: "flex", gap: 12, padding: "14px 16px", cursor: "pointer",
          background: open ? stage.color + "08" : "#fff",
          border: "1px solid " + (open ? stage.color : "#e2e6ef"),
          borderRadius: open ? "12px 12px 0 0" : 12,
          transition: "all 0.2s",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingLeft: 4, minWidth: 40 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: stage.color + "15", border: "2px solid " + stage.color,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, color: stage.color, fontFamily: "monospace",
          }}>W{stage.week}</div>
          <div style={{ width: 4, height: 30, background: "#f1f3f9", borderRadius: 2, marginTop: 4, overflow: "hidden", display: "flex", flexDirection: "column-reverse" }}>
            <div style={{ width: "100%", height: stage.energy + "%", background: C.emerald, borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
            <span style={{ fontSize: 9, color: stage.color, fontWeight: 700, letterSpacing: 1.2, fontFamily: "monospace" }}>{stage.phase}</span>
            {maxSev >= 2 && (
              <span style={{ fontSize: 8, fontWeight: 800, padding: "1px 6px", borderRadius: 5, background: sevC + "12", color: sevC, fontFamily: "monospace" }}>
                {maxSev >= 3 ? "CRITICAL" : "HIGH"} FRICTION
              </span>
            )}
            {stage.pharma.length > 0 && (
              <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 6px", borderRadius: 5, background: C.emerald + "12", color: C.emerald, fontFamily: "monospace" }}>
                {stage.pharma.length} INTERVENTION{stage.pharma.length > 1 ? "S" : ""}
              </span>
            )}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1d2e", marginBottom: 1 }}>{stage.title}</div>
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            {[
              { l: "Energy", v: stage.energy, c: C.emerald },
              { l: "Hope", v: stage.hope, c: C.cyan },
              { l: "Anxiety", v: stage.anxiety, c: C.red },
              { l: "Autonomy", v: stage.autonomy, c: C.violet },
            ].map(function (g, i) {
              return (
                <div key={i} style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
                    <span style={{ fontSize: 8, color: "#8891a8" }}>{g.l}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: g.c, fontFamily: "monospace" }}>{g.v}</span>
                  </div>
                  <div style={{ height: 4, background: g.c + "15", borderRadius: 2 }}>
                    <div style={{ width: g.v + "%", height: "100%", background: g.c + "aa", borderRadius: 2 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", color: "#8891a8", fontSize: 18, transform: open ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.2s" }}>›</div>
      </div>

      {open && (
        <div style={{ background: "#f8f9fc", border: "1px solid " + stage.color, borderTop: "none", borderRadius: "0 0 12px 12px", padding: "16px 18px" }}>
          {/* Voice */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: "#1a1d2e", fontStyle: "italic", lineHeight: 1.6, borderLeft: "3px solid " + C.orange, paddingLeft: 14, background: C.orange + "06", padding: "10px 14px", borderRadius: "0 8px 8px 0" }}>
              "{stage.voice}"
            </div>
            <span style={{ display: "inline-block", marginTop: 4, padding: "3px 10px", background: stage.color + "12", borderRadius: 6, fontSize: 11, color: stage.color, fontWeight: 600 }}>{stage.emotion}</span>
          </div>

          {/* Social Listening */}
          <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e6ef", padding: 14, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 13 }}>📡</span>
              <div>
                <div style={{ fontSize: 9, color: C.indigo, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", textTransform: "uppercase" }}>Social Listening Intelligence</div>
                <div style={{ fontSize: 10, color: "#8891a8" }}>{stage.slSource}</div>
              </div>
            </div>
            {stage.sentiment.map(function (s, i) {
              return (
                <div key={i} style={{ marginBottom: 5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
                    <span style={{ fontSize: 11, color: "#4a5068" }}>{s.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: s.c, fontFamily: "monospace" }}>{s.pct}%</span>
                  </div>
                  <div style={{ height: 5, background: s.c + "12", borderRadius: 3 }}>
                    <div style={{ width: s.pct + "%", height: "100%", background: s.c + "cc", borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: 8 }}>
              {stage.themes.map(function (t, i) {
                return (
                  <div key={i} style={{ display: "flex", gap: 5, marginBottom: 3, fontSize: 11, color: "#4a5068", lineHeight: 1.4 }}>
                    <span style={{ color: C.indigo, fontWeight: 800, fontSize: 8, marginTop: 3 }}>▸</span>{t}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 8, padding: "8px 12px", background: "#eef2ff", borderRadius: 6, border: "1px solid " + C.indigo + "22" }}>
              <div style={{ fontSize: 9, color: C.indigo, fontWeight: 700, fontFamily: "monospace", marginBottom: 2 }}>KEY INSIGHT</div>
              <div style={{ fontSize: 12, color: "#1a1d2e", lineHeight: 1.5 }}>{stage.insight}</div>
            </div>
          </div>

          {/* Clinical */}
          <div style={{ fontSize: 11, color: "#4a5068", lineHeight: 1.5, marginBottom: 12, background: "#fff", padding: 10, borderRadius: 8, border: "1px solid #e2e6ef" }}>
            <span style={{ fontSize: 9, color: "#8891a8", fontWeight: 700, fontFamily: "monospace" }}>CLINICAL: </span>{stage.clinical}
          </div>

          {/* Frictions + Pharma */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 9, color: C.red, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", marginBottom: 6 }}>FRICTIONS ({stage.frictions.length})</div>
              {stage.frictions.map(function (f, i) {
                var fc = f.s === "critical" ? C.red : f.s === "high" ? C.amber : "#8891a8";
                return (
                  <div key={i} style={{ padding: "6px 8px", borderRadius: 6, borderLeft: "3px solid " + fc, background: fc + "06", marginBottom: 4 }}>
                    <span style={{ fontSize: 8, fontWeight: 800, padding: "1px 4px", borderRadius: 3, background: fc + "15", color: fc, fontFamily: "monospace", textTransform: "uppercase" }}>{f.s}</span>
                    <div style={{ fontSize: 11, color: "#1a1d2e", marginTop: 3, lineHeight: 1.3 }}>{f.t}</div>
                    <div style={{ fontSize: 10, color: "#8891a8", fontFamily: "monospace", marginTop: 1 }}>{f.d}</div>
                  </div>
                );
              })}
            </div>
            <div>
              <div style={{ fontSize: 9, color: C.emerald, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", marginBottom: 6 }}>INTERVENTIONS ({stage.pharma.length})</div>
              {stage.pharma.map(function (p, i) {
                var pc = p.imp === "CRITICAL" ? C.red : p.imp === "HIGH" ? C.amber : C.emerald;
                return (
                  <div key={i} style={{ padding: "8px 10px", borderRadius: 6, background: pc + "06", border: "1px solid " + pc + "22", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                      <span style={{ fontSize: 14 }}>{p.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 8, color: pc, fontWeight: 700, fontFamily: "monospace" }}>{p.type}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1d2e" }}>{p.label}</div>
                      </div>
                      <span style={{ fontSize: 8, fontWeight: 800, padding: "1px 6px", borderRadius: 4, background: pc + "18", color: pc, fontFamily: "monospace" }}>{p.imp}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#4a5068", lineHeight: 1.4, marginBottom: 5 }}>{p.detail}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 6px", background: C.emerald + "08", borderRadius: 4 }}>
                      <span style={{ fontSize: 10, color: "#8891a8" }}>{p.metric}:</span>
                      <span style={{ fontSize: 10, color: "#8891a8", fontFamily: "monospace" }}>{p.from}</span>
                      <span style={{ fontSize: 10, color: "#8891a8" }}>→</span>
                      <span style={{ fontSize: 10, color: C.emerald, fontWeight: 700, fontFamily: "monospace" }}>{p.to}</span>
                      <span style={{ fontSize: 9, fontWeight: 800, color: C.emerald, fontFamily: "monospace", marginLeft: "auto" }}>{p.delta}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Stage Detail Panel (shared between map and timeline) ──
function StageDetail({ stage }) {
  return (
    <div style={{ background: "#f8f9fc", border: "1px solid " + stage.color, borderRadius: 12, padding: "16px 18px", marginTop: 12 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: stage.color + "15", border: "2px solid " + stage.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: stage.color, fontFamily: "monospace" }}>W{stage.week}</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1d2e" }}>{stage.phase}</div>
          <span style={{ fontSize: 11, color: stage.color, fontWeight: 600 }}>{stage.emotion}</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          {[{ l: "Energy", v: stage.energy, c: C.emerald }, { l: "Hope", v: stage.hope, c: C.cyan }, { l: "Anxiety", v: stage.anxiety, c: C.red }, { l: "Autonomy", v: stage.autonomy, c: C.violet }].map(function (g, i) {
            return (
              <div key={i} style={{ textAlign: "center", minWidth: 50 }}>
                <div style={{ fontSize: 8, color: "#8891a8" }}>{g.l}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: g.c, fontFamily: "monospace" }}>{g.v}</div>
                <div style={{ height: 4, background: g.c + "15", borderRadius: 2, marginTop: 2 }}>
                  <div style={{ width: g.v + "%", height: "100%", background: g.c + "aa", borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Voice */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: "#1a1d2e", fontStyle: "italic", lineHeight: 1.6, borderLeft: "3px solid " + C.orange, paddingLeft: 14, background: C.orange + "06", padding: "10px 14px", borderRadius: "0 8px 8px 0" }}>
          "{stage.voice}"
        </div>
      </div>

      {/* Social Listening */}
      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e6ef", padding: 14, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 13 }}>📡</span>
          <div>
            <div style={{ fontSize: 9, color: C.indigo, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", textTransform: "uppercase" }}>Social Listening Intelligence</div>
            <div style={{ fontSize: 10, color: "#8891a8" }}>{stage.slSource}</div>
          </div>
        </div>
        {stage.sentiment.map(function (s, i) {
          return (
            <div key={i} style={{ marginBottom: 5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
                <span style={{ fontSize: 11, color: "#4a5068" }}>{s.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: s.c, fontFamily: "monospace" }}>{s.pct}%</span>
              </div>
              <div style={{ height: 5, background: s.c + "12", borderRadius: 3 }}>
                <div style={{ width: s.pct + "%", height: "100%", background: s.c + "cc", borderRadius: 3 }} />
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 8 }}>
          {stage.themes.map(function (t, i) {
            return (
              <div key={i} style={{ display: "flex", gap: 5, marginBottom: 3, fontSize: 11, color: "#4a5068", lineHeight: 1.4 }}>
                <span style={{ color: C.indigo, fontWeight: 800, fontSize: 8, marginTop: 3 }}>▸</span>{t}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 8, padding: "8px 12px", background: "#eef2ff", borderRadius: 6, border: "1px solid " + C.indigo + "22" }}>
          <div style={{ fontSize: 9, color: C.indigo, fontWeight: 700, fontFamily: "monospace", marginBottom: 2 }}>KEY INSIGHT</div>
          <div style={{ fontSize: 12, color: "#1a1d2e", lineHeight: 1.5 }}>{stage.insight}</div>
        </div>
      </div>

      {/* Clinical */}
      <div style={{ fontSize: 11, color: "#4a5068", lineHeight: 1.5, marginBottom: 12, background: "#fff", padding: 10, borderRadius: 8, border: "1px solid #e2e6ef" }}>
        <span style={{ fontSize: 9, color: "#8891a8", fontWeight: 700, fontFamily: "monospace" }}>CLINICAL: </span>{stage.clinical}
      </div>

      {/* Frictions + Pharma */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, color: C.red, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", marginBottom: 6 }}>FRICTIONS ({stage.frictions.length})</div>
          {stage.frictions.map(function (f, i) {
            var fc = f.s === "critical" ? C.red : f.s === "high" ? C.amber : "#8891a8";
            return (
              <div key={i} style={{ padding: "6px 8px", borderRadius: 6, borderLeft: "3px solid " + fc, background: fc + "06", marginBottom: 4 }}>
                <span style={{ fontSize: 8, fontWeight: 800, padding: "1px 4px", borderRadius: 3, background: fc + "15", color: fc, fontFamily: "monospace", textTransform: "uppercase" }}>{f.s}</span>
                <div style={{ fontSize: 11, color: "#1a1d2e", marginTop: 3, lineHeight: 1.3 }}>{f.t}</div>
                <div style={{ fontSize: 10, color: "#8891a8", fontFamily: "monospace", marginTop: 1 }}>{f.d}</div>
              </div>
            );
          })}
        </div>
        <div>
          <div style={{ fontSize: 9, color: C.emerald, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", marginBottom: 6 }}>INTERVENTIONS ({stage.pharma.length})</div>
          {stage.pharma.map(function (p, i) {
            var pc = p.imp === "CRITICAL" ? C.red : p.imp === "HIGH" ? C.amber : C.emerald;
            return (
              <div key={i} style={{ padding: "8px 10px", borderRadius: 6, background: pc + "06", border: "1px solid " + pc + "22", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                  <span style={{ fontSize: 14 }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 8, color: pc, fontWeight: 700, fontFamily: "monospace" }}>{p.type}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1d2e" }}>{p.label}</div>
                  </div>
                  <span style={{ fontSize: 8, fontWeight: 800, padding: "1px 6px", borderRadius: 4, background: pc + "18", color: pc, fontFamily: "monospace" }}>{p.imp}</span>
                </div>
                <div style={{ fontSize: 11, color: "#4a5068", lineHeight: 1.4, marginBottom: 5 }}>{p.detail}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 6px", background: C.emerald + "08", borderRadius: 4 }}>
                  <span style={{ fontSize: 10, color: "#8891a8" }}>{p.metric}:</span>
                  <span style={{ fontSize: 10, color: "#8891a8", fontFamily: "monospace" }}>{p.from}</span>
                  <span style={{ fontSize: 10, color: "#8891a8" }}>→</span>
                  <span style={{ fontSize: 10, color: C.emerald, fontWeight: 700, fontFamily: "monospace" }}>{p.to}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: C.emerald, fontFamily: "monospace", marginLeft: "auto" }}>{p.delta}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Lost Patients Panel ──
function LostPanel() {
  return (
    <div style={{ background: "#fef2f2", border: "1px solid " + C.red, borderRadius: 12, padding: "16px 18px", marginTop: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fee2e2", border: "2px solid " + C.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: C.red }}>✕</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.red }}>LOST TO SYSTEM — 41% Never Treated</div>
          <span style={{ fontSize: 11, color: "#4a5068" }}>~5,855 patients/yr vanish from care after progression</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div style={{ background: "#fff", borderRadius: 8, padding: 10, textAlign: "center" }}>
          <div style={{ fontSize: 8, color: "#8891a8", fontFamily: "monospace" }}>MEDIAN rwOS</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.red, fontFamily: "monospace" }}>6.8m</div>
          <div style={{ fontSize: 9, color: "#8891a8" }}>vs 14-21m treated</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 8, padding: 10, textAlign: "center" }}>
          <div style={{ fontSize: 8, color: "#8891a8", fontFamily: "monospace" }}>ER VISITS 6M</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.red, fontFamily: "monospace" }}>78%</div>
          <div style={{ fontSize: 9, color: "#8891a8" }}>unplanned acute care</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 8, padding: 10, textAlign: "center" }}>
          <div style={{ fontSize: 8, color: "#8891a8", fontFamily: "monospace" }}>HOSPICE ONLY</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.red, fontFamily: "monospace" }}>62%</div>
          <div style={{ fontSize: 9, color: "#8891a8" }}>no oncology follow-up</div>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e2e6ef", padding: 12, marginBottom: 10 }}>
        <div style={{ fontSize: 9, color: C.indigo, fontWeight: 700, fontFamily: "monospace", marginBottom: 4 }}>📡 SOCIAL LISTENING — LOST PATIENT DISCOURSE</div>
        <div style={{ fontSize: 11, color: "#4a5068", lineHeight: 1.5 }}>
          Social media analysis of post-progression melanoma patients who did not initiate 2L reveals dominant themes of "feeling forgotten," "no one called," and "waiting for something." 62% express abandonment sentiment. Language shifts from active treatment vocabulary to passive/fatalistic framing within 4-6 weeks of last oncology contact.
        </div>
      </div>
      <Insight text="These patients are invisible to the health system — they don't appear in claims as 'untreated melanoma,' they appear as ER visits, hospice admissions, and death certificates. A care continuity bridge at W42 could recover 23% of this population into active 2L therapy." color={C.red} />
    </div>
  );
}

// ── Journey Mind Map ──
function JourneyMap() {
  const [selected, setSelected] = useState(null);
  var W = 1060;
  var H = 660;

  // Node-to-JOURNEY index mapping
  var nodeJourney = { dx: 0, "1l": 1, scan: 2, irae: 3, prog: 4, limbo: 5, "2ld_ipi": 6, "2ld_braf": 6, "2ld_trial": 6, "2ls": 7, ongoing: 8 };

  var nodes = [
    { id: "dx", x: 60, y: 250, label: "DIAGNOSIS", sub: "W0", color: C.violet, energy: 40, r: 28, tx: ["Biopsy", "BRAF/PD-L1"], txColor: C.violet },
    { id: "1l", x: 185, y: 250, label: "1L IO", sub: "W3", color: C.indigo, energy: 55, r: 26, tx: ["Nivo+Ipi 52%", "PD-1 mono 48%"], txColor: C.indigo },
    { id: "scan", x: 300, y: 250, label: "SCAN", sub: "W12", color: C.cyan, energy: 48, r: 24, tx: ["CT/PET", "ctDNA monitor"], txColor: C.cyan },
    { id: "irae", x: 415, y: 250, label: "irAE", sub: "W18", color: C.amber, energy: 30, r: 26, tx: ["Steroids 72%", "IO hold/d/c 36%"], txColor: C.amber },
    { id: "prog", x: 540, y: 250, label: "PROGRESS", sub: "W36", color: C.red, energy: 20, r: 30, tx: ["IO failure", "Brain MRI 22%"], txColor: C.red },
    { id: "limbo", x: 680, y: 250, label: "LIMBO", sub: "W42", color: C.rose, energy: 15, r: 34, tx: ["No active Tx", "109d median gap"], txColor: C.rose },
    // Branches from limbo
    { id: "notx", x: 850, y: 440, label: "NO TX", sub: "41%", color: "#9ca3af", energy: 0, r: 28, tx: ["BSC / hospice", "rwOS 6.8m"], txColor: "#9ca3af" },
    { id: "2ld_ipi", x: 850, y: 100, label: "IPI", sub: "28%", color: C.indigo, energy: 24, r: 22, tx: ["Ipilimumab", "rwOS 14.2m"], txColor: C.indigo },
    { id: "2ld_braf", x: 850, y: 190, label: "BRAF/MEK", sub: "21%", color: C.amber, energy: 24, r: 22, tx: ["Dab+Tram", "rwOS 18.6m"], txColor: C.amber },
    { id: "2ld_trial", x: 850, y: 280, label: "TRIAL", sub: "10%", color: C.emerald, energy: 24, r: 22, tx: ["Novel agents", "rwOS 21.4m"], txColor: C.emerald },
    // Convergence
    { id: "2ls", x: 960, y: 190, label: "2L START", sub: "W52", color: C.emerald, energy: 30, r: 26, tx: ["Active 2L Tx", "PMPM $18,750"], txColor: C.emerald },
    { id: "ongoing", x: 1020, y: 100, label: "ONGOING", sub: "W64+", color: C.sky, energy: 28, r: 22, tx: ["Surveillance", "q12w scans"], txColor: C.sky },
    { id: "lost", x: 950, y: 440, label: "LOST", sub: "6.8m OS", color: C.red, energy: 0, r: 20, tx: ["System invisible"], txColor: C.red },
  ];

  var mainPath = [
    { from: "dx", to: "1l" }, { from: "1l", to: "scan" },
    { from: "scan", to: "irae" }, { from: "irae", to: "prog" },
    { from: "prog", to: "limbo" },
  ];
  var branches = [
    { from: "limbo", to: "2ld_ipi", label: "28%", color: C.indigo },
    { from: "limbo", to: "2ld_braf", label: "21%", color: C.amber },
    { from: "limbo", to: "2ld_trial", label: "10%", color: C.emerald },
    { from: "limbo", to: "notx", label: "41% LOST", color: C.red },
    { from: "2ld_ipi", to: "2ls", label: "", color: C.indigo },
    { from: "2ld_braf", to: "2ls", label: "", color: C.amber },
    { from: "2ld_trial", to: "2ls", label: "", color: C.emerald },
    { from: "2ls", to: "ongoing", label: "", color: C.sky },
    { from: "notx", to: "lost", label: "", color: "#9ca3af" },
  ];

  function getNode(id) {
    for (var i = 0; i < nodes.length; i++) { if (nodes[i].id === id) return nodes[i]; }
    return null;
  }

  // Zones
  var zones = [
    { x: 30, y: 20, w: 450, h: 80, label: "TREATMENT PHASE", color: C.indigo },
    { x: 490, y: 20, w: 240, h: 80, label: "⚠ CRITICAL FRICTION ZONE", color: C.red },
    { x: 780, y: 20, w: 260, h: 80, label: "2L PATHWAYS", color: C.emerald },
  ];

  // Annotations
  var annotations = [
    { x: 540, y: 520, text: "109-day median gap", color: C.red },
    { x: 540, y: 542, text: "Community: 127d vs Academic: 82d", color: C.amber },
    { x: 850, y: 508, text: "rwOS: 6.8m — system invisible", color: C.red },
    { x: 960, y: 130, text: "27% complete 2L", color: C.emerald },
  ];

  return (
    <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 10, padding: 14, marginBottom: 16, overflowX: "auto" }}>
      <div style={{ fontSize: 9, color: "#8891a8", textTransform: "uppercase", letterSpacing: 1, fontFamily: "monospace", marginBottom: 8 }}>
        Journey Decision Map — Branching Pathways from Diagnosis to Outcome
      </div>
      <svg viewBox={"0 0 " + W + " " + H} width="100%" height="auto" style={{ minHeight: 400 }}>
        {/* Zone backgrounds */}
        {zones.map(function (z, i) {
          return (
            <g key={"z" + i}>
              <rect x={z.x} y={z.y} width={z.w} height={H - 60} rx={12} fill={z.color + "06"} stroke={z.color + "22"} strokeWidth={1} strokeDasharray="6 3" />
              <text x={z.x + z.w / 2} y={z.y + 16} textAnchor="middle" fontSize={9} fontWeight={800} fontFamily="monospace" fill={z.color}>{z.label}</text>
            </g>
          );
        })}

        {/* Main path connections */}
        {mainPath.map(function (edge, i) {
          var a = getNode(edge.from);
          var b = getNode(edge.to);
          if (!a || !b) return null;
          return (
            <line key={"mp" + i} x1={a.x + a.r} y1={a.y} x2={b.x - b.r} y2={b.y}
              stroke="#1a1d2e" strokeWidth={2.5} strokeLinecap="round" />
          );
        })}

        {/* Branch connections */}
        {branches.map(function (edge, i) {
          var a = getNode(edge.from);
          var b = getNode(edge.to);
          if (!a || !b) return null;
          var mx = (a.x + b.x) / 2;
          var d = "M" + (a.x + a.r) + "," + a.y + " C" + mx + "," + a.y + " " + mx + "," + b.y + " " + (b.x - b.r) + "," + b.y;
          var isLost = edge.from === "notx" || edge.to === "notx" || edge.to === "lost";
          return (
            <g key={"br" + i}>
              <path d={d} fill="none" stroke={edge.color} strokeWidth={isLost ? 3 : 2} strokeDasharray={isLost ? "6 4" : "none"} strokeLinecap="round" />
              {edge.label && (
                <text x={mx} y={(a.y + b.y) / 2 - 6} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={edge.color}>{edge.label}</text>
              )}
            </g>
          );
        })}

        {/* Danger arrow from limbo down */}
        <path d={"M680,284 L680,410"} stroke={C.red} strokeWidth={2} strokeDasharray="4 3" markerEnd="url(#arrowRed)" />
        <defs>
          <marker id="arrowRed" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={C.red} />
          </marker>
        </defs>

        {/* Nodes */}
        {nodes.map(function (n) {
          var isLost = n.id === "lost";
          var isNoTx = n.id === "notx";
          var isCritical = n.id === "prog" || n.id === "limbo";
          var isSelected = selected === n.id;
          var isClickable = nodeJourney[n.id] !== undefined || isNoTx || isLost;
          return (
            <g key={n.id} onClick={isClickable ? function () { setSelected(selected === n.id ? null : n.id); } : undefined} style={{ cursor: isClickable ? "pointer" : "default" }}>
              {/* Selection ring */}
              {isSelected && (
                <circle cx={n.x} cy={n.y} r={n.r + 10} fill="none" stroke={n.color} strokeWidth={3} opacity={0.8}>
                  <animate attributeName="r" values={(n.r + 8) + ";" + (n.r + 12) + ";" + (n.r + 8)} dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Pulse ring for critical */}
              {isCritical && !isSelected && (
                <circle cx={n.x} cy={n.y} r={n.r + 6} fill="none" stroke={n.color} strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
              )}
              {/* Node circle */}
              <circle cx={n.x} cy={n.y} r={n.r} fill={isLost ? "#fee2e2" : isNoTx ? "#f3f4f6" : n.color + "18"} stroke={n.color} strokeWidth={isCritical ? 3 : 2} />
              {/* Energy fill */}
              {n.energy > 0 && (
                <clipPath id={"clip-" + n.id}>
                  <circle cx={n.x} cy={n.y} r={n.r - 2} />
                </clipPath>
              )}
              {n.energy > 0 && (
                <rect
                  x={n.x - n.r} y={n.y + n.r - (n.energy / 100) * n.r * 2}
                  width={n.r * 2} height={(n.energy / 100) * n.r * 2}
                  fill={n.color + "25"}
                  clipPath={"url(#clip-" + n.id + ")"}
                />
              )}
              {/* X for lost */}
              {isLost && (
                <g>
                  <line x1={n.x - 8} y1={n.y - 8} x2={n.x + 8} y2={n.y + 8} stroke={C.red} strokeWidth={3} strokeLinecap="round" />
                  <line x1={n.x + 8} y1={n.y - 8} x2={n.x - 8} y2={n.y + 8} stroke={C.red} strokeWidth={3} strokeLinecap="round" />
                </g>
              )}
              {/* Labels */}
              <text x={n.x} y={n.y - 3} textAnchor="middle" fontSize={n.r > 26 ? 10 : 8} fontWeight={800} fontFamily="monospace" fill={isLost ? C.red : n.color}>{n.label}</text>
              <text x={n.x} y={n.y + 10} textAnchor="middle" fontSize={9} fontWeight={600} fill={isLost ? C.red : "#4a5068"}>{n.sub}</text>
              {/* Clickable highlight on hover */}
              {isClickable && (
                <circle cx={n.x} cy={n.y} r={n.r} fill="transparent" stroke="transparent" strokeWidth={10} />
              )}
              {/* Treatment type badges */}
              {n.tx && n.tx.map(function (t, ti) {
                var bw = t.length * 5.2 + 12;
                var bx = n.x - bw / 2;
                var by = n.y + n.r + 6 + ti * 16;
                return (
                  <g key={"tx" + ti}>
                    <rect x={bx} y={by} width={bw} height={14} rx={7} fill={n.txColor + "12"} stroke={n.txColor + "44"} strokeWidth={0.8} />
                    <text x={n.x} y={by + 10} textAnchor="middle" fontSize={8} fontWeight={600} fontFamily="monospace" fill={n.txColor}>{t}</text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Critical friction zone bracket */}
        <line x1={520} y1={320} x2={720} y2={320} stroke={C.red} strokeWidth={1.5} />
        <line x1={520} y1={315} x2={520} y2={325} stroke={C.red} strokeWidth={1.5} />
        <line x1={720} y1={315} x2={720} y2={325} stroke={C.red} strokeWidth={1.5} />
        <text x={620} y={340} textAnchor="middle" fontSize={8} fontWeight={800} fontFamily="monospace" fill={C.red}>CRITICAL FRICTION ZONE</text>
        <text x={620} y={354} textAnchor="middle" fontSize={8} fill={C.red}>Energy=15 · Hope=18 · Anxiety=96</text>

        {/* 2L Decision label */}
        <text x={850} y={62} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={C.indigo}>2L DECISION (W48)</text>
        <text x={850} y={76} textAnchor="middle" fontSize={8} fill="#8891a8">No FDA-approved standard</text>

        {/* Outcome annotations */}
        <g>
          <rect x={890} y={96} width={120} height={44} rx={6} fill="#ecfdf5" stroke={C.emerald + "44"} strokeWidth={1} />
          <text x={950} y={112} textAnchor="middle" fontSize={8} fontWeight={700} fontFamily="monospace" fill={C.emerald}>IPI: 14.2m rwOS</text>
          <text x={950} y={126} textAnchor="middle" fontSize={8} fontWeight={700} fontFamily="monospace" fill={C.emerald}>BRAF/MEK: 18.6m</text>
        </g>
        <g>
          <rect x={876} y={500} width={148} height={36} rx={6} fill="#fef2f2" stroke={C.red + "44"} strokeWidth={1} />
          <text x={950} y={514} textAnchor="middle" fontSize={8} fontWeight={800} fontFamily="monospace" fill={C.red}>41% NEVER TREATED</text>
          <text x={950} y={528} textAnchor="middle" fontSize={8} fill={C.red}>rwOS 6.8m · System invisible</text>
        </g>

        {/* Flow volume indicators */}
        <text x={120} y={230} textAnchor="middle" fontSize={8} fill="#8891a8" fontFamily="monospace">14,280/yr</text>
        <text x={370} y={230} textAnchor="middle" fontSize={8} fill="#8891a8" fontFamily="monospace">ORR 58%</text>
        <text x={480} y={230} textAnchor="middle" fontSize={8} fill={C.amber} fontFamily="monospace">irAE 59%</text>
        <text x={610} y={230} textAnchor="middle" fontSize={8} fill={C.red} fontFamily="monospace">62% progress ≤12m</text>

        {/* Intervention callouts */}
        <rect x={580} y={390} width={200} height={50} rx={8} fill="#fff" stroke={C.emerald} strokeWidth={1.5} />
        <text x={680} y={406} textAnchor="middle" fontSize={8} fontWeight={700} fontFamily="monospace" fill={C.emerald}>TOP INTERVENTIONS</text>
        <text x={680} y={420} textAnchor="middle" fontSize={8} fill="#4a5068">Care bridge: +23pts retention</text>
        <text x={680} y={432} textAnchor="middle" fontSize={8} fill="#4a5068">48h response: -23d gap</text>

        {/* Emotional trajectory mini-sparkline along main path */}
        <polyline
          points="60,210 185,200 300,204 415,218 540,228 680,232"
          fill="none" stroke={C.emerald} strokeWidth={1.5} strokeDasharray="3 2" opacity={0.6}
        />
        <text x={70} y={208} fontSize={7} fill={C.emerald} fontFamily="monospace">Energy</text>

      </svg>

      {/* Click instruction */}
      <div style={{ textAlign: "center", marginTop: 6, marginBottom: 2 }}>
        <span style={{ fontSize: 10, color: selected ? C.orange : "#8891a8", fontFamily: "monospace", fontWeight: 600 }}>
          {selected ? "✦ Viewing: " + (selected === "notx" || selected === "lost" ? "Lost Patients" : JOURNEY[nodeJourney[selected]] ? JOURNEY[nodeJourney[selected]].phase : "") + " — click again to close" : "↑ Click any milestone bubble to explore details"}
        </span>
      </div>

      {/* Detail Panel */}
      {selected && nodeJourney[selected] !== undefined && (
        <StageDetail stage={JOURNEY[nodeJourney[selected]]} />
      )}
      {selected && (selected === "notx" || selected === "lost") && (
        <LostPanel />
      )}

      {!selected && (
        <Insight text="The journey forks at W42 'The Limbo' — the single highest-leverage intervention point. 41% of patients exit the system permanently at this branch, invisible to care. The 59% who continue split across 3 pathways, none FDA-approved as a standard 2L. Every day in the critical friction zone (W36-W48) costs trial eligibility, performance status, and psychological capacity to engage." color={C.orange} />
      )}
      <div style={{ marginTop: 6, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
        <Legend items={[
          { label: "Main pathway", color: "#1a1d2e" },
          { label: "Ipi branch (28%)", color: C.indigo },
          { label: "BRAF/MEK (21%)", color: C.amber },
          { label: "Trial (10%)", color: C.emerald },
          { label: "No Tx / Lost (41%)", color: C.red, dash: true },
        ]} />
      </div>
      <div style={{ marginTop: 4, textAlign: "center" }}>
        <span style={{ fontSize: 9, color: "#8891a8", fontFamily: "monospace" }}>
          ◻ Treatment badges show active regimen/intervention at each phase
        </span>
      </div>
    </div>
  );
}

function L6() {
  const [expanded, setExpanded] = useState(5);
  const [view, setView] = useState("map");

  var totalOpps = 0;
  var critStages = 0;
  JOURNEY.forEach(function (j) {
    totalOpps += j.pharma.length;
    var hasCrit = false;
    j.frictions.forEach(function (f) { if (f.s === "critical") hasCrit = true; });
    if (hasCrit) critStages++;
  });

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
        <KPI small label="Stages" value={JOURNEY.length} color={C.orange} />
        <KPI small label="Critical Friction" value={critStages} color={C.red} />
        <KPI small label="Interventions" value={totalOpps} color={C.emerald} />
        <KPI small label="Lowest Energy" value="15" unit="/100" color={C.rose} delta="Limbo W42" dir="down" />
      </div>

      {/* View Toggle */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        <button onClick={function () { setView("timeline"); }} style={{ padding: "6px 14px", borderRadius: 16, border: "1px solid " + (view === "timeline" ? C.orange : "#e2e6ef"), background: view === "timeline" ? C.orange + "12" : "#fff", color: view === "timeline" ? C.orange : "#8891a8", fontSize: 11, fontWeight: view === "timeline" ? 700 : 500, cursor: "pointer" }}>📋 Timeline View</button>
        <button onClick={function () { setView("map"); }} style={{ padding: "6px 14px", borderRadius: 16, border: "1px solid " + (view === "map" ? C.orange : "#e2e6ef"), background: view === "map" ? C.orange + "12" : "#fff", color: view === "map" ? C.orange : "#8891a8", fontSize: 11, fontWeight: view === "map" ? 700 : 500, cursor: "pointer" }}>🗺 Journey Map</button>
      </div>

      {view === "map" && <JourneyMap />}

      {view === "timeline" && <div>

      {/* Chart */}
      <div style={{ marginBottom: 16 }}>
        <EmotionalChart compact={false} />
      </div>

      {/* Timeline */}
      {JOURNEY.map(function (stage, i) {
        return (
          <StageCard
            key={stage.id}
            stage={stage}
            open={expanded === i}
            onToggle={function () { setExpanded(expanded === i ? -1 : i); }}
          />
        );
      })}

      {/* Impact table */}
      <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 10, padding: 14, marginTop: 14 }}>
        <div style={{ fontSize: 9, color: "#8891a8", textTransform: "uppercase", letterSpacing: 1, fontFamily: "monospace", marginBottom: 8 }}>Intervention Impact Matrix</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e2e6ef" }}>
              {["#", "Intervention", "Stage", "Impact", "Metric", "From", "To", "Δ"].map(function (h) {
                return <th key={h} style={{ padding: "5px 6px", textAlign: "left", color: "#8891a8", fontSize: 8, textTransform: "uppercase", fontFamily: "monospace" }}>{h}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {IMPACT.slice(0, 10).map(function (r, i) {
              var rc = r.imp === "CRITICAL" ? C.red : r.imp === "HIGH" ? C.amber : C.emerald;
              return (
                <tr key={i} style={{ borderBottom: "1px solid #e2e6ef33", background: i < 3 ? C.emerald + "06" : "transparent" }}>
                  <td style={{ padding: "5px 6px", fontFamily: "monospace", color: i < 3 ? C.emerald : "#8891a8", fontWeight: 700 }}>{i + 1}</td>
                  <td style={{ padding: "5px 6px", color: "#1a1d2e", fontWeight: 600 }}>{r.label}</td>
                  <td style={{ padding: "5px 6px" }}>
                    <span style={{ padding: "1px 5px", borderRadius: 3, fontSize: 8, fontWeight: 600, background: r.stage === "THE LIMBO" ? C.red + "12" : C.indigo + "12", color: r.stage === "THE LIMBO" ? C.red : C.indigo }}>{r.stage}</span>
                  </td>
                  <td style={{ padding: "5px 6px" }}>
                    <span style={{ fontSize: 8, fontWeight: 800, padding: "1px 5px", borderRadius: 3, background: rc + "12", color: rc, fontFamily: "monospace" }}>{r.imp}</span>
                  </td>
                  <td style={{ padding: "5px 6px", color: "#4a5068" }}>{r.metric}</td>
                  <td style={{ padding: "5px 6px", color: "#8891a8", fontFamily: "monospace" }}>{r.from}</td>
                  <td style={{ padding: "5px 6px", color: C.emerald, fontFamily: "monospace", fontWeight: 600 }}>{r.to}</td>
                  <td style={{ padding: "5px 6px", color: C.emerald, fontFamily: "monospace", fontWeight: 800 }}>{r.delta}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </div>}
    </div>
  );
}

// ── Main ──
// ── Layer 7: Patient Personas ──
function L7() {
  const [sel, setSel] = useState(null);
  var active = sel !== null ? PERSONAS[sel] : null;

  return (
    <div>
      {/* Overview Strip */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {PERSONAS.map(function (p, i) {
          var isActive = sel === i;
          return (
            <button key={p.id} onClick={function () { setSel(isActive ? null : i); }} style={{
              flex: 1, padding: "12px 8px", borderRadius: 10, cursor: "pointer", transition: "all 0.15s",
              border: "2px solid " + (isActive ? p.color : "#e2e6ef"),
              background: isActive ? p.color + "10" : "#fff",
            }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{p.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? p.color : "#1a1d2e" }}>{p.label}</div>
              <div style={{ fontSize: 10, color: "#8891a8" }}>{p.name}, {p.age}</div>
              <div style={{ marginTop: 6, fontSize: 18, fontWeight: 800, fontFamily: "monospace", color: p.color }}>{p.pctPool}%</div>
              <div style={{ fontSize: 8, color: "#8891a8" }}>of patient pool</div>
            </button>
          );
        })}
      </div>

      {/* Aggregate Demographics Bar */}
      <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 10, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 9, color: "#8891a8", textTransform: "uppercase", letterSpacing: 1, fontFamily: "monospace", marginBottom: 10 }}>Population Composition — Metastatic Melanoma 2L Addressable Pool</div>
        <div style={{ display: "flex", height: 28, borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
          {PERSONAS.map(function (p, i) {
            return (
              <div key={i} onClick={function () { setSel(sel === i ? null : i); }} style={{
                width: p.pctPool + "%", background: p.color + (sel === i ? "cc" : "88"),
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 9, color: "#fff", fontWeight: 700, fontFamily: "monospace" }}>{p.pctPool}%</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          {PERSONAS.map(function (p) {
            return <span key={p.id} style={{ fontSize: 10, color: p.color }}><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: p.color, marginRight: 4 }}></span>{p.label}</span>;
          })}
        </div>
        <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
          {[
            { label: "Median Age", value: "63", sub: "range 28-82" },
            { label: "Male", value: "67%", sub: "except 75+ cohort" },
            { label: "White", value: "88%", sub: "rising minority dx" },
            { label: "Medicare", value: "52%", sub: "FFS + Advantage" },
            { label: "Rural/Suburban", value: "44%", sub: ">45 min to NCI" },
          ].map(function (kpi) {
            return (
              <div key={kpi.label} style={{ textAlign: "center", padding: "6px 4px", background: "#f8f9fc", borderRadius: 6 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1d2e", fontFamily: "monospace" }}>{kpi.value}</div>
                <div style={{ fontSize: 9, fontWeight: 600, color: "#4a5068" }}>{kpi.label}</div>
                <div style={{ fontSize: 8, color: "#8891a8" }}>{kpi.sub}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Persona Detail */}
      {active ? (
        <div style={{ background: "#fff", border: "2px solid " + active.color + "44", borderRadius: 10, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ fontSize: 32 }}>{active.icon}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: active.color }}>{active.label}</div>
              <div style={{ fontSize: 11, color: "#4a5068" }}>"{active.name}", Age {active.age} · {active.pctPool}% of patient pool (~{Math.round(14280 * active.pctPool / 100).toLocaleString()} patients/yr)</div>
            </div>
          </div>

          {/* Three column: Demo, Socio, Psycho */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
            {[
              { title: "📊 Demographics", data: active.demo, color: C.indigo },
              { title: "🏘 Socioeconomics", data: active.socio, color: C.amber },
              { title: "🧠 Psychographics", data: active.psycho, color: C.violet },
            ].map(function (col) {
              return (
                <div key={col.title} style={{ padding: 12, borderRadius: 8, background: col.color + "06", border: "1px solid " + col.color + "15" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: col.color, marginBottom: 8, fontFamily: "monospace" }}>{col.title}</div>
                  {Object.entries(col.data).map(function (entry) {
                    var key = entry[0];
                    var val = entry[1];
                    var label = key.replace(/([A-Z])/g, " $1").replace(/^./, function (s) { return s.toUpperCase(); });
                    return (
                      <div key={key} style={{ marginBottom: 6 }}>
                        <div style={{ fontSize: 8, fontWeight: 700, color: col.color, textTransform: "uppercase", fontFamily: "monospace", letterSpacing: 0.5 }}>{label}</div>
                        <div style={{ fontSize: 10, color: "#4a5068", lineHeight: 1.4 }}>{val}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Journey Impact + Intervention */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ padding: 12, borderRadius: 8, background: C.red + "06", border: "1px solid " + C.red + "15" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.red, marginBottom: 6, fontFamily: "monospace" }}>⚠ JOURNEY RISK PROFILE</div>
              <div style={{ fontSize: 11, color: "#4a5068", lineHeight: 1.5 }}>{active.journey}</div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: C.emerald + "06", border: "1px solid " + C.emerald + "15" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.emerald, marginBottom: 6, fontFamily: "monospace" }}>✦ PRIORITY INTERVENTIONS</div>
              <div style={{ fontSize: 11, color: "#4a5068", lineHeight: 1.5 }}>{active.intervention}</div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e2e6ef", borderRadius: 10, padding: 20, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#8891a8", marginBottom: 8 }}>↑ Select a persona above to explore detailed demographics, socioeconomics, psychographics, and journey risk profiles</div>
          <Insight text="Five personas capture 100% of the metastatic melanoma 2L addressable pool. The Sun-Belt Retiree (38%) and Underserved & Late-Diagnosed (14%) together account for 52% of the 'invisible 41%' who never receive 2L. Interventions must be persona-specific: phone-based navigation for Richard, culturally concordant CHWs for James, digital-first engagement for Melissa." color={C.orange} />
        </div>
      )}
    </div>
  );
}

var LAYERS = [
  { id: 0, label: "Executive", color: C.indigo },
  { id: 6, label: "Patient Journey", color: C.orange },
  { id: 7, label: "Patient Personas", color: C.rose },
  { id: 1, label: "Sequencing", color: C.violet },
  { id: 2, label: "Friction", color: C.amber },
  { id: 3, label: "Cost", color: C.red },
  { id: 4, label: "Prescribers", color: C.emerald },
  { id: 5, label: "Outcomes", color: C.cyan },
];

export default function App() {
  const [layer, setLayer] = useState(0);

  var content = null;
  if (layer === 0) content = <L0 />;
  else if (layer === 1) content = <L1 />;
  else if (layer === 2) content = <L2 />;
  else if (layer === 3) content = <L3 />;
  else if (layer === 4) content = <L4 />;
  else if (layer === 5) content = <L5 />;
  else if (layer === 7) content = <L7 />;
  else content = <L6 />;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fc", color: "#1a1d2e", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #e2e6ef", background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>M</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>MELANOMA 2L RWD ATLAS</div>
              <div style={{ fontSize: 10, color: "#8891a8" }}>From Progression to Intervention — Strategic Decision Engine</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 9, color: "#8891a8", fontFamily: "monospace" }}>Q4 2025</span>
            <span style={{ padding: "2px 7px", borderRadius: 8, background: C.emerald + "12", border: "1px solid " + C.emerald + "44", fontSize: 9, color: C.emerald, fontWeight: 600 }}>HIPAA</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", gap: 0, padding: "0 20px", borderBottom: "1px solid #e2e6ef", background: "#fff", overflowX: "auto" }}>
        {LAYERS.map(function (l, idx) {
          return (
            <button
              key={l.id}
              onClick={function () { setLayer(l.id); }}
              style={{
                padding: "9px 14px", border: "none",
                borderBottom: "2px solid " + (layer === l.id ? l.color : "transparent"),
                background: layer === l.id ? l.color + "08" : "transparent",
                color: layer === l.id ? l.color : "#8891a8",
                fontSize: 11, fontWeight: layer === l.id ? 700 : 500,
                cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              L{idx}: {l.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ padding: "18px 20px", maxWidth: 1060, margin: "0 auto" }}>{content}</div>

      {/* Footer */}
      <div style={{ padding: "10px 20px", borderTop: "1px solid #e2e6ef", background: "#fff", fontSize: 9, color: "#8891a8" }}>
        Claims+EHR 2019-2025 | N=14,280 | Social listening: JMIR Cancer, BMC Cancer, PMC, Reddit NLP, EMJ, MIA
      </div>
    </div>
  );
}
