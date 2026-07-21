# MediCore - Hospital Management System

MediCore is a comprehensive, modern, and responsive Hospital Management System built with a Hexagonal Architecture on the backend and a sleek React interface on the frontend. It is designed to streamline clinical workflows, manage patient records, and optimize daily hospital operations.

## ✨ Key Features

- **Role-Based Access Control (RBAC):** Strict security ensuring users (Admins, Doctors, Receptionists, Pharmacists, Patients) only see and interact with data relevant to their role.
- **Dynamic Dashboard:** Real-time metrics and dynamic data visualization (Patient Demographics, Weekly Appointment volumes).
- **Patient Management:** Complete patient lifecycle tracking including demographics and medical history.
- **Medical Staff Directory:** Manage doctor profiles, specializations, and departmental assignments.
- **Appointments Scheduling:** Seamlessly book, track, and manage patient-doctor appointments.
- **Prescription Management:** Allow doctors to digitally prescribe medications tied directly to patient appointments.
- **Pharmacy & Inventory:** Track medical supplies, stock levels, and drug details.
- **Billing & Invoices:** Generate real-time bills, apply taxes, and manage dynamic invoicing in local currency (RS).
- **Settings & Security:** Live user profile fetching and account management directly from the dashboard.

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- Lucide React (Icons)
- Vanilla CSS with Modern Glassmorphism UI
- Nginx (for production serving)

**Backend:**
- Go (Golang)
- Gin Web Framework
- GORM (ORM)
- Hexagonal Architecture (Ports and Adapters)

**Database & DevOps:**
- MySQL 8
- Docker & Docker Compose

## 🚀 Getting Started

The easiest way to run the entire stack (Database, Backend, and Frontend) is using Docker.

### Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running with Docker Compose

1. Clone the repository and navigate to the project root:
   ```bash
   cd hospital_management
   ```
2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - **Frontend:** http://localhost
   - **Backend API:** http://localhost/api

### Running Manually for Development

If you prefer to run the application locally without Docker, follow these steps:

#### 1. Database
Ensure you have a local MySQL instance running on `localhost:3306` with a database named `hospital_management`. Update the credentials in `backend/internal/config/config.go` or via environment variables if necessary.

#### 2. Backend
```bash
cd backend
go run ./cmd/server/main.go
```
The API will be available at `http://localhost:8081`.

#### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`. Vite is configured to automatically proxy `/api` requests to the Go backend.

## 🔒 Default Roles
*Note: Depending on your initial database seed, default users are typically set up to test these roles:*
- **Admin**: Full system access, staff management, and reporting.
- **Doctor**: Can view assigned appointments and write prescriptions.
- **Receptionist**: Can manage patients, schedule appointments, and handle billing.
- **Pharmacist**: Can manage medicine inventory and view prescriptions.
- **Patient**: Can view personal appointments and their own prescriptions only.
