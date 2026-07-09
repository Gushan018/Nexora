# Nexora

Nexora is a comprehensive Event Management and Marketplace Platform. It provides a single, unified web platform that connects event planners, service vendors, product sellers, and customers, solving the problem of fragmented event planning.

## 🌟 Key Features

- **Dual Ecosystem:** Functions as both an Event Booking System (book photographers, DJs, catering, etc.) and an E-commerce Marketplace (buy physical event products).
- **Vendor Availability:** Real-time availability tracking for service providers.
- **Admin Approval Workflows:** Ensures quality control by requiring admin approval for vendors, services, and packages.
- **Order & Cart Management:** Full e-commerce functionality with cart, order tracking, and inventory management.
- **Secure Payments:** Support for online payments and offline bank slip uploads.
- **Reviews & Ratings:** Customers can leave feedback for vendors, services, and products.
- **Notification System:** In-app alerts for bookings, orders, and administrative updates.

## 👥 User Roles

- **Customer:** Browse, book services, buy products, and leave reviews.
- **Event Management Company / Service Provider:** Manage business profiles, list services/packages, and handle booking requests.
- **Seller / Supplier:** Manage product listings, inventory, and fulfill orders.
- **Admin:** Oversee the platform, approve listings, manage payments, and generate reports.

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Framer Motion & Lucide React
- React Query & Axios
- Recharts

**Backend:**
- Node.js & Express.js
- Prisma ORM
- PostgreSQL
- JWT & bcryptjs for authentication

## 🚀 Setup Instructions

### 1. Database Setup (PostgreSQL)
1. Ensure you have [PostgreSQL](https://www.postgresql.org/download/) installed and running on your system.
2. Create a new database for the project (e.g., `nexora_db`).
3. Note your database credentials (username, password, port).

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://<USERNAME>:<PASSWORD>@localhost:5432/<DATABASE_NAME>?schema=public"
   JWT_SECRET="your_super_secret_jwt_key_here"
   ```
4. Push the Prisma schema to your database to create the tables:
   ```bash
   npx prisma db push
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server should now be running on `http://localhost:5000`.*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application should now be accessible at `http://localhost:5173`.*
