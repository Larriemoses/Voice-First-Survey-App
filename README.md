# 🎙️ Voice Survey Platform

<p align="center">
  <b>Talk. Don’t Type.</b><br/>
  A voice-first survey platform for collecting rich, expressive human responses.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-MVP-blue" />
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933" />
  <img src="https://img.shields.io/badge/Database-Supabase-3ECF8E" />
  <img src="https://img.shields.io/badge/Storage-Audio%20Files-orange" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## 🚀 Overview

Traditional surveys are broken.

They:

* limit expression
* reduce engagement
* produce shallow data

This platform transforms surveys into **voice-driven experiences**, allowing users to respond naturally through speech.

> 🎯 More expression
> ⚡ Faster completion
> 🧠 Richer insights

---

## 🧠 Core Idea

```text
One question → One voice response → Real human insight
```

* No typing friction
* No long forms
* Just natural conversation

---

## 🏗️ System Architecture

```text
Client (React + TS)
   ↓
Backend API (Node + Express)
   ↓
Supabase
 ├── PostgreSQL (structured data)
 ├── Storage (audio files)
 └── Auth (users & organizations)
```

---

## 🛠️ Tech Stack

### 🎨 Frontend

```yaml
Framework: React (Vite)
Language: TypeScript
Styling: Tailwind CSS
Routing: React Router
Client SDK: Supabase JS
```

### ⚙️ Backend

```yaml
Runtime: Node.js
Framework: Express.js
Language: TypeScript
File Handling: Multer
Environment: dotenv
```

### 🧱 Infrastructure

```yaml
Database: Supabase (PostgreSQL)
Storage: Supabase Storage (Audio files)
Auth: Supabase Auth
Hosting (Planned): Vercel + Render
```

---

## 📁 Project Structure

```bash
voice-survey-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│
├── server/                 # Node backend
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── lib/
│   │   ├── config/
│   │   └── utils/
│
├── supabase/               # Database & policies
│   ├── schema.sql
│   ├── policies.sql
│   └── seed.sql
```

---

## 🔐 Core Features

### 🎤 Voice Experience

* Record audio per question
* Replay & re-record
* One-question-at-a-time flow
* Mobile-first UX

### 🏢 Organization System

* Company registration
* Multi-tenant architecture
* Role-based access

### 📊 Data Handling

* Audio stored in Supabase Storage
* Metadata stored in PostgreSQL
* Secure access via RLS

---

## ⚙️ Local Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/voice-survey-app.git
cd voice-survey-app
```

---

### 2️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

Create `.env`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

---

### 3️⃣ Backend Setup

```bash
cd server
npm install
npm run dev
```

Create `.env`:

```env
PORT=4000
SUPABASE_URL=
SUPABASE_SECRET_KEY=
```

---

### 4️⃣ Supabase Setup

* Create project on Supabase
* Run SQL files:

```sql
schema.sql
policies.sql
```

---

### 5️⃣ Storage Setup

Create bucket:

```text
voice-surveys
```

Set it to:

```text
private
```

---

## 🔄 Data Flow

```text
User records voice
 → Frontend sends audio
 → Backend validates
 → Upload to Supabase Storage
 → Save metadata in DB
 → Dashboard retrieves responses
```

---

## 🔐 Security Model

* Row Level Security (RLS)
* Auth-based access control
* Private storage buckets
* Backend-controlled uploads

---

## 🛣️ Roadmap

### 🟢 MVP (Current)

* Voice survey flow
* Organization accounts
* Audio storage
* Response tracking

### 🟡 Phase 2

* Speech-to-text
* Dashboard analytics
* Export (CSV / ZIP)

### 🔵 Phase 3

* Google Drive integration
* AI summarization
* Sentiment analysis

---

## 💡 Use Cases

* Market research
* Customer feedback
* NGO field data collection
* Church engagement
* User research at scale

---

## 🧪 Development Scripts

### Frontend

```bash
npm run dev
npm run build
```

### Backend

```bash
npm run dev
npm run build
npm start
```

---

## 🧑‍💻 Developer Skills Demonstrated

```yaml
Frontend Engineering:
  - React + TypeScript
  - Component architecture
  - UX design (mobile-first)

Backend Engineering:
  - REST API design
  - File upload handling
  - Service-layer architecture

Database Design:
  - Relational modeling
  - Multi-tenant systems
  - Row Level Security

Cloud Integration:
  - Supabase
  - Storage systems
  - Auth flows

System Design:
  - Scalable architecture
  - Separation of concerns
  - API-driven design
```

---

## 🤝 Contributing

```bash
1. Fork repo
2. Create branch
3. Commit changes
4. Open PR
```

---

## 📄 License

MIT License

---

## ✨ Vision

>  **A voice data infrastructure platform**
built for capturing human expression at scale.

---
