# YouthConnect  
### A Centralized Digital Platform for the SK Officials of Barangay 183

---

## 📌 Project Overview

**YouthConnect** is a centralized digital platform designed to streamline and modernize the operations of the Sangguniang Kabataan (SK) officials of Barangay 183.  

The system improves efficiency, transparency, and coordination in managing youth programs, events, attendance, concerns, and administrative tasks. It replaces manual processes with a secure, organized, and user-friendly digital solution.

---

## 🎯 Objectives

- Digitize and centralize SK operations  
- Improve event and attendance management  
- Enhance transparency and accountability  
- Provide data tracking and monitoring  
- Support data-driven decision-making  

---

## 🚀 Features

### 🔐 User Authentication
- Secure login and registration  
- Role-based access control (Admin & SK Officials)
- **SK Official approval required for new users**
- **Email notifications for approval/rejection**

### 📧 Email Notification System
- **Automatic notifications to SK Officials for new registrations**
- **Approval/rejection emails to users**
- **Professional HTML email templates**
- **Configurable SMTP settings**

### 👥 User Management
- **Pending user approval workflow**
- **Approve/reject users with reasons**
- **Track approval history**
- **Status badges (Pending/Approved/Rejected)**

### 📅 Event Management
- Create, edit, and delete events  
- Manage schedules and event details  
- Track participants  

### 📝 Attendance Tracking
- Digital attendance recording  
- Attendance monitoring and reporting  

### ✅ Task Tracker
- Assign tasks to officials  
- Monitor task progress  
- Track completion status  

### 📢 Concerns Module
- Submit and manage youth concerns  
- Organized concern tracking system  

### 🛠️ Admin Panel
- User management  
- System monitoring and control  
- **User approval dashboard**

### 📊 Data Visualization
- Analytics dashboard  
- Graphical reports for events and participation  

---

## 🏗️ System Architecture

YouthConnect follows a standard web-based architecture:

- **Frontend** – User Interface  
- **Backend** – Business Logic & Data Processing  
- **Database** – Centralized Data Storage  

The system is modular and scalable for future enhancements.

---

## 🛠️ Technology Stack

- Frontend: Angular
- Backend: Java (Spring boot)
- Database: MySQL  
- Email: Spring Mail (SMTP)
- Hosting: VPS Hostinger

---

## 📋 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Gmail account (for email notifications)

### Setup
1. **Clone the repository**
2. **Setup database**: Run `backend/youthconnect_id/src/main/resources/db/migration/add_user_approval_fields.sql`
3. **Configure email**: Update `application.properties` with your Gmail credentials
4. **Start backend**: `cd backend/youthconnect_id && mvn spring-boot:run`
5. **Start frontend**: `cd frontend/youthconnect-frontend && npm start`

See `QUICK_START.md` for detailed instructions.

---

## 📚 Documentation

- **Quick Start Guide**: `QUICK_START.md`
- **Implementation Guide**: `IMPLEMENTATION_GUIDE.md`
- **SK Official User Guide**: `SK_OFFICIAL_USER_GUIDE.md`
- **Feature Summary**: `FEATURE_SUMMARY.md`
- **Email Setup**: `EMAIL_SETUP_GUIDE.md`

---

## 🔄 User Approval Workflow

1. **User registers** → Account created with "pending" status
2. **SK Officials notified** → Receive email with user details
3. **SK Official reviews** → Approve or reject with reason
4. **User notified** → Receives email about decision
5. **Approved users** → Can login and access system

---