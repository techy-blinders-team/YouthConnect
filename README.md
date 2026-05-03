# 🌟 YouthConnect  
### A Centralized Digital Platform for SK Officials of Barangay 183

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.3-brightgreen.svg)
![Angular](https://img.shields.io/badge/Angular-20.3.0-red.svg)
![Java](https://img.shields.io/badge/Java-17-orange.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)

---

## 📌 Overview

YouthConnect is a comprehensive digital platform designed to modernize the operations of Sangguniang Kabataan (SK) officials of Barangay 183. The system streamlines event management, youth profiling, concerns tracking, and administrative tasks through a secure, user-friendly interface.

---

## ✨ Key Features

- **Multi-Role Authentication** - Youth Users, SK Officials, and Administrators
- **User Approval Workflow** - SK Official approval required for new registrations
- **Email Notification System** - Automatic notifications for registrations and approvals
- **Event Management** - Create, manage, and track events with attendance
- **Youth Profiling** - Comprehensive member database with analytics
- **Concerns Management** - Submit and track youth concerns with status updates
- **Task Management** - Assign and monitor tasks for SK officials
- **Dashboard & Analytics** - Real-time statistics and visual reports
- **Notification System** - Email notifications and in-app alerts
- **Password Reset** - Secure email-based password recovery
- **Data Export** - Generate PDF and Excel reports

---

## 🛠️ Technology Stack

**Frontend:** Angular 20.3.0, TypeScript, SCSS  
**Backend:** Spring Boot 4.0.3, Java 17  
**Database:** MySQL 8.0  
**Security:** JWT Authentication, Spring Security, Rate Limiting (Bucket4j)  
**Email:** Spring Mail (Gmail SMTP)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer (Angular)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Components  │  │   Services   │  │    Guards    │      │
│  │   (Pages)    │  │  (API Calls) │  │ (Auth/Route) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                Backend Layer (Spring Boot)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Controllers  │→ │   Services   │→ │ Repositories │      │
│  │  (REST API)  │  │  (Business)  │  │ (Data Access)│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Security   │  │  JWT Filter  │  │ Rate Limiter │      │
│  │   (Spring)   │  │ (Auth Token) │  │  (Bucket4j)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ JDBC/JPA
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer (MySQL)                    │
│  Users | Events | Concerns | Tasks | Notifications | Roles  │
└─────────────────────────────────────────────────────────────┘
```

**Architecture Pattern:** Layered (3-Tier)  
**Communication:** RESTful API with JSON  
**Authentication:** JWT Token-based  
**Authorization:** Role-Based Access Control (RBAC)

---

## � Prerequisites

- **Java JDK 17+**
- **Node.js 18+** and npm
- **MySQL 8.0+**
- **Maven 3.8+** (or use included wrapper)
- **Gmail account** (for email notifications)

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/your-username/YouthConnect.git
cd YouthConnect
```

### 2. Setup Database
```sql
CREATE DATABASE youthconnectdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Run migration script:
```bash
# Execute the user approval fields migration
mysql -u root -p youthconnectdb < backend/youthconnect_id/src/main/resources/db/migration/add_user_approval_fields.sql
```

### 3. Configure Backend
Create `.env` file in `backend/youthconnect_id/`:
```properties
DB_URL=jdbc:mysql://localhost:3306/youthconnectdb?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_gmail_app_password

APP_BASE_URL=http://localhost:4200
```

> **Note:** Generate Gmail App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

### 4. Start Backend
```bash
cd backend/youthconnect_id
./mvnw spring-boot:run
```
Backend runs on: `http://localhost:8080`

### 5. Start Frontend
```bash
cd frontend/youthconnect-frontend
npm install
npm start
```
Frontend runs on: `http://localhost:4200`

---

## 🔄 User Approval Workflow

1. **User registers** → Account created with "pending" status
2. **SK Officials notified** → Receive email with user details
3. **SK Official reviews** → Approve or reject with reason
4. **User notified** → Receives email about decision
5. **Approved users** → Can login and access system

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register youth user
- `POST /api/auth/login` - Youth login
- `POST /api/admin/auth/login` - SK Official/Admin login
- `POST /api/password-reset/forgot-password` - Request password reset
- `POST /api/password-reset/reset-password` - Reset password

### User Approval
- `GET /api/user-approval/pending` - Get pending users (SK Official/Admin)
- `POST /api/user-approval/{userId}/approve` - Approve user
- `POST /api/user-approval/{userId}/reject` - Reject user with reason

### Events
- `GET /api/sk/events` - Get all events
- `POST /api/sk/events` - Create event (SK Official/Admin)
- `PUT /api/sk/events/{id}` - Update event
- `DELETE /api/sk/events/{id}` - Delete event

### Concerns
- `GET /api/concerns` - Get concerns
- `POST /api/concerns` - Submit concern
- `PUT /api/concerns/{id}` - Update concern status

### User Management
- `GET /api/administrator/users` - Get all users (Admin)
- `GET /api/administrator/youth-profiles` - Get youth profiles
- `GET /api/administrator/sk-officials` - Get SK officials

---

## 📁 Project Structure

```
YouthConnect/
├── backend/youthconnect_id/
│   ├── src/main/java/.../
│   │   ├── config/          # Security, CORS
│   │   ├── controllers/     # REST endpoints
│   │   ├── models/          # Entities
│   │   ├── repositories/    # Data access
│   │   ├── services/        # Business logic
│   │   └── security/        # JWT, filters
│   ├── .env                 # Environment variables
│   └── pom.xml              # Dependencies
│
├── frontend/youthconnect-frontend/
│   ├── src/app/
│   │   ├── pages/           # Components
│   │   ├── services/        # API services
│   │   ├── guards/          # Route guards
│   │   └── interceptors/    # HTTP interceptors
│   └── package.json
│
└── README.md
```

---

## 🔒 Security Features

- JWT-based authentication with role-based access control
- BCrypt password encryption
- Rate limiting to prevent API abuse
- Secure password reset with token expiration (1 hour)
- User approval workflow for new registrations
- CORS configuration
- SQL injection prevention with JPA
- Session management with Redis

---

## 🚢 Production Build

### Backend
```bash
cd backend/youthconnect_id
./mvnw clean package -DskipTests
```
Output: `target/youthconnect_id-0.0.1-SNAPSHOT.jar`

### Frontend
```bash
cd frontend/youthconnect-frontend
npm run build
```
Output: `dist/` directory

---

## 👥 Development Team

- **Edriane Piadozo** - Project Manager/Developer
- **Kirby Consultado** - Tech Lead/Developer
- **Marc Veslino** - Quality Assurance/Developer
- **Michale Mosquito** - UI/UX Designer/Developer

---
