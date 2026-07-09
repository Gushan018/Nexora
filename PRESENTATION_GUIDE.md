# Nexora Presentation & Technical Guide

This document provides a high-level and detailed breakdown of how Nexora is built. Use this to prepare for your presentation and answer technical questions from the board.

---

## 1. High-Level Architecture
Nexora follows the **PERN-like stack** (PostgreSQL/MySQL, Express, React, Node.js) but uses **Prisma** as the modern bridge between the code and the database.

*   **Frontend:** React (Vite) + Tailwind CSS + Framer Motion (for animations).
*   **Backend:** Node.js + Express.js.
*   **Database:** PostgreSQL (managed via Prisma ORM).
*   **Communication:** REST API (JSON).

---

## 2. Core Logic Implementation

### A. Authentication & Security (`backend/src/middleware/auth.middleware.js`)
**How it works:**
1.  When a user logs in, the backend generates a **JWT (JSON Web Token)**.
2.  The frontend stores this token in `localStorage`.
3.  For every "protected" request (like updating a profile), the frontend sends the token in the `Authorization` header.
4.  The `protect` middleware verifies the token; if valid, it attaches the user's ID and role to the request object (`req.user`).

### B. Role-Based Access Control (RBAC)
We use a `restrictTo(...roles)` middleware. For example:
*   `router.put('/profile', protect, restrictTo('vendor'), updateVendorProfile);`
*   This ensures a **Customer** cannot access **Vendor** settings, even if they have a valid token.

### C. Database Management (`backend/prisma/schema.prisma`)
We use **Prisma ORM**. Instead of writing raw SQL, we define "Models".
*   **Relationships:** A `Vendor` has many `Services`. An `Order` has many `OrderItems`.
*   **Migrations:** When we change the schema (e.g., adding `instantBook`), we run `npx prisma migrate dev`. This automatically updates the physical database tables.

### D. Frontend State Management (`frontend/src/utils/api.js`)
We use **Axios** for API calls and **TanStack Query (React Query)** for data fetching.
*   **React Query** handles the "Loading" and "Error" states automatically.
*   It caches data so the app feels fast. When you save settings, we "invalidate" the cache to fetch fresh data.

---

## 3. Key File Explanations

### Backend (The "Brain")
*   **`src/app.js`**: The entry point. It connects all the routes and starts the server.
*   **`src/controllers/`**: This is where the **Business Logic** lives. 
    *   *Example:* `order.controller.js` handles the logic for checking if a product is in stock before placing an order.
*   **`src/routes/`**: The "Gatekeepers". They define the URL paths (e.g., `/api/vendors/profile`) and determine which controller should handle the request.
*   **`src/middleware/auth.middleware.js`**: Handles security and login checks.

### Frontend (The "Face")
*   **`src/App.jsx`**: The main router. It maps URLs to specific Page components.
*   **`src/context/AuthContext.jsx`**: A global "store" that keeps track of who is logged in across the whole app.
*   **`src/pages/vendor/VendorSettings.jsx`**: Implements the logic we just built—fetching preferences, managing form state, and sending updates to the backend.
*   **`src/pages/seller/OrderManagement.jsx`**: Contains the complex logic for **Grouping Items**. Since one order might have products from multiple sellers, this file filters the data so a seller only sees *their* specific items and revenue.

---

## 4. Difficult Questions & Sample Answers

**Q: How do you handle security for payments or sensitive data?**
> "We use JWT for session management. On the backend, we never trust the frontend's 'role' claim; we verify the token's signature on every request. For sensitive actions like updating an order, we perform a 'database-level ownership check' to ensure the logged-in user actually owns the data they are trying to change."

**Q: Why did you choose Prisma instead of raw SQL?**
> "Prisma provides 'Type Safety'. It prevents common errors like typos in table names and handles complex table joins (like getting a Customer's name through an Order ID) with very simple code, making the development faster and the code more maintainable."

**Q: How does the "Instant Book" logic work?**
> "It's a boolean flag in the Vendor model. When a customer attempts a booking, the system checks this flag. If true, the booking status is set to 'ACCEPTED' immediately; if false, it stays 'PENDING' until the vendor responds to it."

---

## 5. Folder Structure at a Glance
```text
Nexora/
├── backend/
│   ├── prisma/            # Database schema & migrations
│   ├── src/
│   │   ├── controllers/   # Logic (The "How")
│   │   ├── routes/        # Endpoints (The "Where")
│   │   └── middleware/    # Security (The "Who")
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI (Buttons, Cards)
    │   ├── pages/         # Full screens (Dashboard, Settings)
    │   ├── context/       # Global State (Auth)
    │   └── utils/         # Helpers (API config)
```
