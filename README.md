# Full Stack Assessment (Task No. 002): CRM Management System

## 🚀 Project Overview

This repository contains a full-stack web application developed for the technical assessment (Task No. 002). The application serves as a comprehensive management system for **Users, Contacts, and Tasks**, built with a strong focus on security, data integrity, and strict adherence to the assessment's technical constraints.

### Key Functional Requirements:
* Secure token-based authentication (15-minute expiry).
* CRUD operations for Users, Contacts, Contact Addresses, and Tasks.
* Enforcement of unique constraints at the database level.
* Automatic user detail management via a Database Trigger.

## 🛠️ Technology Stack Used

| Component | Technology | Note |
| :--- | :--- | :--- |
| **Backend** | Node.js / Express | Handles all API routing and business logic. |
| **Frontend** | React / Next.js | Provides a responsive, required **Clean UI**. **No external UI libraries** were used. |
| **Database** | MySQL | All schema constraints, keys, and triggers are enforced here. |
| **Authentication** | JWT + bcrypt | **bcrypt** is used for password hashing; JWT is used for session management. |

## ⚙️ Setup & Installation Steps

### Prerequisites
* Node.js (v16+)
* MySQL Database Server
* A preferred MySQL Client (e.g., MySQL Workbench, DBeaver)

### 1. Database Configuration

1.  Create a new, empty MySQL database (e.g., `crm_assessment_db`).
2.  Import the provided database dump file: `database/crm_database_dump.sql`. This file contains the complete schema (5 tables) and initial data.

### 2. Backend Setup (`backend/`)

1.  Navigate into the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a **`.env`** file based on the provided example. Set your database credentials and a strong `JWT_SECRET`.

### 3. Frontend Setup (`frontend/`)

1.  Navigate into the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a **`.env.local`** file and set the backend API URL (e.g., `NEXT_PUBLIC_API_URL=http://localhost:4000/api`).

## ▶️ How to Run the Project

1.  **Start the Backend Server (Port 4000):**
    ```bash
    cd backend
    npm start
    ```
2.  **Start the Frontend Application (Port 3000):**
    ```bash
    cd frontend
    npm run dev
    ```
3.  Open your browser to `http://localhost:3000` to access the application.

## 📝 Additional Notes, Assumptions, and Clarifications

### 1. Token Expiry Handling
* The token is set to expire after **15 minutes**.
* The frontend stores the token in **`localStorage`**.
* The frontend handles the **auto-logout** by checking for a `401 Unauthorized` response on authenticated API calls, clearing the local token, and redirecting the user to the Login page.

### 2. Database Trigger Implementation
* A **DB Trigger** is implemented on the **`Users`** table.
* The trigger automatically populates and maintains the **`full_name`** column whenever a new user is inserted or an existing user's `first_name` or `last_name` is updated.


### 🎥 Demonstration Video & Proof of Compliance
**Video Link:** [https://youtu.be/XcEMiSA4wA4]
### 3. Omissions from the Checklist
Due to time constraints, the following features specified in the Backend Requirements were **not implemented**:
* `Email simulation stored in email_logs`
* `Logging middleware`

The rest of the checklist requirements have been met and are demonstrated in the accompanying video.
