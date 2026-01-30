# Athenor - Tutoring Management System 📚

<div align="center">

**A modern, full-featured tutoring management system built with React**

[![React](https://img.shields.io/badge/React-19.1-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-purple)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-teal)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

[🚀 Live Demo](#-live-demo) • [✨ Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [📋 Demo Credentials](#-demo-credentials)

</div>

---

## 🚀 Live Demo

**Demo Site:** [https://yourusername.github.io/athenor-project-demo/](https://yourusername.github.io/athenor-project-demo/)

> ⚠️ **Note:** This is a demo version designed for portfolio purposes. All data is simulated and stored locally in your browser. No backend server is required.

---

## 📋 Demo Credentials

Use these credentials to explore the application:

| Email | Password |
|-------|----------|
| `demo@athenor.com` | `demo123` |

---

## ✨ Features

### 🔐 Authentication System
- Simulated login with demo credentials
- Demo registration and password reset flows
- Session management with localStorage

### 📅 Schedule Management
- Interactive weekly calendar
- Multi-section support (Math Center, Tutoring Commons, Writing Center)
- Conflict detection and hour limit warnings
- Tutor color customization

### 👥 User Management
- View registered users and their status
- Role display and user statistics
- Search functionality

### 📊 Tutor Management
- Office Assistant availability tracking
- Color-coded tutor identification
- Editable tutor profiles

### ⭐ Review System
- View tutor reviews and ratings
- Rating visualization with star system
- Demo data pre-populated

### ⚙️ Settings & Preferences
- Dark mode toggle
- Profile picture upload
- Performance effects toggle
- Review opt-out option

### 📄 Data Import
- Word document parsing for availability forms
- Schedule import functionality
- Pre-populated demo data

---

## 🛠️ Tech Stack

### Frontend
- **React 19.1** - UI library
- **Vite 7.1** - Build tool and dev server
- **React Router DOM 7.9** - Client-side routing
- **TailwindCSS 4.1** - Utility-first CSS
- **Framer Motion 12.23** - Animations

### Libraries
- **Mammoth** - Word document parsing
- **React Three Fiber** - 3D graphics (landing page effects)

---

## 🏃‍♂️ Running Locally

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/athenor-project-demo.git

# Navigate to frontend directory
cd athenor-project-demo/athenor-front-end

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the project
npm run build

# Preview the build locally
npm run preview
```

## 📁 Project Structure

```
athenor-front-end/
├── src/
│   ├── components/          # Reusable UI components
│   ├── assets/              # Images and static files
│   ├── mockData.js          # Demo data
│   ├── App.jsx              # Main router
│   ├── Login.jsx            # Authentication
│   ├── AdminDashboard.jsx   # Admin panel
│   ├── AssignTutors.jsx     # Schedule assignment
│   ├── MasterSchedule.jsx   # Weekly schedule view
│   ├── ManageUsers.jsx      # User management
│   ├── ManageTutors.jsx     # Tutor management
│   ├── SeeReviews.jsx       # Reviews display
│   ├── Settings.jsx         # User settings
│   └── ...
├── public/
├── index.html
├── package.json
└── vite.config.js
```

---

## 📌 Notes

This project demonstrates:

- **Modern React Development** - Functional components, hooks, context API
- **State Management** - Complex state handling without Redux
- **Responsive Design** - TailwindCSS for mobile-first responsive layouts
- **Dark Mode** - System-wide theme toggle with context
- **Animation** - Framer Motion for smooth UI transitions
- **Routing** - Protected routes with role-based access
- **Form Handling** - Input validation and user feedback
- **File Processing** - Word document parsing with Mammoth
- **Component Architecture** - Reusable, modular component design

The original production version includes:
- ASP.NET Core backend with SQL Server
- JWT authentication
- Azure deployment
- Email notifications via SendGrid
- Full CRUD operations via REST API

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Antonio Pinon**

---
