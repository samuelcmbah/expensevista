
# 🚀 ExpenseVista Frontend

A modern, responsive Personal Finance Tracking Platform built with **React**, **TypeScript**, and **Tailwind CSS**. This is the client-side application for the ExpenseVista full-stack project.

[![Status](https://img.shields.io/badge/status-active-success)](https://expensevista-frontend.vercel.app/)
[![Backend Repo](https://img.shields.io/badge/backend-.NET%208-purple)](https://github.com/samuelcmbah/ExpenseVista.API.git)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📸 Screenshots

| Dashboard | Analytics |
| :---: | :---: |
| ![Dashboard Screenshot](./screenshots/dashboard.png) | ![Analytics Screenshot](./screenshots/analytics.png) |

---

## 📘 Overview

ExpenseVista helps users track expenses, analyze spending patterns, and visualize their financial activity. This frontend provides a seamless user experience with interactive charts, real-time feedback, and secure authentication flows.

**Live Demo:** [https://expensevista-frontend.vercel.app/](https://expensevista-frontend.vercel.app/)

---

## 🛠️ Tech Stack

* **Core:** [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [ShadCN UI](https://ui.shadcn.com/)
* **State/Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (Validation)
* **HTTP Client:** [Axios](https://axios-http.com/)
* **Visualization:** [Recharts](https://recharts.org/)
* **Icons:** [Lucide React](https://lucide.dev/icons/)
* **Notifications:** [React Hot Toast](https://react-hot-toast.com/)
* **Routing:** [React Router DOM](https://reactrouter.com/)

---

## ✨ Features

* **Interactive Dashboard:** View monthly spending, recent transactions, and quick stats.
* **Data Visualization:** Beautiful bar and pie charts to analyze income vs. expenses.
* **Transaction Management:** Intuitive forms to add, edit, and delete transactions.
* **Smart Filtering:** Filter financial data by date, category, or transaction type.
* **Responsive Design:** Fully optimized for desktop, tablet, and mobile devices.
* **Secure Auth:** JWT-based login and registration with automatic token handling.

---

## 📁 Project Structure

```text
src/
 ├── components/     # Reusable UI components (Cards, Inputs, Charts)
 ├── context/        # React Context (Auth, Global State)
 ├── hooks/          # Custom Hooks
 ├── lib/            # Utility libraries (cn, axios instance)
 ├── pages/          # Route views (Dashboard, Login, Analytics)
 ├── schemas/        # Zod validation schemas
 ├── services/       # API call definitions
 ├── types/          # TypeScript interfaces
 └── utilities/      # Formatting helpers
```

## ⚙️ Installation & Setup
### Prerequisites
- Node.js (v18+)
- NPM or Yarn

### Steps

1. Clone the repository

```bash
git clone https://github.com/samuelcmbah/expensevista.git
cd expensevista
```

2. Install Dependencies
```bash
npm install
```

3. Configure Environment Variables
Create a .env file in the root directory:
```env
VITE_API_URL=https://localhost:7000/api
```
Replace with the live backend URL if not running locally
```env
VITE_API_URL=https://expensevista-api.onrender.com/api
```

4. Run the Development Server
```bash
npm run dev
```

## 🚀 Deployment
The frontend is deployed on Vercel for optimal performance and continuous deployment.

## 🤝 Contributions
Contributions are welcome! Please fork the repository and submit a pull request.

## 🧑‍💻 Author
**Samuel Mbah**
- GitHub: [samuelcmbah](https://github.com/samuelcmbah)
- LinkedIn: [Samuel Mbah](https://linkedin.com/in/samuelcmbah)





