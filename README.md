# ⛏️ Coal Mine Statutory Compliance & Governance Monitoring System

[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B%20%7C%20v20%2B-green?logo=node.js)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-v18.3.1-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-v5.4-purple?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

An end-to-end, enterprise-grade digital governance platform built for the **Ministry of Coal** and **Directorate General of Mines Safety (DGMS)**, Government of India.

The platform provides centralized, real-time surveillance of statutory obligations under the **Mines Act 1952**, **Coal Mines Regulations (CMR) 2017**, and **CPCB Environmental Standards**, integrating geospatial GIS mapping, telemetry streams, and explainable AI risk intelligence.

---

## 📑 Table of Contents

- [Key Features & Modules](#-key-features--modules)
- [Role-Based Access Control (RBAC) & Test Accounts](#-role-based-access-control-rbac--test-accounts)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Quick Start Guide (Run Locally)](#-quick-start-guide-run-locally)
  - [Prerequisites](#prerequisites)
  - [Method 1: One-Click Startup (Recommended for Windows)](#method-1-one-click-startup-recommended-for-windows)
  - [Method 2: Manual Step-by-Step Setup](#method-2-manual-step-by-step-setup)
- [Project Directory Structure](#-project-directory-structure)
- [API Documentation & Swagger](#-api-documentation--swagger)
- [Statutory Frameworks Monitored](#-statutory-frameworks-monitored)
- [License](#-license)

---

## 🌟 Key Features & Modules

### 1. 🏛️ National Multi-Tier Executive Dashboard
- Live statutory KPI metrics across 12 high-capacity Indian coal collieries (Jharia, Raniganj, Korba, Talcher, Singrauli, etc.).
- Dynamic compliance scorecards, critical violation count, overdue CAPA remediation rates, and clearance expiry counters.
- Visual breakdown by severity, statutory regulation category, and 12-month compliance trends.

### 2. 🗺️ Interactive National GIS Coalfields Map
- Geospatial mapping powered by **Leaflet.js** with coordinates across Indian coalfields.
- Dynamic color-coded hazard pins based on real-time statutory risk:
  - 🟢 **Low Risk (Compliant)**
  - 🟡 **Medium Risk**
  - 🟠 **High Risk**
  - 🔴 **Critical Statutory Risk**
- Detailed popup telemetry with 1-click drilldown into the colliery profile.

### 3. 📋 Statutory Compliance Obligations Registry
- Tracks 60+ pre-seeded statutory rules mapped directly to CMR 2017 and Mines Act 1952 clauses.
- Filter obligations by colliery, regulatory authority (DGMS, CPCB, MoEFCC), frequency, and risk severity.
- Proof submission and verification workflows.

### 4. 🔍 DGMS Safety Inspections & Audit Engine
- Schedule and conduct Routine, Surprise, Environmental, and Ventilation Audits.
- Checklist findings logger with auto-escalation: severe non-compliance findings automatically generate formal statutory violation notices.
- Official inspector score calculation and digital certification.

### 5. ⚠️ Violations & CAPA (Corrective Actions) Tracker
- Comprehensive violation lifecycle: `OPEN` → `IN_PROGRESS` → `ACTION_SUBMITTED` → `RESOLVED` → `CLOSED`.
- Assign specific engineering CAPA milestones to mine managers and contractors.
- Real-time remediation progress slider (0% to 100%) and formal DGMS site inspection sign-off.

### 6. 🗄️ Statutory Document Vault & Clearance Repository
- Centralized index of Environmental Clearances (EC), Consent to Operate (CTO), Approved Mining Plans, and Safety Committee records.
- Automatic alerts for clearances expiring within 30 or 90 days.

### 7. 🫁 Underground Safety & Gas Telemetry
- Continuous monitoring of inflammable Methane ($CH_4$) gas (% volume) and toxic Carbon Monoxide ($CO$) in parts-per-million (ppm).
- Shift-wise PPE compliance rates and zero-harm lost-time incident tracking.

### 8. 🌿 CPCB Environmental Surveillance
- Real-time ambient air quality surveillance for $PM_{10}$ and $PM_{2.5}$ against National Ambient Air Quality Standards (NAAQS).
- Mine drainage effluent water quality tracking: $pH$ (standard 6.5–8.5), Total Dissolved Solids (TDS), and Chemical Oxygen Demand (COD).
- Overburden (OB) dump slope stability status and tension crack detection.

### 9. 🤖 Explainable AI Statutory Risk Intelligence
- Predictive machine learning risk score (0 to 100) and risk level assignment.
- Human-in-the-loop governance: DGMS inspectors and executives can review, accept, or override AI recommendations with auditable justification.

### 10. 📄 Official Form IV / Form V Statutory Return Generator
- Automated generation of the official **Mines Act 1952 Form IV Annual Return**.
- Instant 1-click browser printing and CSV ledger exports.

### 11. 🛡️ Immutable Audit Ledger
- Cryptographically timestamped audit trail recording all user logins, compliance updates, audit completions, and violation closures.

---

## 👥 Role-Based Access Control (RBAC) & Test Accounts

The platform uses genuine **JWT authentication with bcrypt password hashing**. Each role has tailored dashboard views, restricted navigation menus, and scoped data access:

| Role | Registered Email | Universal Password | Jurisdiction & Access Scope |
|---|---|---|---|
| **Super Admin** | `admin@coal.gov.in` | `CoalGov@2026` | Full central ministry governance, user management, and audit trail |
| **Safety Inspector** | `inspector@dgms.gov.in` | `CoalGov@2026` | DGMS safety audits, violation notices, CAPA sign-off & verification |
| **HQ Management** | `hq@coal.gov.in` | `CoalGov@2026` | Strategic executive analytics, cross-colliery benchmarking & AI risk |
| **Mine Manager** | `manager@mine.gov.in` | `CoalGov@2026` | Jharia Colliery operations, CAPA execution, safety & telemetry logging |
| **Compliance Officer** | `compliance@mine.gov.in` | `CoalGov@2026` | Statutory returns (Form IV), document vault clearances, CPCB data |
| **Mining Contractor** | `contractor@partner.com` | `CoalGov@2026` | Assigned engineering CAPA tasks, progress slider & machinery safety |

---

## 🏗️ System Architecture

```
                                  +-------------------------------------------------------+
                                  |              User Browser / Evaluator UI              |
                                  +-------------------------------------------------------+
                                                              |
                                                    HTTP / HTTPS (Vite Dev Server)
                                                    Proxy: /api -> localhost:5000
                                                              |
                                                              v
+-------------------------------------------------------------------------------------------------------------------------+
|                                              FRONTEND APPLICATION (Port 5173)                                           |
|  - React 18 SPA + TypeScript + Vite + TailwindCSS                                                                       |
|  - AuthContext (JWT Bearer Interceptor & LocalStorage Persistence)                                                      |
|  - RoleRoute Guards (18 Protected Statutory Modules)                                                                   |
|  - Data Visualizations (Recharts) & Geospatial GIS (Leaflet.js)                                                        |
+-------------------------------------------------------------------------------------------------------------------------+
                                                              |
                                                    REST API (Bearer JWT Auth)
                                                              |
                                                              v
+-------------------------------------------------------------------------------------------------------------------------+
|                                               BACKEND REST API (Port 5000)                                             |
|  - Express.js + TypeScript (Node ESM runtime via tsx)                                                                   |
|  - Security: JWT Authentication & Role-Based Access Control (RBAC Middleware)                                           |
|  - Controllers: Auth, Mines, Compliance, Inspections, Violations, CAPA, Safety, Environment, AI, Reports, Audit         |
|  - File Uploads: Multer with disk storage for statutory clearance PDFs                                                  |
|  - Persistent Datastore: JSON File ACID Store (`backend/data/coal_governance_db.json`)                                    |
|  - API Docs: Swagger / OpenAPI 3.0 UI (`/api/docs`)                                                                    |
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 💻 Technology Stack

### Frontend
- **Framework**: React 18.3.1 (TypeScript)
- **Build Tool**: Vite 5.4
- **Styling**: TailwindCSS 3.4
- **Icons**: Lucide React
- **Charts & Graphs**: Recharts 2.15
- **GIS Mapping**: Leaflet 1.9 & React-Leaflet 4.2
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with JWT request/response interceptors

### Backend
- **Runtime**: Node.js v18+ / v20+ / v22+
- **Server Framework**: Express 4.19 (TypeScript)
- **Execution Engine**: `tsx` (TypeScript Execute & Watch)
- **Authentication**: JWT (`jsonwebtoken`) + Password Hashing (`bcryptjs`)
- **File Management**: Multer
- **API Documentation**: Swagger UI Express + OpenAPI Spec
- **Database**: Persistent JSON Store with pre-seeded data

---

## 🚀 Quick Start Guide (Run Locally)

### Prerequisites
Make sure you have **Node.js** (v18.0.0 or higher) and **npm** installed on your system:
```bash
node -v
npm -v
```

---

### Method 1: One-Click Startup (Recommended for Windows)

In the root folder, double-click **`start-all.bat`**  
*(or run `./start-all.ps1` in PowerShell)*.

This will automatically start both the **Backend API Server (Port 5000)** and **Frontend UI (Port 5173)** simultaneously.

Then open your browser:
👉 **[http://localhost:5173](http://localhost:5173)**

---

### Method 2: Manual Step-by-Step Setup

#### Step 1: Clone the Repository
```bash
git clone https://github.com/Tirthchavda/coal-mine-compliance-system.git
cd coal-mine-compliance-system
```

#### Step 2: Start the Backend Server
Open a terminal in the root directory:
```bash
cd backend
npm install
npm run dev
```
*The backend will start at `http://localhost:5000` with pre-seeded database records.*

#### Step 3: Start the Frontend Application
Open a **second terminal** in the root directory:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will start at `http://localhost:5173`.*

#### Step 4: Open in Browser & Sign In
Navigate to: **[http://localhost:5173](http://localhost:5173)**

Log in using any demo account, for example:
- **Email**: `manager@mine.gov.in`
- **Password**: `CoalGov@2026`

---

## 📁 Project Directory Structure

```
coal-mine-compliance-system/
├── backend/
│   ├── data/
│   │   └── coal_governance_db.json     # Persistent database file
│   ├── src/
│   │   ├── controllers/                # 15 Express controllers (Auth, Mines, Inspections, etc.)
│   │   ├── db/                         # Seed data generator & ACID data store
│   │   ├── middleware/                 # JWT Auth, RBAC, Audit logger, Error handler
│   │   ├── routes/                     # REST API route definitions
│   │   ├── types/                      # TypeScript definitions & data models
│   │   ├── utils/                      # ESM-safe JWT & Bcrypt utilities
│   │   ├── server.ts                   # Main Express application entry point
│   │   └── swagger.ts                  # OpenAPI / Swagger configuration
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/client.ts               # Axios client with JWT auto-injection
│   │   ├── components/                 # Reusable UI (Sidebar, Header, DataTable, StatCard, etc.)
│   │   ├── context/AuthContext.tsx     # React authentication & role-based context
│   │   ├── layouts/DashboardLayout.tsx # Main dashboard layout wrapper
│   │   ├── pages/                      # 18 Full Page Components:
│   │   │   ├── Login.tsx               # Official Ministry login portal
│   │   │   ├── Dashboard.tsx           # Multi-tier analytics dashboard
│   │   │   ├── Mines.tsx               # Coal mines directory
│   │   │   ├── MineProfile.tsx         # Detailed colliery profile & telemetry
│   │   │   ├── MineMap.tsx             # Interactive GIS national map
│   │   │   ├── Compliance.tsx          # Statutory obligations registry
│   │   │   ├── ComplianceDetail.tsx    # Single obligation view & escalation
│   │   │   ├── Inspections.tsx         # DGMS audit scheduler & findings logger
│   │   │   ├── Violations.tsx          # Formal statutory notices tracker
│   │   │   ├── CorrectiveActions.tsx   # CAPA milestones & progress slider
│   │   │   ├── Documents.tsx           # EC, CTO & clearance vault
│   │   │   ├── Safety.tsx              # CH4/CO gas & PPE adherence telemetry
│   │   │   ├── Environment.tsx         # PM10/PM2.5, pH & OB dump stability
│   │   │   ├── AIGovernance.tsx        # Explainable AI risk diagnostics
│   │   │   ├── Analytics.tsx           # Multi-colliery benchmarking
│   │   │   ├── Reports.tsx             # Form IV printable return & CSV export
│   │   │   ├── Users.tsx               # RBAC user management directory
│   │   │   └── AuditLogs.tsx           # Immutable security audit trail
│   │   ├── router/AppRouter.tsx        # Role-guarded route configuration
│   │   ├── types/index.ts              # Frontend TypeScript interfaces
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css                   # Tailwind styles & Leaflet CSS
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── package.json                        # Root npm script runner
├── start-all.bat                       # 1-Click launcher for Windows
├── start-all.ps1                       # 1-Click PowerShell launcher
├── .gitignore
└── README.md
```

---

## 📖 API Documentation & Swagger

When the backend is running, you can explore and test the complete REST API via Swagger UI:
- **Swagger UI**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Summary of REST Endpoints:
- `POST /api/auth/login` - Authenticate official credentials & receive signed JWT
- `GET /api/auth/me` - Fetch authenticated user profile and permissions
- `POST /api/auth/logout` - Secure logout and audit ledger entry
- `GET /api/mines` - Retrieve all registered collieries with filters
- `GET /api/mines/:id` - Detailed colliery profile with linked records
- `GET /api/compliance` - List statutory compliance obligations
- `GET /api/inspections` - List safety inspections and checklists
- `POST /api/inspections/:id/findings` - Log audit checklist observation
- `GET /api/violations` - Fetch statutory violation notices
- `GET /api/actions` - Retrieve CAPA remediation milestones
- `PUT /api/actions/:id` - Update remediation progress percentage (0–100%)
- `PUT /api/actions/:id/verify` - DGMS inspector physical verification and closure
- `GET /api/documents` - Vaulted clearances with expiration dates
- `GET /api/safety` - Underground gas readings ($CH_4$, $CO$) & PPE data
- `GET /api/environment` - Ambient air ($PM_{10}$, $PM_{2.5}$) and effluent ($pH$) readings
- `GET /api/ai/dashboard` - AI statutory risk intelligence & predictions
- `GET /api/reports/form-iv/:mineId` - Generate official Form IV statutory return
- `GET /api/audit-logs` - Immutable system audit logs *(Admin only)*

---

## ⚖️ Statutory Frameworks Monitored

1. **Mines Act, 1952** (Sections 16, 19, 22A, 23, 48)
2. **Coal Mines Regulations (CMR), 2017**:
   - *Reg 104*: Strata control and systematic support rules (SSPR)
   - *Reg 129*: Ventilation standards and inflammable gas monitoring
   - *Reg 133*: Flammable gas ($CH_4$) limits (< 0.75% in return airway)
   - *Reg 146*: Underground dust suppression and water spraying
   - *Reg 160*: Heavy Earth Moving Machinery (HEMM) safety interlocks
   - *Reg 214*: Safety Committee formation and bi-monthly meetings
3. **CPCB & MoEFCC Environmental Standards**:
   - National Ambient Air Quality Standards (NAAQS) for $PM_{10}$ and $PM_{2.5}$
   - General Effluent Standards for Mine Drainage ($pH$ 6.5–8.5, $TDS < 2100\text{ mg/L}$)
   - Overburden dump slope stability and green belt development

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

**Developed for the Smart India Hackathon & National Coal Governance Initiative © 2026**

