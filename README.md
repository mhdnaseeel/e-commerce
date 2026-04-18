# 🛒 NexCart - Professional E-Commerce Platform

NexCart is a high-performance, full-stack e-commerce solution designed with a modern **React** frontend and a robust **Spring Boot** backend. This project features a premium storefront, automated data seeding with high-quality assets, fully dynamic profile editing, and integrated Stripe payments.

---

## 🚀 Quick Start

### 1. Backend (Spring Boot)
- **Permanent Port**: `8082`
- **Environment Variables Required**: `STRIPE_SECRET_KEY`
- **Run**:
  ```bash
  cd sb-ecom
  mvn spring-boot:run
  ```

### 2. Frontend (React + Vite)
- **Port**: `5173`
- **Environment API URL**: `http://localhost:8082`
- **Run**:
  ```bash
  cd ecom-frontend
  npm run dev
  ```

---

## 🔐 Authentication & Roles

By default, the backend securely seeds the following administrative users out of the box so you can immediately explore all features:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` |
| **Seller** | `seller1` | `password2` |
| **User** | `user1` | `password1` |

---

## ✨ Key Features

- **🎨 Premium UI/UX**: Aesthetic storefront with high-quality photography and smooth micro-animations built heavily on TailwindCSS.
- **👤 Dynamic User Profile**: Recently shipped with deep Profile Customization. Users can now upload **profile avatars** and edit their username and email dynamically without ever needing to reload the webpage, handled seamlessly through secure Redux background state updates!
- **🔧 Automated Seeding**: The backend automatically initializes the database with professional product images, categories, and dummy profile data.
- **🖥️ Admin & Seller Panels**: Comprehensive restricted dashboards for managing products, categories, sellers, and viewing store analytics.
- **💳 Secure Payments & Order Tracking**: Integrated directly with **Stripe** for reliable and secure checkout flows and a persistent Order History ledger.
- **📦 Reliable Configuration**: Stably routed entirely through Port `8082` across both the environment architecture and frontend `.env` config.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Redux Toolkit, TailwindCSS, Axios, React Router 6.
- **Backend**: Java 21, Spring Boot 3, Spring Security 6 (JWT), Spring Data JPA.
- **Database**: PostgreSQL (Dockerized).
- **DevOps**: Maven, npm.

---

## 📁 Project Structure

```bash
📦 E-Commerce
├── 📂 sb-ecom          # Spring Boot Backend Project
│   ├── 📂 images       # Served high-quality product assets and uploaded profile avatars
│   └── 📂 src          # Java source code & resources
└── 📂 ecom-frontend    # React Frontend Project
    ├── 📂 src          # Components, Hooks, Store, etc.
    └── 📜 .env         # Environment configuration
```

---

## 📝 Contact & Support
For any queries or support regarding this project, please reach out to the project administrator.

**Developed as a specialized high-performance storefront.**
