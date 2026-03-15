# 🌿 EcoCloset - Sustainable Fashion Marketplace

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=flat-square&logo=sqlite)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](https://opensource.org/licenses/ISC)

**EcoCloset** is a premium, community-driven marketplace designed to revolutionize fashion consumption. By enabling users to **Buy**, **Swap**, and **Donate** pre-loved clothing, we aim to extend the lifecycle of garments and reduce environmental waste.

## ✨ Key Features

- 🛍️ **Smart Marketplace**: Browse unique sustainable items with high-quality photography and detailed descriptions.
- 🔄 **Swap & Donation**: Multiple listing types including traditional sales, item-for-item swaps, and charitable donations.
- 👤 **Real User Integration**: Automated fetching of real user names, locations, and avatars across the platform.
- 🔐 **Secure Auth**: JWT-based authentication system with session persistence across page refreshes.
- 👑 **Admin Portal**: Dedicated administrative dashboard for community moderation and management.
- 📱 **Premium UI**: Modern, responsive design with glassmorphism effects and smooth micro-animations.

---

## 🚀 Quick Start (Windows Only)

For a one-click experience, simply run the startup script in the root directory:
```bash
# This will start both the Frontend (Port 3000) and Backend (Port 5000)
START_ECOLOSET.bat
```

---

## 🛠️ Technical Stack

- **Frontend**: React.js, Tailwind CSS, Lucide Icons, React Router
- **Backend**: Node.js, Express.js
- **Database**: SQLite (via `better-sqlite3`) for robust, local data management
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt password hashing
- **File Storage**: Multer-based local storage for item and profile images

---

## 📁 Project Structure

```bash
ecocloset-project/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Reusable UI blocks (ModernNavbar, UserProfile, etc.)
│   │   ├── pages/      # View layers (StylishItems, ProfilePage, etc.)
│   │   └── context/    # State management (AuthContext, CartContext)
├── backend/            # Express.js API
│   ├── uploads/        # Local storage for images
│   ├── ecocloset.db    # SQLite Database
│   └── server.js       # Main API entry point
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+)

### 2. Backend Setup
```bash
cd backend
npm install
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## 🧪 Admin Credentials

To access administrative features, use the following default credentials:
- **Email**: `admin@gmail.com`
- **Password**: `123456`

---

## 🐛 Troubleshooting

- **Port 3000/5000 occupied**: Ensure no other services are running on these ports.
- **Images not loading**: Verify the `backend/uploads` directory exists and matches the server configuration.
- **Session Issues**: Clear browser cookies if you experience persistent login redirects.

---

## 🌍 Impact Goals

EcoCloset is more than just a marketplace; it's a movement towards a **Circular Economy**.
- **Reduce**: Fewer new clothes produced.
- **Reuse**: Give items a second life.
- **Recycle**: Proper disposal via NGO partnerships.

---

### 📄 License
This project is licensed under the **ISC License**.

**🌱 Join the sustainable fashion revolution with EcoCloset!**
