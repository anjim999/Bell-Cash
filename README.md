# 💰 Bell Cash - Modern Personal Expense Tracker

Bell Cash is a premium, full-stack expense management application designed for seamless financial tracking. Built with the MERN stack and styled with a state-of-the-art interface, it offers real-time insights into your spending habits.

![Banner](https://raw.githubusercontent.com/anjim999/Bell-Cash/main/frontend/public/logo-large.png) *(Note: Add your actual banner/logo path or placeholder)*

## ✨ Key Features

-   **Premium Dashboard**: Real-time visualization of income vs. expenses using dynamic charts.
-   **Transaction Management**: Categorize, filter, and track every penny with ease.
-   **Secure Authentication**: JWT-based secure login and registration system.
-   **Responsive Design**: Experience bit-perfect UI on mobile, tablet, and desktop.
-   **Smart Analytics**: Get breakdown of spending by categories (Food, Rent, Salary, etc.).

## 🚀 Tech Stack

-   **Frontend**: React.js, Tailwind CSS (v4), Vite, Recharts, React Router Dom.
-   **Backend**: Node.js, Express.js, MongoDB (Mongoose).
-   **Security**: JWT, Bcrypt, Helmet, Express Rate Limit.
-   **Deployment**: Optimized for Vercel.

## 🛠️ Project Structure

```text
Bellcorp/
├── frontend/          # React + Vite application
├── backend/           # Express API
└── vercel.json        # Vercel deployment configuration
```

## ⚙️ Setup & Installation

### Prerequisites
-   Node.js (v18+)
-   MongoDB Atlas account or local MongoDB

### 1. Clone the repository
```bash
git clone https://github.com/anjim999/Bell-Cash.git
cd Bell-Cash
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```
Run backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
```
Run frontend:
```bash
npm run dev
```

## 🌐 Deployment (Vercel)

The project is configured for easy deployment on Vercel. Just connect your GitHub repo and Vercel will auto-detect the settings.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [Anjim](https://github.com/anjim999)
