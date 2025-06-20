# 🛒 E-Commerce Full Stack Web App

A fully functional full-stack e-commerce platform with user and admin roles, product and category management, and wishlist support.

---

## 🔧 Tech Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Frontend  | React, Axios, Bootstrap  |
| Backend   | Node.js, Express         |
| Database  | MySQL with Sequelize ORM |
| Auth      | JWT (JSON Web Token)     |

---

## 🚀 Features

### 👤 User Features
- Register and login (JWT authentication)
- Add, update, and delete **own products**
- View all products (with pagination)
- Add/remove products to/from **wishlist**
- Filter products by category

### 🛠️ Admin Features
- Login as admin (default user seeded)
- View/add/edit/delete **admins**
- View and delete **users**
- View and delete **products**
- Full **category CRUD** (supports nesting up to 3 levels)

---

## ⚙️ Installation Guide

### 📁 1. Clone Repository

```bash
git clone https://github.com/mohamed39walid/AUVNET-Backend-Internship-Assessment.git
cd AUVNET-Backend-Internship-Assessment
```

---

### 📦 2. Backend Setup

```bash
cd Backend
npm install
cp .env.example .env
```

Edit `.env` file:

```
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=8889
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=ecommerce
JWT_SECRET=your_jwt_secret
```

Then run:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all   # Seeds the default admin account
npm run dev
```

---

### 💻 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

The frontend will start at:  
[http://localhost:3000](http://localhost:3000)

---

## 🧪 Seed Admin Account

After migrations, you can create a default admin using:

```bash
npx sequelize-cli db:seed:all
```

The default admin account is:
- **Username:** `admin`
- **Password:** `admin`

---

## 📚 API Endpoints

### ✅ Auth Routes
| Method | Endpoint            | Access       |
|--------|---------------------|--------------|
| POST   | /api/auth/register  | Public       |
| POST   | /api/auth/login     | Public       |

---

### 📦 Products
| Method | Endpoint             | Access           |
|--------|----------------------|------------------|
| GET    | /api/products        | Public           |
| POST   | /api/products        | Authenticated    |
| PUT    | /api/products/:id    | Owner/Admin      |
| DELETE | /api/products/:id    | Owner/Admin      |

---

### 🧡 Wishlist
| Method | Endpoint                    | Access     |
|--------|-----------------------------|------------|
| GET    | /api/wishlist               | Auth       |
| POST   | /api/wishlist               | Auth       |
| DELETE | /api/wishlist/:productId    | Auth       |

---

### 🗂️ Categories
| Method | Endpoint                   | Access      |
|--------|----------------------------|-------------|
| GET    | /api/categories            | Public      |
| POST   | /api/categories            | Admin only  |
| PUT    | /api/categories/:id        | Admin only  |
| DELETE | /api/categories/:id        | Admin only  |

---

### 🔐 Admin Panel
| Method | Endpoint                      | Access     |
|--------|-------------------------------|------------|
| GET    | /api/admin/admins             | Admin      |
| POST   | /api/admin/admins             | Admin      |
| PUT    | /api/admin/admins/:id         | Admin      |
| DELETE | /api/admin/admins/:id         | Admin      |
| GET    | /api/admin/users              | Admin      |
| DELETE | /api/admin/users/:id          | Admin      |
| GET    | /api/admin/products           | Admin      |
| DELETE | /api/admin/products/:id       | Admin      |

---

## 🧪 Postman Testing

For routes that require authentication, send the JWT token in headers:

```http
Authorization: Bearer <your_token>
```

---

## 📂 Project Structure

```
ecommerce-app/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middlewares/
│   ├── config/
│   ├── migrations/
│   └── seeders/
│
└── frontend/
    ├── src/
        ├── components/
        ├── pages/
        └── api/axios.js
```

---

## 🧠 Notes

- Category nesting supports up to 3 levels using parent-child structure.
- Wishlist is limited to **25 items per user** with appropriate error handling.
- Admin role check is enforced on backend routes using middleware.

---

