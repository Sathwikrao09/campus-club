# 🎓 Campus Club Event Management System
### Built with MongoDB · Express · React · Node.js

A full-stack MERN application for managing campus club events with role-based access control for Students, Club Admins, and Super Admins.

---

## 📁 Project Structure

```
campus-events/
├── backend/                 # Express + MongoDB API
│   ├── config/db.js         # MongoDB connection
│   ├── middleware/auth.js   # JWT auth + role guard
│   ├── models/
│   │   ├── User.js          # User schema (student/clubadmin/superadmin)
│   │   └── Event.js         # Event schema with status workflow
│   ├── routes/
│   │   ├── auth.js          # Register, login, /me
│   │   └── events.js        # Full CRUD + approve/reject
│   ├── seed.js              # Seed demo users & events
│   ├── server.js            # Entry point
│   └── .env.example         # Environment variables template
│
└── frontend/                # React app
    └── src/
        ├── context/AuthContext.js   # Global auth state
        ├── utils/api.js             # Axios with JWT interceptor
        ├── components/
        │   ├── Layout.js            # Sidebar + route wrapper
        │   ├── EventCard.js         # Reusable event card
        │   └── EventModal.js        # Event detail modal
        └── pages/
            ├── LoginPage.js
            ├── RegisterPage.js
            ├── DashboardPage.js     # Stats + approved events
            ├── CalendarPage.js      # Monthly calendar view
            ├── AllEventsPage.js     # Tabbed full events list
            ├── SubmitEventPage.js   # Event submission form
            └── ReviewPage.js        # Admin approval queue
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd backend
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env — set your MONGO_URI and JWT_SECRET

# Seed the database with demo data
node seed.js

# Start the server
npm run dev        # development (nodemon)
npm start          # production
```

Server runs at: `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

App runs at: `http://localhost:3000`

---

## 🔑 Demo Accounts (after seeding)

| Role        | Email                   | Password   |
|-------------|-------------------------|------------|
| Super Admin | admin@campus.edu        | admin123   |
| Club Admin  | rahul@campus.edu        | rahul123   |
| Club Admin  | priya@campus.edu        | priya123   |
| Student     | student@campus.edu      | student123 |

Or use the **Quick Login** buttons on the login page.

---

## 🌐 API Reference

### Auth
| Method | Endpoint            | Access | Description         |
|--------|---------------------|--------|---------------------|
| POST   | /api/auth/register  | Public | Create account      |
| POST   | /api/auth/login     | Public | Login, get JWT      |
| GET    | /api/auth/me        | Auth   | Get current user    |

### Events
| Method | Endpoint                    | Access               | Description                  |
|--------|-----------------------------|----------------------|------------------------------|
| GET    | /api/events/approved        | Auth (all roles)     | Approved events calendar     |
| GET    | /api/events                 | clubadmin/superadmin | All events (own or all)      |
| GET    | /api/events/:id             | Auth                 | Single event details         |
| POST   | /api/events                 | clubadmin/superadmin | Submit new event             |
| PUT    | /api/events/:id/approve     | superadmin only      | Approve event                |
| PUT    | /api/events/:id/reject      | superadmin only      | Reject event                 |
| PUT    | /api/events/:id             | owner/superadmin     | Edit event                   |
| DELETE | /api/events/:id             | owner/superadmin     | Delete event                 |

---

## 👥 Role Permissions

| Feature                   | Student | Club Admin | Super Admin |
|---------------------------|---------|------------|-------------|
| View approved events      | ✅      | ✅         | ✅          |
| View calendar             | ✅      | ✅         | ✅          |
| Submit new event          | ❌      | ✅         | ✅          |
| View own submissions      | ❌      | ✅         | ✅          |
| View all submissions      | ❌      | ❌         | ✅          |
| Approve / Reject events   | ❌      | ❌         | ✅          |
| Delete any event          | ❌      | ❌         | ✅          |

---

## 🗃️ Event Model

```js
{
  name:               String,   // required
  clubName:           String,   // required
  category:           Enum['Technical','Cultural','Sports','Academic','Social'],
  dateTime:           Date,     // required
  venue:              String,   // required
  description:        String,   // required
  expectedAttendees:  Number,
  status:             Enum['pending','approved','rejected'],  // default: pending
  submittedBy:        ObjectId → User,
  reviewedBy:         ObjectId → User,
  reviewNote:         String,
  reviewedAt:         Date,
  createdAt / updatedAt (timestamps)
}
```

---

## 🚀 Deploy to Production

### Backend (e.g. Render / Railway)
1. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL=https://your-frontend.com`
2. Build command: `npm install`
3. Start command: `npm start`

### Frontend (e.g. Vercel / Netlify)
1. Set `REACT_APP_API_URL=https://your-backend.com/api`
2. Build command: `npm run build`
3. Output directory: `build`

### MongoDB Atlas
Replace `MONGO_URI` in `.env` with your Atlas connection string:
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/campus-events
```
