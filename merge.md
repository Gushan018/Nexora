# Merge Changes — Customer + Admin Project Merge

All changes made to merge the customer and admin parts of the project into one codebase and database.

---

## 1. Frontend Fixes

### 1.1 Removed Duplicate Import — `src/main.jsx`
- **File:** `frontend/src/main.jsx`
- Removed duplicate line 18: `import { ThemeProvider } from './context/ThemeContext'`
- The import already existed on line 6. The duplicate caused Vite error: `Identifier 'ThemeProvider' has already been declared`.

### 1.2 Removed Duplicate Import — `src/components/layout/DashboardLayout.jsx`
- **File:** `frontend/src/components/layout/DashboardLayout.jsx`
- Removed duplicate line 7: `import { useTheme } from '../../context/ThemeContext'`
- The import already existed on line 6.

### 1.3 Fixed Undefined Variable — `DashboardLayout.jsx`
- **File:** `frontend/src/components/layout/DashboardLayout.jsx` (line 177)
- Changed `{theme === 'dark' ? ...}` to `{isDarkMode ? ...}`
- `theme` was not defined in scope; `isDarkMode` is the correct variable from `useTheme()`.

---

## 2. Backend Configuration Fixes

### 2.1 Added Missing ENV Variable — `.env`
- **File:** `backend/.env`
- Added `JWT_EXPIRES_IN=7d`
- This variable was referenced in `auth.controller.js:10` (`jwt.sign(..., { expiresIn: process.env.JWT_EXPIRES_IN })`) but was missing from `.env`, causing `jwt.sign()` to fail.

### 2.2 Added Seed Scripts — `package.json`
- **File:** `backend/package.json`
- Added `"seed": "node prisma/seed.js"` and `"prisma:seed": "node prisma/seed.js"` scripts
- Added `"prisma": { "seed": "node prisma/seed.js" }` config for `prisma db seed` support

---

## 3. Database Schema Merge — `prisma/schema.prisma`

The Prisma schema was synced with the actual PostgreSQL database via `prisma db pull`, then manually enriched with the missing columns from the customer project.

### 3.1 Admin Model — Added Columns
| Column | Type | Default |
|--------|------|---------|
| `name` | `String?` | `null` |
| `contactNumber` | `String?` | `null` |
| `profileImage` | `String?` | `null` |

### 3.2 Customer Model — Added Columns
| Column | Type | Default |
|--------|------|---------|
| `isBlocked` | `Boolean` | `false` |
| `profileImage` | `String?` | `null` |

### 3.3 Vendor Model — Added Columns (from admin project)
| Column | Type | Default |
|--------|------|---------|
| `booking_lead_time` | `String` | `"48h"` |
| `cancellation_policy` | `String` | `"Moderate"` |
| `currency` | `String` | `"LKR"` |
| `instant_book` | `Boolean` | `false` |
| `require_deposits` | `Boolean` | `false` |
| `timezone` | `String` | `"UTC"` |
| `isApproved` | `Boolean` | `false` |

### 3.4 Service Model — Added Columns
| Column | Type | Default |
|--------|------|---------|
| `pricing_model` | `String?` | `null` |
| `service_area` | `String?` | `null` |
| `isApproved` | `Boolean` | `false` |

### 3.5 Product Model — Added Columns
| Column | Type | Default |
|--------|------|---------|
| `isApproved` | `Boolean` | `false` |

### 3.6 EventPackage Model — Added Columns
| Column | Type | Default |
|--------|------|---------|
| `imageUrl` | `String?` | `null` |
| `isApproved` | `Boolean` | `false` |
| `category_id` | `Int?` | `null` |

### 3.7 New Tables (from admin project)
- `budget` — budget planning per customer
- `budget_category` — category breakdown within budget

### 3.8 New Tables (from customer project)
- `wishlist` — customer wishlist (products, services, packages)
- `conversation` — customer-vendor chat threads
- `message` — individual chat messages

---

## 4. Seed File — `prisma/seed.js`

### 4.1 Key Design Decisions
- Uses `upsert` (not `deleteMany`) — safe to run on both fresh and existing databases
- On fresh DB: all records are inserted
- On existing DB: existing records are untouched, missing records are added

### 4.2 Included Data
| Entity | Count | Details |
|--------|-------|---------|
| Admin | 1 | `admin@example.com` / `password123` |
| Customer | 7 | sarah, mike, sarath, ravee, dinith, nimal, kumari |
| Vendor | 3 | Luxe Dining Catering, Bloom Designs, SoundWave DJ |
| ServiceCategory | 3 | Food & Catering, Decorations, Music & Entertainment |
| Service | 2 | Premium Buffet, Live DJ Set |
| Product | 2 | Gold Cutlery Set, LED Uplights |
| EventPackage | 1 | Platinum Wedding Package |
| Booking | 12 | Various statuses across customers |
| Order | 1 | Sarah's gold cutlery order (SHIPPED) |
| Review | 13 | Mixed ratings across vendors/products |

### 4.3 All accounts use password `password123`

---

## 5. How to Use

### Start backend
```bash
cd backend
npm run dev        # or: npm start
```

### Start frontend
```bash
cd frontend
npm run dev
```

### Seed database (fresh or existing)
```bash
cd backend
node prisma/seed.js
```
Or: `npx prisma db seed`

### Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `password123` |
| Customer | `sarah@example.com` | `password123` |
| Customer | `mike@example.com` | `password123` |
| Vendor | `vendor1@example.com` | `password123` |

---

## 6. Files Changed

| File | Change |
|------|--------|
| `frontend/src/main.jsx` | Removed duplicate `ThemeProvider` import |
| `frontend/src/components/layout/DashboardLayout.jsx` | Removed duplicate `useTheme` import; fixed `theme` → `isDarkMode` |
| `backend/.env` | Added `JWT_EXPIRES_IN=7d` |
| `backend/package.json` | Added seed scripts and prisma seed config |
| `backend/prisma/schema.prisma` | Full merged schema from both projects |
| `backend/prisma/seed.js` | Comprehensive seed with upsert logic (new file) |
| `backend/fix_admin_columns.js` | No longer needed (schema is now in sync) |
| `merge.md` | This file |
