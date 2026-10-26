# Attendance System

A modern full-stack student attendance management and notification system with WhatsApp alerts, built with React, Node.js, Express, and Supabase.

---

## 🚀 Features

- **Teacher & Student Dashboards**: Real-time attendance tracking and overview for classes and batches.
- **WhatsApp Notifications**: Automatic attendance updates and alerts sent to parents/guardians using `whatsapp-web.js`.
- **Database & Auth**: Powered by Supabase for secure data storage and role-based access.
- **Data Import Tools**: Utility scripts to easily import students, batches, and guardian contacts.
- **Modern UI**: Fast, responsive frontend powered by React and Vite.

---

## 📁 Project Structure

```text
├── backend/
│   ├── index.js               # Express server & WhatsApp client
│   ├── import-data.js         # Student data importer
│   ├── import-guardians.js    # Guardian details importer
│   ├── supabase-schema.sql    # Database schema
│   ├── supabase-reset.sql     # Database reset script
│   └── test/                  # Test scripts
├── frontend/
│   ├── src/
│   │   ├── views/             # Teacher and Student views
│   │   ├── store/             # Zustand state management
│   │   └── api.js             # API client
│   └── vite.config.js
└── render.yaml                # Deployment configuration
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Set your VITE_API_URL and Supabase credentials in .env
npm run dev
```

---

## 📄 License
ISC
