# RBSK Field Surveyor

> **Digital Intervention Hub** for India's Rashtriya Bal Swasthya Karyakram (RBSK) — the national child-health screening programme covering the **4 Ds**: Defects at birth, Diseases, Deficiencies, and Developmental delays.

A mobile-first Progressive Web App that lets field surveyors conduct standardised RBSK screenings, auto-generate DEIC case sheets, track follow-ups, and view program analytics — all from a single interface that works **offline**.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **5-Step Survey** | Age-adaptive screening form with auto-calculated clinical red flags |
| **Age-Specific Protocols** | Two protocol sets: 0–6 years and 6–18 years, auto-selected by DOB |
| **DEIC Case Sheet** | Comprehensive digital case sheet with multi-section clinical assessment |
| **Auto-Create DEIC Cases** | Submitting a survey automatically creates a linked DEIC case entry |
| **Follow-up Tracker** | Search, filter, and manage DEIC cases by status, district, or name |
| **Analytics Dashboard** | Stat cards, status distribution, top flagged conditions, district breakdown |
| **PDF Export** | Download professional survey and DEIC reports as PDF |
| **Draft Auto-Save** | Forms auto-save to localStorage; prompts restore on return |
| **Firebase Auth** | Email/password and Google Sign-In; all data gated behind authentication |
| **Offline / PWA** | Firestore IndexedDB persistence + installable as a mobile app |
| **Record Retrieval** | Look up previously submitted surveys by Survey ID or child name |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router 7, Vite 6 |
| Styling | Tailwind CSS 3 + custom CSS |
| Icons | Lucide React |
| Backend | Firebase (Firestore, Authentication, Hosting, Analytics) |
| PDF | jsPDF + jspdf-autotable |
| Testing | Vitest + Testing Library |
| Language | JavaScript (TypeScript-ready with `tsconfig.json`) |

---

## 📁 Project Structure

```
src/
├── main.jsx                  # App entry point
├── App.jsx                   # Auth gating + routing shell
├── firebase.js               # Firebase init + offline persistence
│
├── components/               # Shared UI components
│   ├── LoginPage.jsx         # Auth login / signup
│   ├── Navbar.jsx            # Route-aware top navigation
│   ├── Toast.jsx             # Notification toasts
│   ├── ConfirmDialog.jsx     # Confirmation modals
│   └── QuestionRow.jsx       # Survey question toggle
│
├── pages/                    # Route-level page components
│   ├── SurveyPage.jsx        # 5-step RBSK survey form
│   ├── FollowUpPage.jsx      # DEIC follow-up management
│   ├── DashboardPage.jsx     # Analytics dashboard
│   └── ReviewPage.jsx        # Record retrieval
│
├── contexts/                 # React Context providers
│   ├── AuthContext.jsx        # Firebase auth state
│   └── AppContext.jsx         # Toast & confirm dialog state
│
├── hooks/
│   └── useFormData.js         # Form state, drafts, age calc, red flags
│
├── utils/
│   ├── helpers.js             # ID generation, sanitize, flag constants
│   ├── pdfExport.js           # PDF generation for surveys & DEIC
│   └── printReport.js         # Browser print formatting
│
├── DEICCaseSheet.jsx          # Full DEIC digital case sheet
├── DEICFollowUp.jsx           # Follow-up panel with search/filter
├── DEICReferralSummary.jsx    # Post-survey referral summary
├── ReviewMode.jsx             # Historical survey lookup
├── deicData.js                # DEIC section/field definitions
├── screeningData_0_6.js       # Screening protocols (0–6 years)
└── screeningData_6_18.js      # Screening protocols (6–18 years)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- A **Firebase project** with Firestore and Authentication enabled

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd rbsk-surveyor-edit

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your Firebase config values
```

#### `.env` format

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXX
```

### Firebase Console Setup

1. Go to **Firebase Console → Authentication → Sign-in method**
2. Enable **Email/Password** provider
3. Enable **Google** provider (set support email)
4. Deploy Firestore security rules: `npx firebase deploy --only firestore:rules`

### Run

```bash
npm run dev        # Development server → http://localhost:3000
npm run build      # Production build → build/
npm run preview    # Preview production build locally
npm run test       # Run test suite
npm run test:watch # Run tests in watch mode
```

### Deploy

```bash
npm run build
npx firebase deploy --only hosting
```

---

## 🔒 Security

- **API keys** are stored in `.env` (gitignored) and accessed via `import.meta.env`
- **Firestore rules** enforce `request.auth != null` on all collections
- **Firebase Auth** gates the entire app — unauthenticated users see only the login page
- Input is sanitized via the `sanitize()` utility to prevent XSS

---

## 📊 Firestore Data Model

```
surveys/{surveyId}
  ├── childName, dob, ageDisplay, sex, district, category
  ├── [clinical fields]: abnormalityAtBirth, anemia, vitA, ...
  ├── redFlagsCount, deicId
  └── submittedAt (server timestamp)

deic_cases/{deicId}
  ├── deicId, rbsk_surveyId (bidirectional link)
  ├── deic_childName, deic_dob, deic_age, deic_sex, deic_district
  ├── sum_outcome, sum_primaryDx, sum_nextReview
  ├── flaggedFields[], redFlagsCount
  ├── submittedAt (server timestamp)
  └── followup_notes/{noteId}  (subcollection)
```

---

## 📱 PWA / Offline

The app works offline via:
- **Firestore IndexedDB persistence** — cached data is available without network
- **Web App Manifest** — installable on mobile home screens
- **Service-ready** — can add a Workbox service worker for full asset caching

---

## 🧪 Testing

```bash
npm run test       # Run all tests once
npm run test:watch # Watch mode
```

Tests use **Vitest** + **Testing Library** with jsdom environment.

---

## 📄 License

This project is private and not licensed for redistribution.
