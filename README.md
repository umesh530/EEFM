# ProcureAI

ProcureAI is an AI-based procurement decision support system for engineering projects. It combines supplier evaluation, project tracking, material analysis, deterministic scoring, risk assessment, and AI-assisted recommendations into a single enterprise-style dashboard.

## Overview

This project is designed for:
- procurement managers
- engineering project teams
- sourcing and supplier analysts
- decision makers who need explainable procurement intelligence

## Features

- JWT authentication and role-based access
- project, supplier, material, and procurement workflows
- deterministic weighted supplier scoring
- risk allocation and supplier ranking logic
- AI recommendation and chatbot grounded in real application context
- analytics dashboard with procurement totals and supplier insights
- procurement history and report generation flow
- seeded demo data for local testing

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- React Router
- Recharts
- Axios
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT + bcryptjs
- OpenAI SDK
- mongodb-memory-server fallback

## Project Structure

```bash
EEFM_miniproject/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── package.json
├── README.md
└── .gitignore
```

## Installation and Setup

From the project root:

```bash
npm install
```

This installs the workspace dependencies for both the backend and frontend.

## Run the App

### Start both services together

```bash
npm run dev
```

### Or run individually

```bash
npm run dev:backend
npm run dev:frontend
```

### Seed demo data

```bash
npm run seed
```

### Build frontend for production

```bash
npm run build
```

## Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
SEED_DATABASE=true
MONGO_URI=
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

For production, set `NODE_ENV=production`, provide a persistent `MONGO_URI`, use a random `JWT_SECRET` of at least 32 characters, and set `FRONTEND_URL` to the deployed frontend origin. The backend rejects production startup when `MONGO_URI`, `JWT_SECRET`, or `FRONTEND_URL` is missing, and it never runs the demo seed in production. `OPENAI_API_KEY` is required for AI recommendation and chatbot features.

In development, `SEED_DATABASE=true` (the default) preserves the demo-data initialization workflow. Set `SEED_DATABASE=false` when developing against an existing database that must not receive demo records.

Copy the safe templates in `backend/.env.example` and `frontend/.env.example` when creating local environment files. Do not commit `.env` files.

If `MONGO_URI` is empty in development, the application falls back to an in-memory MongoDB instance. This fallback is not suitable for production because its data is ephemeral.

## Demo Credentials

Admin:
- Email: admin@procureai.com
- Password: Admin@123

Procurement Manager:
- Email: manager@procureai.com
- Password: Manager@123

## Key API Endpoints

- `POST /api/auth/login` — authenticate a user
- `GET /api/auth/profile` — fetch the current user profile
- `GET /api/projects` — fetch projects
- `POST /api/projects` — create a project
- `GET /api/suppliers` — fetch suppliers
- `POST /api/suppliers` — add supplier
- `GET /api/materials` — fetch materials
- `POST /api/materials` — add material
- `GET /api/procurements` — fetch procurement records
- `POST /api/procurements` — create procurement requirement
- `POST /api/decisions/evaluate` — run supplier evaluation
- `GET /api/analytics` — fetch dashboard analytics
- `POST /api/ai/chat` — ask a procurement question

## AI Architecture

The app uses a deterministic scoring model as the source of truth and the AI layer as a contextual explanation engine. The system does not invent supplier or project data. It uses the fetched project, requirement, and supplier context to explain the recommendation.

## Supplier Scoring Formula

The weighted score is calculated from these normalized factors:
- cost score
- quality score
- delivery score
- reliability score
- risk score

The resulting model ranks suppliers by overall weighted value while keeping delivery and risk risk visible for final decision making.

## Risk Calculation

Risk is derived from factors such as supplier reliability, delivery performance, defect rate, and supplier status. The system classifies risk into low, medium, and high buckets so the same logic is used consistently across the dashboard and AI recommendation layers.

## Troubleshooting

### Port conflicts

If 5000 or 5173 is already in use, stop the previous Node process and restart the app.

### Login fails

Verify the backend is running and the demo credentials are correct:
- manager@procureai.com / Manager@123
- admin@procureai.com / Admin@123

### Chatbot gives weak answers

Ensure the backend is running and the relevant project/supplier/procurement data is present in MongoDB or its in-memory fallback instance.

### Seed data is not available

Run:

```bash
npm run seed
```

Then restart the backend if needed.

## Notes

The app is designed to work in a local development environment with a memory-backed MongoDB fallback, while still supporting a real MongoDB URI when configured in the backend `.env` file.
