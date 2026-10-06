# 🏋️ Gym Management System

A web-based **Gym Membership and Fitness Session Management System** developed as a Database Management System (DBMS) project.

The system provides a centralized platform for managing gym members, membership plans, trainers, fitness sessions, session bookings, and attendance records. It uses a relational MySQL database with a Node.js and Express backend and a responsive HTML, CSS, and JavaScript frontend.

---

## 📌 Project Overview

Managing gym operations manually can result in data duplication, difficulty in tracking memberships, booking conflicts, and inefficient attendance management.

The **Gym Management System** solves these problems by providing a database-driven application that allows gym administrators to efficiently manage:

- Members
- Membership plans
- Membership subscriptions
- Trainers
- Fitness sessions
- Session bookings
- Attendance

The project demonstrates the practical implementation of database concepts including **relational tables, primary keys, foreign keys, SQL queries, joins, and database connectivity**.

---

## 🎯 Objectives

The main objectives of the project are:

1. To develop a centralized system for managing gym members.
2. To maintain membership plans and subscription records.
3. To manage trainer information and specializations.
4. To schedule and manage fitness sessions.
5. To allow members to book fitness sessions.
6. To record and track attendance.
7. To reduce manual record keeping and data redundancy.
8. To demonstrate practical implementation of DBMS concepts in a web application.

---

## ✨ Features

### 📊 Dashboard
- Total number of members
- Active memberships
- Total trainers
- Total fitness sessions
- Recent members
- Upcoming fitness sessions

### 👥 Member Management
- Add new members
- View member details
- Search members
- Track member status

### 💳 Membership Management
- View membership records
- Assign membership plans to members
- Track start and end dates
- Track payment amount
- Track payment status

### 🏋 Trainer Management
- Add trainers
- View trainer details
- Store specialization
- Store years of experience

### 📅 Fitness Session Management
- Create fitness sessions
- Assign trainers to sessions
- Set session date and time
- Define session capacity

### 📋 Booking Management
- Book members into fitness sessions
- View booking information
- Track booking status

### ✅ Attendance Management
- Mark attendance for bookings
- Track Present, Absent, and Late status
- View attendance history

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- CORS

### Database
- MySQL
- MySQL Workbench

### Development Tools
- Visual Studio Code
- Git
- GitHub

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │ HTML / CSS / JS     │
                    └──────────┬──────────┘
                               │
                               │ HTTP Requests
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │ Node.js + Express   │
                    └──────────┬──────────┘
                               │
                               │ SQL Queries
                               ▼
                    ┌─────────────────────┐
                    │    MySQL Database   │
                    └─────────────────────┘
