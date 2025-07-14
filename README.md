# Helpdesk System


A modern, full-stack helpdesk ticketing system built with the VME-stack (Vue.js, MySQL, Express.js). This project provides a complete workflow for users, helpdesk staff, and administrators to manage support tickets efficiently.

---

## Key Features

* **Authentication & Roles:** Secure JWT-based authentication with three distinct user roles (User, Staff, Admin).
* **Action-Based Ticketing Workflow:**
    * **Users:** Can create tickets and communicate via comments.
    * **Admins:** Can assign new tickets to available staff.
    * **Staff:** Can accept assignments, start progress, resolve, and close tickets.
* **Real-time Communication:** A comment system on each ticket for seamless interaction between users and support staff.
* **User Management:** An admin panel to view, edit roles, and manage all users in the system.
* **Knowledge Base:** A searchable repository for staff to create and share solutions to common problems.
* **Reporting Dashboard:** An admin-only dashboard with analytics on ticket volume, status distribution, and resolution metrics.
* **Modern UI/UX:** A fully responsive user interface built with **Tailwind CSS**.

---

## Tech Stack

* **Frontend:** Vue.js (with Vue Router & Pinia)
* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Styling:** Tailwind CSS
* **Containerization:** Docker & Docker Compose

---

## Installation and Setup

Follow these steps to get the project running locally.

### Prerequisites
* Node.js (v18+)
* Docker
* A database client like DBeaver or TablePlus (or use the included phpMyAdmin)

### 1. Clone the repository
```bash
git clone https://github.com/scoozmobiii/HelpdeskSystem
cd HelpdeskSystem
```

### 2. Backend Setup
```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Create a .env file from the example (and fill in your secrets)
cp .env.example .env

# Go back to the root directory
cd ..
```

### 3. Frontend Setup
```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install
```

### 4. Run the Project
You will need two separate terminals.

**In the first terminal, start the database and backend:**
```bash
# From the root directory (HelpdeskSystem)
docker-compose up -d

# Start the backend server
cd backend
npm run dev
```

**In the second terminal, start the frontend:**
```bash
# From the root directory (HelpdeskSystem)
cd frontend
npm run dev
```
Your application should now be running!
* **Frontend:** `http://localhost:5173`
* **Backend API:** `http://localhost:5000`
* **phpMyAdmin:** `http://localhost:8080`
