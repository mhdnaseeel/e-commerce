# 🛒 NexCart - Professional E-Commerce Platform

NexCart is a high-performance, full-stack e-commerce solution designed with a modern **React** frontend and a robust **Spring Boot** backend. This project features a premium storefront, automated data seeding with high-quality assets, and integrated Stripe payments.

---

## 🚀 Quick Start

### 1. Backend (Spring Boot)
- **Port**: `8090`
- **Environment Variables Required**: `STRIPE_SECRET_KEY`
- **Run**:
  ```bash
  cd sb-ecom
  mvn spring-boot:run
  ```

### 2. Frontend (React + Vite)
- **Port**: `5173`
- **Run**:
  ```bash
  cd ecom-frontend
  npm run dev
  ```

---

## 🔐 Authentication & Roles

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` |
| **Seller** | `seller1` | `password2` |
| **User** | `user1` | `password1` |

---

## ✨ Key Features

- **🎨 Premium UI/UX**: Aesthetic storefront with high-quality photography and smooth micro-animations.
- **🔧 Automated Seeding**: The backend automatically initializes the database with professional product images and categories.
- **🖥️ Admin & Seller Panels**: Comprehensive dashboards for managing products, categories, sellers, and viewing store analytics.
- **👤 User Profile & History**: Dedicated customer dashboard for managing addresses and tracking order history.
- **💳 Secure Payments**: Integrated with **Stripe** for reliable and secure checkout flows.
- **📦 Infrastructure Stabilization**: Configured to run on stable default ports (`8090`/`5173`) with full environment synchronization.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Redux Toolkit, Material UI, Axios, React Router 6.
- **Backend**: Java 21, Spring Boot 3, Spring Security 6 (JWT), Spring Data JPA.
- **Database**: PostgreSQL (Dockerized).
- **DevOps**: Maven, npm.

---

## 📁 Project Structure

```bash
📦 E-Commerce
├── 📂 sb-ecom          # Spring Boot Backend Project
│   ├── 📂 images       # Served high-quality product assets
│   └── 📂 src          # Java source code & resources
└── 📂 ecom-frontend    # React Frontend Project
    ├── 📂 src          # Components, Hooks, Store, etc.
    └── 📜 .env         # Environment configuration
```

---

## 📝 Contact & Support
For any queries or support regarding this project, please reach out to the project administrator.

**Developed as a specialized high-performance storefront.**
