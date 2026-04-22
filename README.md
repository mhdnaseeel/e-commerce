# 🛒 NexCart — Full-Stack E-Commerce Platform

<div align="center">

**A production-ready, full-stack e-commerce solution built with React and Spring Boot.**

[![Frontend](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Backend](https://img.shields.io/badge/Backend-Spring_Boot_3-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Database](https://img.shields.io/badge/Database-PostgreSQL_15-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Payments](https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe&logoColor=white)](https://stripe.com)

</div>

---

## ✨ Features

### 🛍️ Storefront
- **Hero Banner** with Swiper-powered carousel
- **Product Catalog** with filtering by category, price range, and pagination
- **Product Detail Modals** with image previews and add-to-cart
- **Shopping Cart** with quantity management and persistent state via localStorage

### 💳 Checkout & Payments
- **Multi-step Checkout** — Address selection → Payment method → Order confirmation
- **Stripe Integration** — Secure credit/debit card payments with Stripe Elements
- **PayPal Integration** — Alternative payment option via PayPal SDK
- **Address Management** — Add, edit, and delete shipping addresses per user

### 👤 User Profile
- **Profile Customization** — Avatar upload, full name, phone number, email editing
- **Change Password** — Secure password update with current password verification
- **Email Preferences** — Toggle marketing, order update, and promotional emails
- **Account Deactivation** — Request-based deactivation with admin approval workflow
- **Order History** — View all past orders with status, items, and pricing details
- **Invoice Generation** — Print-ready invoices directly from order history
- **Order Tracking** — Real-time visual tracker showing order progress with admin-provided tracking details

### 🔧 Admin Dashboard
- **Analytics Overview** — Revenue, total orders, products count, and users at a glance
- **Product Management** — Full CRUD with image upload for product catalog
- **Category Management** — Create, update, and delete product categories
- **Order Management** — View all orders, update status (Pending → Processing → Shipped → Delivered), and provide tracking information visible to customers
- **Seller Management** — Register and manage seller accounts
- **User Management** — Review and approve/reject account deactivation requests

### 🔐 Authentication & Authorization
- **JWT-based Authentication** — Stateless, secure token auth with HTTP-only cookies
- **Role-Based Access Control** — Three roles: `USER`, `SELLER`, `ADMIN`
- **Protected Routes** — Frontend route guards and backend endpoint security
- **Auto-seeded Accounts** — Ready-to-use demo accounts on first run

---

## 🚀 Quick Start

### Prerequisites
- **Java 21** (JDK)
- **Node.js 18+** & npm
- **Docker** (for PostgreSQL) or a local PostgreSQL 15 instance
- **Stripe Account** (for payment integration)

### 1. Start the Database

```bash
docker-compose up -d
```

### 2. Start the Backend

```bash
cd sb-ecom
# Set your Stripe secret key
export STRIPE_SECRET_KEY=sk_test_your_key_here
mvn spring-boot:run
```

> Backend runs on **http://localhost:8082**

### 3. Start the Frontend

```bash
cd ecom-frontend
npm install
npm run dev
```

> Frontend runs on **http://localhost:5173**

---

## 🔑 Demo Accounts

The backend auto-seeds three demo accounts on first launch:

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Full access — dashboard, products, orders, users, sellers, categories |
| **Seller** | `seller1` | `password2` | Seller dashboard — manage own products and view related orders |
| **User** | `user1` | `password1` | Storefront — browse, purchase, track orders, manage profile |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
| :--- | :--- |
| React 18 | UI library |
| Vite 5 | Build tool & dev server |
| Redux + React-Redux | Global state management |
| React Router 7 | Client-side routing |
| TailwindCSS 4 | Utility-first styling |
| MUI (Material UI) 6 | Data tables & form controls |
| Headless UI | Accessible modals & dialogs |
| Stripe Elements | Payment card input |
| PayPal React SDK | PayPal checkout |
| Axios | HTTP client |
| React Hook Form | Form validation |
| Swiper | Hero carousel |
| React Hot Toast | Notifications |
| React Icons | Icon library |

### Backend
| Technology | Purpose |
| :--- | :--- |
| Java 21 | Language runtime |
| Spring Boot 3.5 | Application framework |
| Spring Security 6 | Authentication & authorization (JWT) |
| Spring Data JPA | ORM & database access |
| PostgreSQL 15 | Production database |
| Stripe Java SDK | Payment processing |
| PayPal Checkout SDK | PayPal payment processing |
| ModelMapper | DTO ↔ Entity mapping |
| Lombok | Boilerplate reduction |
| SpringDoc OpenAPI | API documentation (Swagger UI) |

### DevOps
| Technology | Purpose |
| :--- | :--- |
| Docker Compose | PostgreSQL containerization |
| Vercel | Frontend deployment |
| Maven | Backend build tool |

---

## 📁 Project Structure

```
📦 E-Commerce/
├── 📂 sb-ecom/                         # Spring Boot Backend
│   ├── 📂 src/main/java/.../
│   │   ├── 📂 config/                  # App constants & configuration
│   │   ├── 📂 controller/              # REST API endpoints
│   │   │   ├── AddressController        # Address CRUD
│   │   │   ├── AdminController          # User deactivation management
│   │   │   ├── AuthController           # Login, register, JWT
│   │   │   ├── CartController           # Cart operations
│   │   │   ├── CategoryController       # Category CRUD
│   │   │   ├── OrderController          # Orders, status & tracking
│   │   │   ├── ProductController        # Product CRUD & image upload
│   │   │   └── PaypalController         # PayPal integration
│   │   ├── 📂 model/                   # JPA Entities
│   │   ├── 📂 payload/                 # DTOs & API responses
│   │   ├── 📂 repositories/            # Spring Data repositories
│   │   ├── 📂 security/                # JWT, CORS, WebSecurity config
│   │   ├── 📂 service/                 # Business logic layer
│   │   └── 📂 exceptions/              # Custom exception handlers
│   ├── 📂 images/                       # Uploaded product & avatar images
│   └── 📜 pom.xml                       # Maven dependencies
│
├── 📂 ecom-frontend/                    # React Frontend
│   ├── 📂 src/
│   │   ├── 📂 api/                     # Axios instance & interceptors
│   │   ├── 📂 components/
│   │   │   ├── 📂 admin/               # Admin dashboard, products, orders, sellers, categories, users
│   │   │   ├── 📂 auth/                # Login & Register pages
│   │   │   ├── 📂 cart/                # Shopping cart UI
│   │   │   ├── 📂 checkout/            # Address, payment, order confirmation
│   │   │   ├── 📂 home/                # Landing page & hero banner
│   │   │   ├── 📂 products/            # Product listing & filters
│   │   │   ├── 📂 profile/             # User profile, orders, tracking, invoices
│   │   │   └── 📂 shared/              # Reusable components (Navbar, Loader, Modals, etc.)
│   │   ├── 📂 hooks/                   # Custom React hooks
│   │   ├── 📂 store/                   # Redux store, actions & reducers
│   │   └── 📂 utils/                   # Helper functions & sidebar config
│   ├── 📜 .env                          # Environment variables
│   ├── 📜 vercel.json                   # Vercel SPA rewrite rules
│   └── 📜 package.json                  # npm dependencies
│
├── 📜 docker-compose.yml                # PostgreSQL container setup
└── 📜 README.md
```

---

## ⚙️ Environment Variables

### Frontend (`.env`)
```env
VITE_BACK_END_URL=http://localhost:8082
VITE_FRONTEND_URL=http://localhost:5173
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### Backend (`application.properties`)
```properties
STRIPE_SECRET_KEY=sk_test_...
```

---

## 📡 API Endpoints

### Public
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signin` | User login |
| `POST` | `/api/auth/signup` | User registration |
| `GET` | `/api/public/products` | Browse products |
| `GET` | `/api/public/categories` | Browse categories |

### User (Authenticated)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users/addresses` | Get user's addresses |
| `POST` | `/api/addresses` | Add a new address |
| `PUT` | `/api/users/profile` | Update profile |
| `POST` | `/api/users/profile/avatar` | Upload avatar |
| `GET` | `/api/users/orders` | Get order history |
| `POST` | `/api/order/users/payments/{method}` | Place an order |
| `POST` | `/api/order/stripe-client-secret` | Create Stripe payment intent |

### Admin
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/orders` | View all orders |
| `PUT` | `/api/admin/orders/{id}/status` | Update order status & tracking |
| `GET` | `/api/admin/users/deactivation-requests` | View deactivation requests |
| `PUT` | `/api/admin/users/{id}/deactivate` | Approve/reject deactivation |
| `POST` | `/api/admin/categories` | Create category |
| `CRUD` | `/api/admin/products/**` | Full product management |

---

## 📝 License

This project is developed as a specialized high-performance e-commerce storefront.

For any queries or support, please reach out to the project administrator.
