# 🚀 EventNest (Nexora Ecosystem) — Event Management & Multi-Vendor Marketplace

EventNest is a smart, unified event management ecosystem and multi-vendor marketplace tailored for the Sri Lankan market. It bridges the gap between event organizers, service providers, product suppliers, event management companies, and platform administrators.

---

## 🌟 Key Pillars & Features

- **Unified Marketplace:** Search, compare, and book verified event vendors (photographers, decorators, caterers, DJs, production teams) and purchase physical event supplies.
- **Event Budget Tracker (`/api/budget`):** Customer budget planning tool with category cost tracking and automatic expense synchronization from accepted bookings and product purchases.
- **Order & Inventory Management:** E-commerce shopping cart, stock auto-deduction, order tracking (`PENDING` → `PROCESSING` → `SHIPPED` → `DELIVERED`), and customer refund request workflows.
- **Booking & Availability System:** Real-time vendor calendar scheduling with slot availability validation and double-booking conflict prevention.
- **Escrow Financial Settlement (`/api/payments`):** Secure funds flow (`PENDING` → `HELD_IN_ESCROW` → `RELEASED` to vendor) supporting online payments and offline bank slip uploads with standard 10% platform fee.
- **Ratings & Moderation:** Verified 1–5 star reviews for services and event packages, vendor replies, reporting moderation queue, and admin content management.
- **Reporting & Exporting:** Vendor dashboard analytics with PDF export (`pdfkit`) and Excel export (`exceljs`).

---

## 👥 6 System User Roles (Activity Diagram Architecture)

1. **👤 Customer / Event Planner:** Search services/packages/products, place orders, submit booking requests, manage event budget, write reviews, request order refunds.
2. **📷 Service Provider (Photographer, Decorator, Caterer, DJ):** Manage service listings, pricing, availability calendar, accept/reject booking requests, respond to customer reviews.
3. **🛍️ Seller / Supplier:** Publish product catalog, monitor inventory stock, fulfill orders, update shipping status, approve/reject customer refund requests.
4. **🏢 Event Management Company (EventNest Event Co.):** Create and bundle multi-service all-in-one Event Packages (e.g. Wedding Packages, Corporate Packages), manage client bookings.
5. **🛡️ System Administrator:** Approve business accounts & listings, oversee escrow payouts, manage platform settings, handle user disputes, moderate reviews, and audit impersonation logs.
6. **💳 Payment Gateway / Financial System:** Online escrow transaction processing (`HELD_IN_ESCROW`), bank slip verification, and payout disbursement callbacks.

---

## 🛠️ Technology Stack

- **Frontend:** React (Vite), Vanilla CSS / Tailwind CSS, Framer Motion, Lucide React, Recharts, Axios
- **Backend:** Node.js, Express.js REST API
- **Database & ORM:** PostgreSQL, Prisma ORM
- **Authentication:** JWT (JSON Web Tokens) & `bcryptjs` password hashing
- **Report Generation:** `pdfkit` (PDF Export) & `exceljs` (Excel Export)

---

## 🚀 Setup & Installation Guide

### 1. Database Configuration (PostgreSQL)
Ensure PostgreSQL is installed and create your database:
```sql
CREATE DATABASE nexora_db;
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `backend/`:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://<USERNAME>:<PASSWORD>@localhost:5432/nexora_db?schema=public"
   JWT_SECRET="your_jwt_secret_key_here"
   JWT_EXPIRES_IN="7d"
   ```
4. Push Prisma schema & generate client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
5. Start backend development server:
   ```bash
   npm run dev
   ```
   *The server runs on `http://localhost:5000`.*

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `frontend/`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start frontend development server:
   ```bash
   npm run dev
   ```
   *The web app runs on `http://localhost:5173`.*

---

## 🧪 Running Automated Test Suites

The backend includes comprehensive, role-separated automated test suites covering all **6 user roles** (37 test cases with 100% pass rate):

```bash
cd backend
node tests/run-all-6-user-tests.js
```

### Role Test Suite Files:
- `backend/tests/01_customer.test.js` (Customer Role)
- `backend/tests/02_service_provider.test.js` (Service Provider Role)
- `backend/tests/03_seller_supplier.test.js` (Seller/Supplier Role)
- `backend/tests/04_event_company.test.js` (Event Company Role)
- `backend/tests/05_admin.test.js` (System Admin Role)
- `backend/tests/06_payment_system.test.js` (Payment Gateway System)

---

## 📁 API Endpoints Structure (`/api`)

- `/api/auth` — Multi-role authentication & unified login
- `/api/vendors` — Vendor profiles, stats, PDF/Excel report exports
- `/api/services` — Service listings CRUD
- `/api/packages` — Event packages CRUD
- `/api/availability` — Vendor calendar schedules
- `/api/bookings` — Booking requests & slot availability checks
- `/api/products` — Marketplace products & inventory management
- `/api/cart` — Customer shopping cart
- `/api/orders` — Checkout & seller order fulfillment
- `/api/payments` — Escrow & bank slip verification
- `/api/budget` — Customer Event Budget Tracker & auto-sync
- `/api/refunds` — Order refund request & seller processing
- `/api/admin` — System settings, vendor approvals, escrow payouts, review moderation
- `/api/reviews` — Ratings, reviews, vendor replies, reporting
- `/api/notifications` — User notification center
- `/api/messages` — In-app direct messaging

---

© 2026 EventNest Project Team. All rights reserved.
