# EcoCloset Startup Instructions

Follow these instructions to run the EcoCloset platform.

## 1. Start the Backend Server

The backend runs on Node.js with Express and a SQLite DB.

Open a new terminal and run:

```bash
cd backend
npm install
node server.js
```

You should see an output indicating the server is running on port 5000. It is crucial the backend starts running *before* the frontend.

## 2. Start the Frontend App

The frontend is built with React. Open a *second* (new) terminal and run:

```bash
cd frontend
npm start
```

This will launch the development server (typically on `localhost:3000`) and open the application in your browser.

If you attempt to log in without the backend running, you will receive a specific message: "Server not running. Please start backend server."
