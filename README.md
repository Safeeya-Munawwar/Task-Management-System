# 📝 Task Management System

A full-stack task management application built with **React**, **Node.js**, **Express**, and **MongoDB**.  
It allows users to create, edit, delete, and mark tasks as complete, with sorting, searching, and deadline tracking features.

---

## 🚀 Features

- **Add New Tasks** with title, description, and deadline.
- **Edit Existing Tasks** and update details in real-time.
- **Mark Tasks as Completed** or revert to pending.
- **Search Tasks** by title or description.
- **Sort Tasks** by title, deadline, or creation date (asc/desc).
- **Deadline Notifications** for upcoming tasks.
- **Tabs** for viewing **Pending** and **Completed** tasks separately.
- Fully responsive UI.

---

## 🛠️ Tech Stack

### Frontend
- **React** with functional components and hooks (`useState`, `useEffect`)
- **Fetch API** for backend communication
- Inline CSS styling for quick customization

### Backend
- **Node.js** + **Express.js** REST API
- CRUD operations for tasks
- Middleware for JSON parsing and CORS handling

### Database
- **MongoDB** with **Mongoose** ODM
- Schema with validation and timestamps

---

## 📂 Project Structure

task-manager/
│
├── backend/
│ ├── server.js # Express server with CRUD routes
│ ├── models/Task.js # Mongoose schema & model
│ └── .env # Environment variables (Mongo URI, Port)
│
├── frontend/
│ ├── src/
│ │ ├── components/ # React components (TaskList, TaskForm, etc.)
│ │ ├── App.js # Main app
│ │ └── index.js # React entry point
│ └── package.json
│
└── README.md
