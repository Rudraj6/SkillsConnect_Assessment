# SkillsConnect_Assessment
# MERN Full Stack Assessment - Task 002: User/Contact/Task Management System

## 🚀 Project Overview

[cite_start]This repository contains a complete full-stack web application developed as part of a technical assessment (Task No. 002)[cite: 1]. The application is a secure, token-based system for managing users, contacts, and tasks, built according to strict technical and architectural requirements.

## 🛠️ Technology Stack

| Component | Technology | Note |
| :--- | :--- | :--- |
| **Frontend** | React / Next.js | [cite_start]Developed without external UI libraries, focusing on a **Clean UI**[cite: 57, 58, 69]. |
| **Backend** | Node.js (Express) | [cite_start]Handles business logic, authentication, and database interaction[cite: 48]. |
| **Database** | MySQL (Original Requirement) | [cite_start]Schema enforced with unique constraints and triggers[cite: 49]. |
| **Authentication** | JWT + bcrypt | [cite_start]Uses **bcrypt** for secure password hashing[cite: 50]. |

## ✨ Key Features & Technical Compliance

### Backend Features
* [cite_start]**Secure Authentication:** Implemented **Token-based authentication** with a strict **15-minute expiry**[cite: 51, 67].
* [cite_start]**Data Integrity:** Unique constraints are enforced for user `email` and `phone`[cite: 66].
* [cite_start]**DB Trigger Automation:** The `full_name` field in the Users table is automatically calculated and maintained by a **Database Trigger**[cite: 53, 64].
* [cite_start]**Logging:** Includes a **logging middleware** to track server activity and requests[cite: 52].
* [cite_start]**Email Simulation:** All outgoing email events (e.g., registration or task notification) are simulated and logged into the dedicated **`Email Logs`** table[cite: 54, 68].

### Frontend Features
* [cite_start]**State Management:** Auth token is securely stored in `localStorage`[cite: 59].
* [cite_start]**Security Logic:** Implements **automatic user logout** upon **15-minute token expiry**[cite: 60, 67].
* **Required Pages:** Includes dedicated views for:
    * Login & Registration
    * Dashboard
    * Contacts
    * Address Management
    * [cite_start]Tasks Management [cite: 61]

## 📊 Database Schema Highlights

The application uses a normalized schema across five main tables:

1.  [cite_start]**Users:** Stores user profiles, including the DB-maintained `full_name`[cite: 6, 64].
2.  [cite_start]**Users Contact:** Stores user-owned contacts, enforcing `contact_number` uniqueness per user[cite: 9, 13].
3.  [cite_start]**Contact Address:** Detailed addresses linked to contacts[cite: 21].
4.  [cite_start]**Users Task:** Tracks tasks, ensuring the associated `contact_id` belongs to the creating `user_id`[cite: 36, 37].
5.  [cite_start]**Email Logs:** Stores records of all simulated email activity for auditing[cite: 39].

