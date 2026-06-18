# Nexora (Event Nest) — Customer Module: Complete Viva Guide

> **Project**: Event Nest — Event Planning & Vendor Marketplace Platform  
> **Module**: Customer  
> **Tech Stack**: Express.js + Prisma ORM + PostgreSQL (Backend) | React + Vite + React Query + Tailwind CSS + Framer Motion (Frontend)  
> **Auth**: JWT-based with localStorage token persistence

---

## Table of Contents

1. [Data Model (Prisma Schema)](#1-data-model-prisma-schema)
2. [Backend Architecture](#2-backend-architecture)
   - [app.js — Route Registration](#2a-appjs--route-registration)
   - [customer.routes.js — API Endpoints](#2b-customerroutesjs--api-endpoints)
   - [customer.controller.js — Business Logic](#2c-customercontrollerjs--business-logic)
   - [auth.middleware.js — Authentication & Authorization](#2d-authmiddlewarejs--authentication--authorization)
3. [Frontend Architecture](#3-frontend-architecture)
   - [App.jsx — Routing](#3a-appjsx--routing)
   - [utils/api.js — Axios Instance & Interceptors](#3b-utilsapijs--axios-instance--interceptors)
   - [context/AuthContext.jsx — Auth State Management](#3c-contextauthcontextjsx--auth-state-management)
4. [Customer Pages (19 Files)](#4-customer-pages-19-files)
   - [4.1 CustomerDashboard.jsx](#41-customerdashboardjsx)
   - [4.2 ProfileManagement.jsx](#42-profilemanagementjsx)
   - [4.3 AccountSettings.jsx](#43-accountsettingsjsx)
   - [4.4 EventDashboard.jsx](#44-eventdashboardjsx)
   - [4.5 BookingDetails.jsx](#45-bookingdetailsjsx)
   - [4.6 BookVendor.jsx](#46-bookvendorjsx)
   - [4.7 CreateEvent.jsx](#47-createeventjsx)
   - [4.8 ManageEvent.jsx](#48-manageeventjsx)
   - [4.9 ShoppingCart.jsx](#49-shoppingcartjsx)
   - [4.10 Checkout.jsx](#410-checkoutjsx)
   - [4.11 PaymentPage.jsx](#411-paymentpagejsx)
   - [4.12 OrderSuccess.jsx](#412-ordersuccessjsx)
   - [4.13 OrderHistory.jsx](#413-orderhistoryjsx)
   - [4.14 ProductDetails.jsx](#414-productdetailsjsx)
   - [4.15 ReviewSubmission.jsx](#415-reviewsubmissionjsx)
   - [4.16 Wishlist.jsx](#416-wishlistjsx)
   - [4.17 ChatInbox.jsx](#417-chatinboxjsx)
   - [4.18 VendorChat.jsx](#418-vendorchatjsx)
   - [4.19 NotificationCenter.jsx](#419-notificationcenterjsx)
5. [Admin Customer Management](#5-admin-customer-management)
6. [Complete Data Flows](#6-complete-data-flows)
7. [Viva Questions & Answers](#7-viva-questions--answers)

---

## 1. Data Model (Prisma Schema)

**File**: `backend/prisma/schema.prisma` (Lines 62–81)

```prisma
model Customer {
  customerId       Int      @id @default(autoincrement()) @map("customer_id")
  name             String
  email            String   @unique
  password         String
  contactNumber    String?  @map("contact_number")
  role             String   @default("customer")
  profileImage     String?  @map("profile_image")
  registrationDate DateTime @default(now()) @map("registration_date")

  bookings      Booking[]
  cart          Cart?
  orders        Order[]
  reviews       Review[]
  notifications Notification[]
  wishlists     Wishlist[]
  conversations Conversation[]

  @@map("customer")
}
```

### Field Breakdown

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `customerId` | `Int` | `@id`, `@default(autoincrement())` | Primary key, auto-incremented |
| `name` | `String` | Required | Full name of the customer |
| `email` | `String` | `@unique` | Login credential, must be unique |
| `password` | `String` | Required | Hashed password (bcrypt applied in auth controller) |
| `contactNumber` | `String?` | Optional | Phone number for vendor contact |
| `role` | `String` | `@default("customer")` | Used by `restrictTo` middleware for RBAC |
| `profileImage` | `String?` | Optional | URL path to uploaded image |
| `registrationDate` | `DateTime` | `@default(now())` | Auto-set on creation |

### Relations (7 total)

| Relation | Type | Target Model | Key Field |
|----------|------|-------------|-----------|
| `bookings` | One-to-Many | `Booking` | `customerId` in Booking |
| `cart` | One-to-One | `Cart` | `customerId` in Cart (unique) |
| `orders` | One-to-Many | `Order` | `customerId` in Order |
| `reviews` | One-to-Many | `Review` | `customerId` in Review |
| `notifications` | One-to-Many | `Notification` | `customerId` in Notification |
| `wishlists` | One-to-Many | `Wishlist` | `customerId` in Wishlist |
| `conversations` | One-to-Many | `Conversation` | `customerId` in Conversation |

### Related Enums

```prisma
enum BookingStatus { PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED }
enum PaymentStatus { PENDING, HELD_IN_ESCROW, RELEASED, REFUNDED, FAILED }
enum PaymentMethod { ONLINE, BANK_SLIP }
enum OrderStatus { PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED }
enum VendorType { PHOTOGRAPHER, SALON, RENTAL, CATERING, DJ, EVENT_COMPANY, OTHER }
```

### Viva Note on `@@map`

`@@map("customer")` tells Prisma the actual PostgreSQL table name is `customer` (lowercase, singular), while the model name `Customer` (PascalCase) is used in code. This avoids naming conflicts.

---

## 2. Backend Architecture

### 2a. `app.js` — Route Registration

**File**: `backend/src/app.js`

The customer routes are registered at line 44:

```js
app.use('/api/customers', customerRoutes);
```

All route prefixes in the app:

| Mount Path | Router File | Purpose |
|-----------|-------------|---------|
| `/api/auth` | `auth.routes.js` | Login, register, forgot/reset password |
| `/api/vendors` | `vendor.routes.js` | Vendor CRUD, public vendor listing |
| `/api/bookings` | `booking.routes.js` | Create, read, manage bookings |
| `/api/products` | `product.routes.js` | Product listing and details |
| `/api/cart` | `cart.routes.js` | Cart CRUD operations |
| `/api/orders` | `order.routes.js` | Order placement and history |
| `/api/payments` | `payment.routes.js` | Payment processing |
| `/api/admin` | `admin.routes.js` | Admin-specific endpoints |
| **`/api/customers`** | **`customer.routes.js`** | **Customer profile & dashboard** |
| `/api/reviews` | `review.routes.js` | Review submission & listing |
| `/api/notifications` | `notification.routes.js` | Notification CRUD |
| `/api/wishlist` | `wishlist.routes.js` | Wishlist management |
| `/api/chat` | `chat.routes.js` | Conversations & messages |
| `/api/upload` | `upload.routes.js` | File uploads |

Middleware registered globally: `cors()`, `express.json()`, static file serving for `/uploads`.

---

### 2b. `customer.routes.js` — API Endpoints

**File**: `backend/src/routes/customer.routes.js`

```js
const express = require('express');
const router = express.Router();
const {
  getCustomerProfile,
  updateCustomerProfile,
  getDashboardStats
} = require('../controllers/customer.controller');
const { protect } = require('../middleware/auth.middleware');

// Protect all routes — every endpoint requires a valid JWT
router.use(protect);

router.get('/profile', getCustomerProfile);
router.put('/profile', updateCustomerProfile);
router.get('/dashboard-stats', getDashboardStats);

module.exports = router;
```

### Complete API Reference

| Method | Endpoint | Middleware | Controller | Auth Required |
|--------|----------|-----------|------------|---------------|
| `GET` | `/api/customers/profile` | `protect` | `getCustomerProfile` | Yes |
| `PUT` | `/api/customers/profile` | `protect` | `updateCustomerProfile` | Yes |
| `GET` | `/api/customers/dashboard-stats` | `protect` | `getDashboardStats` | Yes |

**Key Design Decision**: `router.use(protect)` at the top means ALL routes in this file are protected. No need to add `protect` middleware individually to each route.

---

### 2c. `customer.controller.js` — Business Logic

**File**: `backend/src/controllers/customer.controller.js`

#### 2c-i. `getCustomerProfile` (Lines 5–28)

```js
const getCustomerProfile = async (req, res) => {
  try {
    const customerId = req.user.id;
    const customer = await prisma.customer.findUnique({
      where: { customerId },
      select: {
        customerId: true,
        name: true,
        email: true,
        contactNumber: true,
        profileImage: true,
        registrationDate: true,
      }
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
```

**How it works**:
1. Extracts `customerId` from `req.user.id` (set by `protect` middleware after JWT decode)
2. Uses **`select`** (not `include`) to explicitly pick fields — this excludes `password` from the response
3. Returns 404 if customer doesn't exist
4. Returns 500 with `error.message` for any server error

**Important**: The JWT payload stores `{ id: decoded.id, role: decoded.role }`. The `id` here corresponds to `customerId` (or `vendorId`/`adminId` depending on role).

---

#### 2c-ii. `updateCustomerProfile` (Lines 31–57)

```js
const updateCustomerProfile = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { name, contactNumber, profileImage } = req.body;

    const updatedCustomer = await prisma.customer.update({
      where: { customerId },
      data: {
        name,
        contactNumber,
        ...(profileImage && { profileImage })  // Conditional spread
      },
      select: {
        customerId: true,
        name: true,
        email: true,
        contactNumber: true,
        profileImage: true,
        registrationDate: true,
      }
    });

    res.status(200).json({
      message: "Profile updated successfully.",
      customer: updatedCustomer
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
```

**JavaScript Trick**: `...(profileImage && { profileImage })` — the spread operator conditionally adds the `profileImage` property only if it's truthy. This prevents accidentally setting `profileImage` to `null` or `undefined`.

**Security Note**: Email is NOT updatable through this endpoint. Only `name`, `contactNumber`, and optionally `profileImage` can be changed.

---

#### 2c-iii. `getDashboardStats` (Lines 60–113) — **Most Important Controller**

This is the most complex customer controller, returning 8 computed values for the dashboard.

```js
const getDashboardStats = async (req, res) => {
  try {
    const customerId = req.user.id;

    // 1. Active Orders — not delivered or cancelled
    const activeOrders = await prisma.order.count({
      where: { customerId, status: { notIn: ['DELIVERED', 'CANCELLED'] } }
    });

    // 2. Pending Bookings — awaiting vendor approval
    const pendingBookings = await prisma.booking.count({
      where: { customerId, status: 'PENDING' }
    });

    // 3. Upcoming Events — accepted bookings with future dates
    const upcomingEvents = await prisma.booking.count({
      where: { customerId, status: 'ACCEPTED', eventDate: { gte: new Date() } }
    });

    // 4. Wishlist Count
    const wishlisted = await prisma.wishlist.count({ where: { customerId } });

    // 5. Recent Orders — last 3 with product details
    const recentOrders = await prisma.order.findMany({
      where: { customerId },
      orderBy: { orderDate: 'desc' },
      take: 3,
      include: { orderItems: { include: { product: true } } }
    });

    // 6. Upcoming Bookings — sorted by date, with vendor info
    const upcomingBookingsList = await prisma.booking.findMany({
      where: {
        customerId,
        status: { in: ['ACCEPTED', 'PENDING'] },
        eventDate: { gte: new Date() }
      },
      orderBy: { eventDate: 'asc' },
      take: 3,
      include: {
        service: { include: { vendor: true } },
        package: { include: { vendor: true } }
      }
    });

    // 7. Recommended Vendors — basic random selection
    const recommendedVendors = await prisma.vendor.findMany({
      where: { isApproved: true },
      take: 2,
    });

    // 8. Action Required — accepted bookings needing payment
    const actionRequired = upcomingBookingsList.filter(b => b.status === 'ACCEPTED');

    res.status(200).json({
      activeOrders,
      pendingBookings,
      upcomingEvents,
      wishlisted,
      recentOrders,
      upcomingBookingsList,
      recommendedVendors,
      actionRequired
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
```

**Metrics Explained**:

| Metric | Prisma Query | SQL Equivalent | Business Meaning |
|--------|-------------|----------------|------------------|
| `activeOrders` | `order.count` with `notIn` | `SELECT COUNT(*) FROM orders WHERE status NOT IN ('DELIVERED','CANCELLED')` | How many orders are still processing/shipping |
| `pendingBookings` | `booking.count` with status `'PENDING'` | `SELECT COUNT(*) FROM bookings WHERE status = 'PENDING'` | Awaiting vendor approval |
| `upcomingEvents` | `booking.count` with status + date filter | `SELECT COUNT(*) FROM bookings WHERE status = 'ACCEPTED' AND event_date >= NOW()` | Confirmed future events |
| `wishlisted` | `wishlist.count` | `SELECT COUNT(*) FROM wishlists WHERE customer_id = X` | Saved items count |
| `recentOrders` | `order.findMany` with `take:3` | `SELECT * FROM orders ORDER BY order_date DESC LIMIT 3` | Last 3 marketplace orders |
| `upcomingBookingsList` | `booking.findMany` with `include` | Multi-table JOIN for next 3 future bookings | Event timeline data |
| `recommendedVendors` | `vendor.findMany` with `take:2` | `SELECT * FROM vendors WHERE is_approved = true LIMIT 2` | Basic suggestion |
| `actionRequired` | Filtered from `upcomingBookingsList` | — | Bookings where vendor accepted but payment pending |

**Prisma `include` vs `select`**:
- `include` fetches **related models** (eager loading) — used here for `service.vendor`, `package.vendor`, `orderItems.product`
- `select` picks specific **fields** from the model
- You **cannot** use both `include` and `select` at the same level in Prisma

---

### 2d. `auth.middleware.js` — Authentication & Authorization

**File**: `backend/src/middleware/auth.middleware.js`

#### `protect` Middleware (Lines 8–32)

```js
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
```

**Step by step**:
1. Reads `Authorization` header
2. Checks if it starts with `"Bearer "`
3. Extracts the token (splits by space, takes index 1)
4. Verifies with `jwt.verify()` using `JWT_SECRET` from `.env`
5. Sets `req.user = { id: decoded.id, role: decoded.role }`
6. Calls `next()` to pass control to the route handler
7. If anything fails → 401 JSON response

#### `restrictTo` Middleware (Lines 39–46)

```js
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    next();
  };
};
```

**Usage pattern**: `router.delete('/user/:id', protect, restrictTo('admin'), handler)`

For customer module, `restrictTo` is not used in `customer.routes.js` since the routes are already customer-specific (the JWT token itself was issued to a customer during login).

---

## 3. Frontend Architecture

### 3a. `App.jsx` — Routing

**File**: `frontend/src/App.jsx`

All customer routes are defined inside a `<DashboardLayout role="customer">` wrapper (Line 128):

```jsx
<Route path="/customer" element={<DashboardLayout role="customer" />}>
  <Route index element={<CustomerDashboard />} />
  <Route path="dashboard" element={<CustomerDashboard />} />
  <Route path="customer-dashboard" element={<CustomerDashboard />} />
  {/* Public pages inside dashboard */}
  <Route path="services" element={<Services isDashboard />} />
  <Route path="marketplace" element={<Marketplace isDashboard />} />
  <Route path="event-packages" element={<EventPackages isDashboard />} />
  {/* Customer-specific pages */}
  <Route path="profile-management" element={<ProfileManagement />} />
  <Route path="account-settings" element={<AccountSettings />} />
  <Route path="notification-center" element={<NotificationCenter />} />
  <Route path="wishlist" element={<Wishlist />} />
  <Route path="product-details/:id" element={<ProductDetails />} />
  <Route path="shopping-cart" element={<ShoppingCart />} />
  <Route path="checkout" element={<Checkout />} />
  <Route path="payment-page" element={<PaymentPage />} />
  <Route path="order-success" element={<OrderSuccess />} />
  <Route path="order-history" element={<OrderHistory />} />
  <Route path="event-dashboard" element={<EventDashboard />} />
  <Route path="create-event" element={<CreateEvent />} />
  <Route path="manage-event" element={<ManageEvent />} />
  <Route path="book-vendor" element={<BookVendor />} />
  <Route path="booking-details" element={<BookingDetails />} />
  <Route path="review-submission" element={<ReviewSubmission />} />
  <Route path="chat-inbox" element={<ChatInbox />} />
  <Route path="vendor-chat/:conversationId?" element={<VendorChat />} />
</Route>
```

**Routing Table**:

| Route | Component | Purpose |
|-------|-----------|---------|
| `/customer` or `/customer/dashboard` | `CustomerDashboard` | Main landing page with overview |
| `/customer/profile-management` | `ProfileManagement` | Edit profile details |
| `/customer/account-settings` | `AccountSettings` | Profile + theme settings |
| `/customer/notification-center` | `NotificationCenter` | View notifications |
| `/customer/wishlist` | `Wishlist` | Saved items grid |
| `/customer/product-details/:id` | `ProductDetails` | Single product view |
| `/customer/shopping-cart` | `ShoppingCart` | Cart with quantity management |
| `/customer/checkout` | `Checkout` | Place marketplace orders |
| `/customer/payment-page` | `PaymentPage` | Payment processing |
| `/customer/order-success` | `OrderSuccess` | Order/booking confirmation |
| `/customer/order-history` | `OrderHistory` | Past orders with search |
| `/customer/event-dashboard` | `EventDashboard` | All bookings with tabs |
| `/customer/create-event` | `CreateEvent` | New event wizard |
| `/customer/manage-event` | `ManageEvent` | Mock event management |
| `/customer/book-vendor` | `BookVendor` | 3-step booking flow |
| `/customer/booking-details` | `BookingDetails` | Single booking detail view |
| `/customer/review-submission` | `ReviewSubmission` | Star rating + review form |
| `/customer/chat-inbox` | `ChatInbox` | Conversation list |
| `/customer/vendor-chat/:id` | `VendorChat`| Real-time chat with vendor |
| `/customer/services` | `Services` | Public services page (wrapped) |
| `/customer/marketplace` | `Marketplace` | Public marketplace (wrapped) |
| `/customer/event-packages` | `EventPackages` | Public packages (wrapped) |

**URL Parameter Patterns**:
- `:id` — required (ProductDetails)
- `:conversationId?` — optional (VendorChat)
- Query params used: `?id=X`, `?bookingId=X&amount=X&item=X`, `?vendorId=X`, `?type=order|booking`, etc.

### 3b. `utils/api.js` — Axios Instance & Interceptors

**File**: `frontend/src/utils/api.js`

```js
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);
```

**How it works**:
1. **Request interceptor**: Every outgoing API call automatically gets the JWT from localStorage attached as `Authorization: Bearer <token>`
2. **Response interceptor**: If any API returns 401, it auto-clears stored auth data (triggering logout)
3. **Base URL**: Uses Vite env variable `VITE_API_URL`, falls back to `http://localhost:5000/api`
4. **Usage in components**: `import { api } from '../../utils/api'` then `api.get('/customers/profile')`

### 3c. `context/AuthContext.jsx` — Auth State Management

**File**: `frontend/src/context/AuthContext.jsx`

```jsx
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount — restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData, accountType = 'customer') => {
    try {
      const response = await api.post(`/auth/register/${accountType}`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**State Management**:
- `user` — the decoded user object `{ id, name, email, role, ... }`
- `loading` — `true` while checking localStorage on mount (prevents flash of unauthenticated UI)
- `login()` — sends POST, stores token+user in localStorage and state
- `register()` — sends POST to `/auth/register/customer` (or vendor)
- `logout()` — clears localStorage and state
- `setUser()` — exposed to allow child components (like ProfileManagement) to update the user in context after edits

---

## 4. Customer Pages (19 Files)

### 4.1 `CustomerDashboard.jsx`

**Route**: `/customer/dashboard`  
**File**: `frontend/src/pages/customer/CustomerDashboard.jsx` (382 lines)

#### Structure

The page is divided into 5 major sections:

1. **Welcome Banner** — Animated hero with user's first name, gradient background, CTA buttons
2. **PromoSlideshow** — Auto-rotating banner (3 slides, 5s interval)
3. **Quick Stats Grid** — 4 stat cards (Upcoming Events, Active Orders, Pending Bookings, Wishlisted)
4. **Main Content** (2/3 width):
   - Event Timeline — Upcoming bookings with status icons
   - Recent Orders Table — Last 3 marketplace orders
5. **Sidebar** (1/3 width):
   - Action Required — Accepted bookings needing payment
   - Recommended Vendors — Clickable vendor suggestions

#### Key Components

**`PromoSlideshow`** (Lines 33–95):
- Uses `useState` for `currentSlide` index
- `useEffect` with `setInterval` (5000ms) for auto-rotation
- `AnimatePresence` + `motion.div` for crossfade transitions
- Navigation dots at bottom
- Gradient overlay with title/subtitle text

**`StatCard`** (Lines 337–358):
- Receives `icon`, `title`, `value`, `label`, `delay` as props
- `motion.div` with spring animation per card
- Hover effects: translate up, shadow, border highlight

**`TimelineItem`** (Lines 360–382):
- Vertical timeline with connecting line (except last item)
- Status indicators: confirmed (green checkmark) vs pending (yellow clock)

**Data Fetching** (Lines 101–107):
```js
const { data: stats, isLoading } = useQuery({
  queryKey: ['customerDashboardStats'],
  queryFn: async () => {
    const res = await api.get('/customers/dashboard-stats');
    return res.data;
  }
});
```

**React Query Key**: `['customerDashboardStats']` — used for cache invalidation (e.g., after wishlist changes)

#### Conditional Rendering

```jsx
{stats?.upcomingBookingsList?.length === 0 ? (
  <p className="...">No upcoming events scheduled.</p>
) : (
  stats?.upcomingBookingsList?.map(...)
)}
```

Uses **optional chaining** (`?.`) extensively to safely access nested data that may not be loaded yet.

#### Navigation Actions

| Button | Destination | Query Params |
|--------|------------|--------------|
| "Explore Packages" | `/customer/event-packages` | — |
| "Shop Marketplace" | `/customer/marketplace` | — |
| "Pay Now" | `/customer/payment-page` | `bookingId=X&amount=X&item=Booking` |

---

### 4.2 `ProfileManagement.jsx`

**Route**: `/customer/profile-management`  
**File**: `frontend/src/pages/customer/ProfileManagement.jsx` (198 lines)

#### Data Flow

1. On mount: `useQuery` fetches `GET /customers/profile` → `['customerProfile']`
2. `useEffect` populates form fields from response (splits `name` into first/last)
3. On save: `useMutation` sends `PUT /customers/profile` with `{ name, contactNumber }`
4. On success: invalidates `['customerProfile']` query cache, updates AuthContext user

#### State Management

```js
const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '' });
```

Single object state for form fields. `handleChange` uses computed property names:
```js
setFormData({ ...formData, [e.target.name]: e.target.value });
```

**Note**: `input` elements have a `name` attribute matching the state keys (`firstName`, `lastName`, `phone`).

#### UI Structure

- **Sidebar navigation** (4 items): Public Profile (active), Password & Security, Payment Methods, Notifications
- **Profile Picture card**: Placeholder image with camera hover overlay for upload
- **Personal Information card**: First/Last name inputs, bio textarea
- **Contact Details card**: Email (disabled, verified badge), Phone input

#### Mutation Pattern

```js
const updateMutation = useMutation({
  mutationFn: async (data) => {
    const res = await api.put('/customers/profile', data);
    return res.data;
  },
  onSuccess: (data) => {
    queryClient.invalidateQueries(['customerProfile']);
    if (data.customer) {
      setUser({ ...user, name: data.customer.name });
    }
    alert('Profile updated successfully!');
  },
  onError: (err) => {
    alert(err.response?.data?.message || 'Error updating profile');
  }
});
```

**Key Pattern**: `queryClient.invalidateQueries(['customerProfile'])` forces React Query to refetch the profile data on next mount/render.

---

### 4.3 `AccountSettings.jsx`

**Route**: `/customer/account-settings`  
**File**: `frontend/src/pages/customer/AccountSettings.jsx` (208 lines)

This is similar to ProfileManagement but more feature-rich.

#### Profile Image Upload Flow

```
User selects file → createObjectURL(blob) for preview
                  → on save: POST /api/upload (FormData with file)
                  → receives URL back
                  → PUT /api/customers/profile with profileImage: URL
                  → updates AuthContext + localStorage
```

```js
const handleSave = async () => {
  let profileImageUrl = user?.profileImage;

  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    const uploadRes = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    profileImageUrl = uploadRes.data.url;
  }

  const res = await api.put('/customers/profile', {
    name: `${formFirst} ${formLast}`.trim(),
    profileImage: profileImageUrl
  });

  const updatedUser = { ...user, ...res.data.customer };
  setUser(updatedUser);
  localStorage.setItem('user', JSON.stringify(updatedUser));
};
```

#### Theme Toggle Integration

Uses `useTheme()` context with `theme` and `toggleTheme`:
```jsx
<button onClick={toggleTheme} className={cn(..., theme === 'light' ? "border-primary" : ...)}>
```

Two visual options: Light Mode (yellow circle) and Dark Mode (moon crescent shadow trick).

#### Avatar Display Logic

```jsx
{previewImage.startsWith('blob:') ? previewImage : `http://localhost:5000${previewImage}`}
```

Handles two cases:
- **Blob URLs** — from file picker (before save)
- **Server URLs** — from database (after save), prepends backend URL

---

### 4.4 `EventDashboard.jsx`

**Route**: `/customer/event-dashboard`  
**File**: `frontend/src/pages/customer/EventDashboard.jsx` (151 lines)

#### Tab Filtering

```jsx
const [activeTab, setActiveTab] = React.useState('ALL');

const filteredBookings = React.useMemo(() => {
  if (activeTab === 'ALL') return bookings;
  if (activeTab === 'PENDING') return bookings.filter(b => b.status === 'PENDING');
  if (activeTab === 'UPCOMING') return bookings.filter(b => b.status === 'ACCEPTED');
  if (activeTab === 'COMPLETED') return bookings.filter(b => b.status === 'COMPLETED');
  return bookings;
}, [bookings, activeTab]);
```

**`useMemo`** recalculates only when `bookings` or `activeTab` changes.

#### Tab Definitions

| Tab ID | Label | Icon | Filter Logic |
|--------|-------|------|-------------|
| `ALL` | All Events | `ListOrdered` | No filter |
| `PENDING` | Pending Approval | `Hourglass` | `status === 'PENDING'` |
| `UPCOMING` | Upcoming (Accepted) | `CalendarDays` | `status === 'ACCEPTED'` |
| `COMPLETED` | Completed | `CheckCircle2` | `status === 'COMPLETED'` |

#### Booking Card

Each booking card displays:
- **Cover image** with gradient overlay and hover zoom effect
- **Type badge** (from category) + **Status badge** on the image
- **Event name** (with hover color change), date, location, vendor
- **Progress bar**: `ACCEPTED=50%`, `PENDING=10%`, else `100%`
- **Amount + Notes** summary box
- "View Booking Details" button → `/customer/booking-details?id={bookingId}`

#### Data Source

```js
const { data: bookings = [], isLoading } = useQuery({
  queryKey: ['bookings'],
  queryFn: async () => {
    const res = await api.get('/bookings/my');
    return res.data;
  }
});
```

---

### 4.5 `BookingDetails.jsx`

**Route**: `/customer/booking-details?id=X`  
**File**: `frontend/src/pages/customer/BookingDetails.jsx` (218 lines)

#### Query Parameter Extraction

```js
const [searchParams] = useSearchParams();
const bookingId = searchParams.get('id');
```

Uses React Router's `useSearchParams` (not `useParams`) because the route is static — the ID is passed as a query string.

#### Data Fetching

```js
const { data: bookings = [], isLoading } = useQuery({
  queryKey: ['bookings'],
  queryFn: async () => {
    const res = await api.get('/bookings/my');
    return res.data;
  }
});

const booking = bookings.find(b => b.bookingId === parseInt(bookingId));
```

The entire bookings list is fetched and then filtered client-side. This reuses the same `['bookings']` query key as EventDashboard (shares cache).

#### Price Calculation

```js
const amount = Number(booking.service?.price || booking.package?.price || 0);
```

**Service Fee**: 5% of subtotal → `amount * 0.05`  
**Total**: `amount * 1.05`

#### Conditional Payment UI

| Booking Status | UI Element |
|---------------|------------|
| `PENDING` | Yellow info box: "Payment will be required only after vendor approval" |
| `ACCEPTED` | Blue box: "Pay Now" button linking to `/customer/payment-page` |
| Others (COMPLETED) | Green checkmark: "Payment Completed" |

#### Navigation

- "Back to My Events" link → `/customer/event-dashboard`
- "Contact Vendor" button (UI only, no onClick handler)
- "Invoice" button (shown only for ACCEPTED bookings)
- "Request Cancellation" button (UI only)

---

### 4.6 `BookVendor.jsx`

**Route**: `/customer/book-vendor?id=X`  
**File**: `frontend/src/pages/customer/BookVendor.jsx` (272 lines)

#### 3-Step Booking Wizard

**Step 1 — Select Package** (Lines 112–157):
- Lists vendor's `eventPackages` from `GET /vendors/:id`
- Each package is clickable with highlight effect
- Selection stored in `selectedPackage` state (packageId)
- "Continue to Details" button (disabled if no selection)

**Step 2 — Event Details** (Lines 159–209):
- Date picker with calendar icon
- Location text input with map pin icon
- Optional message to vendor (textarea)
- "Back" and "Review" buttons
- "Review" disabled if date or location missing

**Step 3 — Confirm Booking** (Lines 212–232):
- Shows total amount in large text
- "Back" and "Send Booking Request" buttons
- Sends `POST /bookings` mutation
- On success: alert + navigate to `/customer/event-dashboard`

#### Progress Tracker (Lines 86–103)

```jsx
{[1, 2, 3].map((num) => (
  <React.Fragment key={num}>
    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
      step >= num ? "bg-primary text-white" : "bg-surface border border-slate-300 text-slate-500"
    )}>
      {step > num ? <Check className="w-5 h-5"/> : num}
    </div>
    {num < 3 && <div className={cn("w-24 h-1", step > num ? "bg-primary" : "bg-slate-200")} />}
  </React.Fragment>
))}
```

**Logic**: 
- Step number filled if `step >= num`
- Step shows checkmark if `step > num` (completed)
- Connecting bar filled if `step > num`

#### Data Fetching

```js
const { data: vendor, isLoading } = useQuery({
  queryKey: ['vendor', vendorId],
  queryFn: async () => {
    if (!vendorId) return null;
    const res = await api.get(`/vendors/${vendorId}`);
    return res.data;
  },
  enabled: !!vendorId   // Only runs if vendorId is truthy
});
```

**`enabled`** option prevents the query from running when `vendorId` is null/undefined.

#### Booking Summary Sidebar

Shows:
- Vendor avatar (first letter) + name + type
- Selected package name
- Base price

Is `sticky top-24` — stays visible while scrolling.

---

### 4.7 `CreateEvent.jsx`

**Route**: `/customer/create-event`  
**File**: `frontend/src/pages/customer/CreateEvent.jsx` (170 lines)

**Status**: UI-only prototype (no API calls)

#### 3-Step Event Planning Wizard

**Step 1 — Event Type**: Wedding, Corporate Event, Private Party (with icons + descriptions)
**Step 2 — The Basics**: Event name, date, guest count, city/location
**Step 3 — Budget Configuration**: Total estimated budget in LKR

**Note**: All inputs are uncontrolled or using local state. No form submission logic exists yet. The "Create Event Dashboard" button in Step 3 just navigates to `/customer/event-dashboard`.

#### `EVENT_TYPES` Array

```jsx
const EVENT_TYPES = [
  { id: 'wedding', name: 'Wedding', icon: <Heart ... />, desc: 'Ceremonies, Receptions, Anniversaries' },
  { id: 'corporate', name: 'Corporate Event', icon: <Building2 ... />, desc: 'Conferences, Seminars, Galas' },
  { id: 'party', name: 'Private Party', icon: <PartyPopper ... />, desc: 'Birthdays, Showers, Gatherings' },
];
```

---

### 4.8 `ManageEvent.jsx`

**Route**: `/customer/manage-event`  
**File**: `frontend/src/pages/customer/ManageEvent.jsx` (157 lines)

**Status**: Mock/placeholder UI (hardcoded data, no API integration)

#### Sections

1. **Event Header**: Type badge, event name, date, location, guests, "Edit Details" button
2. **Booked Vendors**: 3 hardcoded vendors (Catering, Photography, Decor) with statuses
3. **To-Do List**: 4 hardcoded tasks with checkboxes (2 completed, 1 urgent)
4. **Budget Overview**: Total spent (LKR 9,200) out of budget (LKR 15,000) with 61% progress bar
5. **Quick Links**: Guest List, Vendor Chat

**Viva Note**: This page demonstrates the intended UI for managing a single event's details, but has no backend integration yet.

---

### 4.9 `ShoppingCart.jsx`

**Route**: `/customer/shopping-cart`  
**File**: `frontend/src/pages/customer/ShoppingCart.jsx` (172 lines)

#### Data Flow

```
useQuery(['cart']) → GET /api/cart
  ↓
Cart items displayed
  ↓
Quantity change → PUT /api/cart/item/:id { quantity }
  ↓
Delete → DELETE /api/cart/item/:id
  ↓
Mutation success → invalidateQueries(['cart'])
```

#### Error Handling for Empty Cart

```js
const { data: cart, isLoading } = useQuery({
  queryKey: ['cart'],
  queryFn: async () => {
    try {
      const res = await api.get('/cart');
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) return { cartItems: [] };
      throw err;
    }
  }
});
```

Handles 404 (no cart exists yet for this customer) by returning an empty cart structure.

#### Price Calculation

```js
const subtotal = items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
const tax = subtotal * 0.10;  // 10% tax
const total = subtotal + tax;
```

#### Quantity Management

```js
const updateQuantity = (cartItemId, currentQuantity, delta) => {
  const newQuantity = currentQuantity + delta;
  if (newQuantity < 1) return;  // Prevents going below 1
  updateQuantityMutation.mutate({ cartItemId, quantity: newQuantity });
};
```

#### UI States

- **Empty cart**: Shopping bag icon, message, "Start Shopping" → `/marketplace`
- **Loading**: Centered text "Loading cart..."
- **Normal**: Items grid + Order Summary sidebar

---

### 4.10 `Checkout.jsx`

**Route**: `/customer/checkout`  
**File**: `frontend/src/pages/customer/Checkout.jsx` (164 lines)

#### 2-Step Process

1. **Shipping Details** (Step 1): Address input, "Review Order" button
2. **Review & Place** (Step 2): "Place Order" button in summary sidebar

#### Order Placement Flow

```js
const placeOrderMutation = useMutation({
  mutationFn: async () => {
    const res = await api.post('/orders/checkout', {
      shippingAddress: shippingAddress || 'Default Address',
    });
    return res.data;
  },
  onSuccess: (data) => {
    queryClient.invalidateQueries(['cart']);
    queryClient.invalidateQueries(['orders']);
    navigate(`/customer/payment-page?orderId=${data.order.orderId}&amount=${total.toFixed(2)}&item=Marketplace%20Order`);
  }
});
```

**Key**: After placing the order, the user is redirected to the payment page with the `orderId` and `amount` as query parameters.

#### Price Breakdown

| Component | Calculation |
|-----------|------------|
| Subtotal | `items.reduce((sum, item) => sum + (price * qty), 0)` |
| Shipping | `items.length > 0 ? 15.00 : 0` (LKR 15 flat) |
| Tax (VAT) | `subtotal * 0.10` (10%) |
| Total | `subtotal + tax + shipping` |

---

### 4.11 `PaymentPage.jsx`

**Route**: `/customer/payment-page`  
**File**: `frontend/src/pages/customer/PaymentPage.jsx` (293 lines)

#### Payment Methods

**1. Online Payment** (`paymentMethod === 'ONLINE'`):
- Cardholder name input
- Card number (auto-formatted to groups of 4: `0000 0000 0000 0000`)
- Expiry MM/YY (auto-formatted: `MM/` + `YY`)
- CVV (3-4 digits, password masked)

**2. Bank Slip** (`paymentMethod === 'BANK_SLIP'`):
- Shows bank details: Commercial Bank, Event Nest Marketplace, Account #1234567890
- File upload for payment slip receipt

#### Card Validation

```js
const validateCard = () => {
  const errors = {};
  if (paymentMethod === 'ONLINE') {
    const num = cardDetails.number.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(num)) errors.number = '16-digit card number required';
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      errors.expiry = 'Format: MM/YY';
    } else {
      const [month, year] = cardDetails.expiry.split('/');
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      const currentYear = parseInt(new Date().getFullYear().toString().slice(2), 10);
      const currentMonth = new Date().getMonth() + 1;
      if (m < 1 || m > 12) errors.expiry = 'Invalid month';
      else if (y < currentYear || (y === currentYear && m < currentMonth)) errors.expiry = 'Card expired';
    }
    if (!/^\d{3,4}$/.test(cardDetails.cvc)) errors.cvc = '3-4 digits required';
    if (!cardDetails.name.trim()) errors.name = 'Name on card is required';
  }
  setCardErrors(errors);
  return Object.keys(errors).length === 0;
};
```

Validates: card number format, expiry date (not expired), CVV length, and cardholder name.

#### Payment Processing

```js
const paymentMutation = useMutation({
  mutationFn: async () => {
    let receiptUrl = null;

    // Upload bank slip if method is BANK_SLIP
    if (paymentMethod === 'BANK_SLIP' && file) {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      receiptUrl = uploadRes.data.url;
    }

    const res = await api.post('/payments/pay', {
      amount,
      paymentMethod,
      orderId,    // may be null for bookings
      bookingId,  // may be null for orders
      receiptUrl,
      transactionId: paymentMethod === 'ONLINE'
        ? 'txn_' + Math.floor(Math.random() * 1000000)
        : null
    });
    return res.data;
  },
  onSuccess: () => {
    navigate(`/customer/order-success?type=${isOrder ? 'order' : 'booking'}&id=${orderId || bookingId || 'N/A'}&amount=${amount}&item=${encodeURIComponent(itemName)}`);
  },
  onError: (err) => {
    alert(err.response?.data?.message || 'Payment failed.');
  }
});
```

**Two payment flows**:
- **Online**: Generates a mock `transactionId` (not real Stripe integration)
- **Bank Slip**: Uploads file first, then sends `receiptUrl` along with payment request

---

### 4.12 `OrderSuccess.jsx`

**Route**: `/customer/order-success?type=order|booking&id=X&amount=X&item=X`  
**File**: `frontend/src/pages/customer/OrderSuccess.jsx` (180 lines)

#### Confirmation Logic

```js
const type = searchParams.get('type') || 'booking';
const isOrder = type === 'order';
const referenceId = `#NXR-${isOrder ? 'ORD' : 'BKG'}-${id.padStart(4, '0')}`;
```

**Reference IDs**:
- Orders: `#NXR-ORD-0001`
- Bookings: `#NXR-BKG-0001`

#### Invoice Generation

Uses `window.open().document.write()` to create a print-friendly HTML invoice:
- Company logo
- Invoice number and date
- Item description with quantity
- Total amount
- Footer note

```js
const handleDownloadInvoice = () => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`...styled HTML...`);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
};
```

#### Conditional Content

| Type | Extra Content Shown |
|------|--------------------|
| Booking | Date & Time box, Location box with "Get Directions" |
| Order | Shipping info: "Your order will be shipped soon" |

---

### 4.13 `OrderHistory.jsx`

**Route**: `/customer/order-history`  
**File**: `frontend/src/pages/customer/OrderHistory.jsx` (247 lines)

#### Tab + Search Filtering

```js
const filteredOrders = React.useMemo(() => {
  let result = orders;

  // Tab filter
  if (activeTab === 'PENDING') result = result.filter(o => ['PENDING', 'PROCESSING'].includes(o.status));
  else if (activeTab === 'SHIPPING') result = result.filter(o => o.status === 'IN_TRANSIT');
  else if (activeTab === 'COMPLETED') result = result.filter(o => o.status === 'DELIVERED');

  // Search filter (by order ID or product name)
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    result = result.filter(o => {
      const matchesId = String(o.orderId).toLowerCase().includes(q);
      const matchesProduct = o.orderItems?.some(item =>
        item.product?.productName?.toLowerCase().includes(q)
      );
      return matchesId || matchesProduct;
    });
  }
  return result;
}, [orders, activeTab, searchQuery]);
```

**Tab Definitions**:

| Tab | Status Filter |
|-----|--------------|
| ALL | No filter |
| PENDING | `PENDING` or `PROCESSING` |
| SHIPPING | `IN_TRANSIT` |
| COMPLETED | `DELIVERED` |

#### Order Card

Each order displays:
- **Header**: Order placed date, total, order number, "View Invoice" button
- **Status** with icon (green check, blue map pin, yellow clock)
- **Items**: Image, product name, quantity, unit price
- **Review link** (only for DELIVERED orders): "Write Review" → `/customer/review-submission?productId=X`

#### `StatusIcon` Component

```js
const StatusIcon = ({ status }) => {
  switch(status) {
    case 'DELIVERED': return <CheckCircle2 className="text-green-400" />;
    case 'IN_TRANSIT': return <MapPin className="text-blue-400" />;
    case 'PROCESSING':
    case 'PENDING': return <Clock className="text-yellow-400" />;
    default: return <Package className="text-slate-500" />;
  }
};
```

---

### 4.14 `ProductDetails.jsx`

**Route**: `/customer/product-details/:id`  
**File**: `frontend/src/pages/customer/ProductDetails.jsx` (236 lines)

#### Image Gallery

3 images displayed (first from product, then 2 fallback Unsplash URLs):
- Main image with hover scale effect
- Thumbnail strip with active indicator (opacity + border)

#### Product Info

- Vendor name (clickable, links to vendor profile)
- Share button (copies URL to clipboard)
- Wishlist heart toggle (filled red if wishlisted)
- Star rating (hardcoded 4.8)
- Review count
- Stock status with checkmark
- Price in LKR
- Description
- Vendor location + available quantity

#### Wishlist Toggle Logic

```js
const wishlistItem = wishlistItems.find(item => item.productId === parseInt(id));
const isWishlisted = !!wishlistItem;
```

**Conditional rendering**:
```jsx
<button onClick={() => isWishlisted
  ? removeFromWishlistMutation.mutate(wishlistItem.wishlistId)
  : addToWishlistMutation.mutate()
}>
  <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
</button>
```

#### Quantity Selector

```js
const [quantity, setQuantity] = useState(1);
// Min: 1, Max: product.quantity (stock limit)
<button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
<button onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}>+</button>
```

#### Add to Cart Button

Shows dynamic total: `"Add to Cart - LKR ${(price * quantity).toFixed(2)}"`

#### Share Button

```js
navigator.clipboard.writeText(window.location.href);
alert('Link copied to clipboard!');
```

#### Empty State

```jsx
if (!product) return <div>Product not found.</div>;
```

---

### 4.15 `ReviewSubmission.jsx`

**Route**: `/customer/review-submission` (query params optional: `vendorId`, `serviceId`, `productId`)  
**File**: `frontend/src/pages/customer/ReviewSubmission.jsx` (171 lines)

#### Interactive Star Rating

```jsx
{[1, 2, 3, 4, 5].map((star) => (
  <button
    key={star}
    onMouseEnter={() => setHoveredRating(star)}
    onMouseLeave={() => setHoveredRating(0)}
    onClick={() => setRating(star)}
  >
    <Star className={cn(
      "w-12 h-12 transition-colors",
      (hoveredRating || rating) >= star
        ? "text-yellow-400 fill-yellow-400"
        : "text-slate-300"
    )} />
  </button>
))}
```

Shows label below stars:
- 1 → "Terrible", 2 → "Poor", 3 → "Average", 4 → "Great", 5 → "Excellent"

#### Character Counter

```jsx
<span className={cn(reviewText.length >= 50 ? "text-green-400" : "text-slate-500")}>
  {reviewText.length}/500
</span>
```

Min 50 characters required for submission.

#### Validation Logic

```jsx
<Button disabled={rating === 0 || reviewText.length < 50 || submitReviewMutation.isPending}>
  Submit Review
</Button>
```

All three conditions must pass:
1. Rating must be selected
2. Review text must be ≥ 50 characters
3. Not currently submitting

#### Submission

```js
const submitReviewMutation = useMutation({
  mutationFn: async () => {
    const res = await api.post('/reviews', {
      rating,
      comment: reviewText,
      vendorId: vendorId ? parseInt(vendorId) : null,
      serviceId: serviceId ? parseInt(serviceId) : null,
      productId: productId ? parseInt(productId) : null
    });
    return res.data;
  },
  onSuccess: () => setIsSubmitted(true),
});
```

#### Success State

Animated checkmark with green circle, thank you message, "Return to Events" button.

---

### 4.16 `Wishlist.jsx`

**Route**: `/customer/wishlist`  
**File**: `frontend/src/pages/customer/Wishlist.jsx` (89 lines)

#### Data Model Handling

```js
const detail = item.product || item.service || item.package;
const type = item.product ? 'Product' : item.service ? 'Service' : 'Package';
```

The wishlist can contain three types of items — the code determines which type and extracts the appropriate detail object.

#### Grid Layout

- Responsive: 1 column (mobile) → 2 columns (md) → 3 columns (xl)
- Each card: image (with hover zoom), type badge ("Product"/"Service"/"Package"), delete button, name, vendor, price, "View Details"
- Delete invalidates `['wishlist']` and `['customerDashboardStats']`

#### Empty State

```jsx
{wishlist?.length === 0 ? (
  <Card className="text-center py-12">
    <Heart className="w-12 h-12 text-slate-300 mb-4" />
    <h3>Your wishlist is empty</h3>
    <p>Start browsing the marketplace...</p>
    <Link to="/customer/marketplace"><Button>Explore Marketplace</Button></Link>
  </Card>
) : (
  // Grid of items
)}
```

---

### 4.17 `ChatInbox.jsx`

**Route**: `/customer/chat-inbox`  
**File**: `frontend/src/pages/customer/ChatInbox.jsx` (96 lines)

#### Layout

Desktop: Split pane (sidebar + empty state)
Mobile: Full-width conversation list

#### Conversation List

- Each conversation shows: vendor initial avatar, business name, last message preview, time
- Links to `/customer/vendor-chat/:id`

```js
const timeStr = lastMessage
  ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  : '';
```

#### Empty State (Desktop)

```jsx
<div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center">
  <MessageSquare className="w-10 h-10 text-slate-300" />
  <h2>Your Inbox</h2>
  <p>Select a conversation from the sidebar...</p>
</div>
```

---

### 4.18 `VendorChat.jsx`

**Route**: `/customer/vendor-chat/:conversationId?`  
**File**: `frontend/src/pages/customer/VendorChat.jsx` (138 lines)

#### Real-time Polling

```js
const { data: messages = [], isLoading } = useQuery({
  queryKey: ['messages', conversationId],
  queryFn: async () => {
    if (!conversationId) return [];
    const res = await api.get(`/chat/messages/${conversationId}`);
    return res.data;
  },
  enabled: !!conversationId,
  refetchInterval: 3000  // Poll every 3 seconds
});
```

**`refetchInterval: 3000`** — React Query automatically refetches every 3 seconds, providing near-real-time messaging without WebSockets.

#### Auto-scroll

```js
const bottomRef = useRef(null);
useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);
```

Scrolls to bottom when new messages arrive.

#### Message Bubbles

```jsx
<div key={msg.id} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
  <div className={cn(
    "max-w-[80%] sm:max-w-[70%] rounded-2xl p-4",
    isMe ? "bg-primary text-white rounded-tr-sm" : "bg-surface border border-slate-200 text-slate-800 rounded-tl-sm"
  )}>
    <p className="text-sm leading-relaxed">{msg.text}</p>
    <div className="text-[10px] mt-2">{timeStr}</div>
  </div>
</div>
```

- Customer messages (isMe=true): right-aligned, blue background, `rounded-tr-sm`
- Vendor messages (isMe=false): left-aligned, white background, `rounded-tl-sm`

#### Sending Messages

```js
const sendMutation = useMutation({
  mutationFn: async (text) => {
    const res = await api.post('/chat/messages', { conversationId, text });
    return res.data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries(['messages', conversationId]);
    setMessage('');
  }
});
```

Enter key or send button triggers mutation. On success, input is cleared.

---

### 4.19 `NotificationCenter.jsx`

**Route**: `/customer/notification-center`  
**File**: `frontend/src/pages/customer/NotificationCenter.jsx` (99 lines)

#### Notification Display

Each notification card shows:
- **Unread indicator**: Primary-colored dot + light background (`bg-primary/5 border-primary/20`)
- **Type** (bold heading)
- **Message** text
- **Timestamp** with clock icon
- **"Mark as read"** button (checkmark icon, only shown for unread)

#### Mark as Read

```js
const markReadMutation = useMutation({
  mutationFn: async (id) => {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  }
});
```

**Note**: uses `{ queryKey: ['notifications'] }` (object syntax) instead of `['notifications']` (array shorthand). Both work in React Query v5+.

#### Empty State

```jsx
<CardContent className="p-12 text-center text-slate-600">
  <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
  <p>You have no notifications yet.</p>
</CardContent>
```

---

## 5. Admin Customer Management

### `AdminCustomerManagement.jsx`

**Route**: `/admin/admin-customer-management`  
**File**: `frontend/src/pages/admin/AdminCustomerManagement.jsx` (140 lines)

**Status**: Uses static mock data — no API integration.

#### Key Metrics Cards

| Card | Value | Color |
|------|-------|-------|
| Active Customers (30d) | 12,400 | Default |
| Avg. Lifetime Value | LKR 2,150 | Green |
| High Risk Accounts | 14 | Default (with "Review" button) |

#### Customer Table

Columns: Customer (name, email, ID), Financials (total spent, bookings), Activity (last active), Risk Score (Low/High badges), Actions (View Profile, More)

#### Risk Scoring

```jsx
<span className={cn(
  "...",
  customer.riskScore === 'Low' ? "bg-green-500/10 text-green-400" :
  customer.riskScore === 'High' ? "bg-red-500/20 text-red-400 border border-red-500/20" :
  "bg-yellow-500/10 text-yellow-500"
)}>
  {customer.riskScore === 'High' && <ShieldAlert className="w-3.5 h-3.5" />}
  {customer.riskScore} Risk
</span>
```

---

## 6. Complete Data Flows

### Flow 1: Booking a Vendor

```
CustomerDashboard → "Explore Packages"
  → EventPackages (browse packages)
  → Click "Book Now" on a vendor
  → BookVendor?id=X
      |-- GET /vendors/:id → vendor + eventPackages
      |-- Step 1: Select Package
      |-- Step 2: Enter Date, Location, Message
      |-- Step 3: Confirm
      |-- POST /bookings { packageId, eventDate, location, notes }
      |-- On success → /customer/event-dashboard
  → EventDashboard
      |-- GET /bookings/my → shows new booking with PENDING status
  → Click booking
  → BookingDetails?id=Y
      |-- GET /bookings/my → find booking by ID
      |-- Shows status, amounts, payment options
```

### Flow 2: Marketplace Purchase

```
Marketplace → Product Details
  → ProductDetails/:id
      |-- GET /products/:id → product details
      |-- POST /cart/add { productId, quantity }
      |-- POST /wishlist/add → wishlist (optional)
  → ShoppingCart
      |-- GET /cart → cart items
      |-- PUT /cart/item/:id → update quantity
      |-- DELETE /cart/item/:id → remove item
  → Checkout
      |-- Enter shipping address
      |-- POST /orders/checkout { shippingAddress }
      |-- On success → redirect to payment page
  → PaymentPage?orderId=X&amount=X
      |-- Select payment method (ONLINE or BANK_SLIP)
      |-- Enter card details or upload bank slip
      |-- POST /payments/pay { amount, paymentMethod, orderId }
      |-- On success → /customer/order-success
  → OrderSuccess?type=order&id=X
```

### Flow 3: Chat with Vendor

```
EventDashboard → "View Booking Details"
  → BookingDetails → "Contact Vendor" (UI only, no handler)
  -- OR --
ChatInbox → /customer/chat-inbox
  |-- GET /chat/conversations → list of conversations
  |-- Click a conversation
  → VendorChat/:conversationId
      |-- GET /chat/messages/:id → message history
      |-- Polls every 3 seconds
      |-- POST /chat/messages { conversationId, text } → send message
```

### Flow 4: Profile Update with Image Upload

```
AccountSettings
  |-- Select file (image)
  |-- createObjectURL → preview
  |-- Click "Save Changes"
      |-- POST /api/upload (FormData with file) → returns URL
      |-- PUT /api/customers/profile { name, profileImage: URL }
      |-- Update AuthContext + localStorage
      |-- Alert "Account settings saved successfully!"
```

---

## 7. Viva Questions & Answers

### Q1: Explain the Customer data model.

**Answer**: The `Customer` model in Prisma has 8 fields — `customerId` (auto-increment PK), `name`, `email` (unique), `password`, `contactNumber` (optional), `role` (default "customer"), `profileImage` (optional), and `registrationDate` (auto-set). It has 7 one-to-many relations: `Bookings`, `Orders`, `Reviews`, `Notifications`, `Wishlists`, `Conversations`, and a one-to-one `Cart` relation. The table is mapped to `customer` in PostgreSQL via `@@map`.

### Q2: How is authentication handled for customer routes?

**Answer**: The `protect` middleware in `auth.middleware.js` extracts the JWT from the `Authorization: Bearer <token>` header, verifies it with `jwt.verify()`, and sets `req.user = { id, role }`. The `customer.routes.js` applies `router.use(protect)` at the top, so all three endpoints require authentication. The frontend stores the JWT in `localStorage` and attaches it via an Axios request interceptor in `utils/api.js`.

### Q3: What does the dashboard stats endpoint return and how is it computed?

**Answer**: `GET /customers/dashboard-stats` returns 8 metrics. These are computed using 6 Prisma queries: 3 `count()` queries for active orders (not DELIVERED/CANCELLED), pending bookings (status PENDING), and upcoming events (status ACCEPTED with future date). Plus `findMany` for recent orders (last 3), upcoming booking list (next 3, with vendor includes), and recommended vendors (2 approved vendors). The `actionRequired` is computed client-side by filtering accepted bookings from the upcoming list.

### Q4: Explain the 3-step booking flow.

**Answer**: The booking flow in `BookVendor.jsx` has 3 steps managed by a `step` state variable. Step 1 shows the vendor's event packages fetched from `GET /vendors/:id`. Step 2 collects event date, location, and optional message. Step 3 shows the total and sends a `POST /bookings` request. A progress tracker with circles and connecting bars shows the current step. On success, the user is redirected to `/customer/event-dashboard`.

### Q5: How does the marketplace order flow work end-to-end?

**Answer**: The flow is: ProductDetails (browse + add to cart) → ShoppingCart (manage quantities, delete items) → Checkout (enter shipping address, place order) → PaymentPage (choose payment method, enter card or upload bank slip, pay) → OrderSuccess (confirmation with invoice download). Each step uses React Query for data fetching and mutations with cache invalidation.

### Q6: How is real-time chat implemented?

**Answer**: The chat uses **polling** rather than WebSockets. The `VendorChat.jsx` component uses `useQuery` with `refetchInterval: 3000`, which tells React Query to refetch messages every 3 seconds. Messages are fetched from `GET /chat/messages/:conversationId` and sent via `POST /chat/messages`. A `useRef` with `scrollIntoView` auto-scrolls to the bottom when new messages arrive.

### Q7: Explain React Query usage across the customer module.

**Answer**: `useQuery` is used for all data fetching (profile, dashboard stats, bookings, cart, orders, wishlist, chat, notifications). `useMutation` handles writes (profile update, cart operations, order placement, payment, reviews, messages). `queryClient.invalidateQueries()` refreshes related queries after mutations — for example, after adding to cart, the `['cart']` query is invalidated. Query keys follow a consistent pattern like `['customerProfile']`, `['customerDashboardStats']`, `['bookings']`, `['orders']`.

### Q8: How is the payment page structured?

**Answer**: `PaymentPage.jsx` supports two payment methods. **Online** collects card details (name, number, expiry, CVV) with client-side validation (16 digits, not expired, valid CVV). **Bank Slip** shows bank account details and a file upload for the receipt. Both send a `POST /payments/pay` request. For bank slips, the file is first uploaded via `POST /upload`, and the returned URL is included in the payment request. A `useMutation` handles the payment and redirects to the success page.

### Q9: What security measures are in place?

**Answer**: Passwords are hashed (via bcrypt in auth controller, not shown in customer module files). JWT tokens are stored in localStorage and attached via Axios interceptors. The `protect` middleware verifies tokens on every request. Profile update excludes password changes. Email is read-only in profile editing. Card validation is done client-side (no real card data sent to server). The `restrictTo` middleware provides role-based access control. 401 responses trigger automatic token clearing on the frontend.

### Q10: Explain the role of the AuthContext in the customer module.

**Answer**: `AuthContext` provides `user`, `login`, `register`, `logout`, and `setUser` to all components. On app mount, it checks localStorage for existing token and user data. Components like `CustomerDashboard` use `useAuth()` to access `user.name` for personalization. `ProfileManagement` and `AccountSettings` use `setUser` to update the context after profile edits. The context persists across page refreshes via localStorage.

### Q11: Compare ProfileManagement and AccountSettings.

**Answer**: Both handle customer profile editing but with different approaches. `ProfileManagement.jsx` uses React Query (`useQuery` + `useMutation`) for data fetching, has a sidebar navigation, and shows email as verified. `AccountSettings.jsx` is more manual — it uses raw `api` calls in an `async handleSave` function, includes profile image upload with preview, and adds theme toggling. AccountSettings manually updates both AuthContext and localStorage after save.

### Q12: How does the admin view customer data?

**Answer**: `AdminCustomerManagement.jsx` provides an admin-facing dashboard with aggregate metrics (active customers, average lifetime value, high-risk accounts) and a customer table showing financial data, activity, and risk scores. **However**, this component currently uses static mock data — there's no backend API for it yet. The risk scoring system (Low/High) with color-coded badges is defined but not connected to any real data source.
