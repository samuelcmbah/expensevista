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

ExpenseVista helps users track expenses, analyze spending patterns, and visualize their financial activity. This frontend provides a seamless user experience with interactive charts, real-time feedback, and a highly secure, persistent authentication flow.

**Live Demo:** [https://expensevista-frontend.vercel.app/](https://expensevista-frontend.vercel.app/)

---

## 🛠️ Tech Stack

*   **Core:** [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [ShadCN UI](https://ui.shadcn.com/)
*   **State/Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (Validation)
*   **HTTP Client:** [Axios](https://axios-http.com/) (with custom interceptors for auth)
*   **Visualization:** [Recharts](https://recharts.org/)
*   **Icons:** [Lucide React](https://lucide.dev/icons/)
*   **Notifications:** [React Hot Toast](https://react-hot-toast.com/)
*   **Routing:** [React Router DOM](https://reactrouter.com/)

---

## ✨ Features

*   **Interactive Dashboard:** View monthly spending, recent transactions, and quick stats.
*   **Data Visualization:** Beautiful bar and pie charts to analyze income vs. expenses.
*   **Transaction Management:** Intuitive forms to add, edit, and delete transactions.
*   **Smart Filtering:** Filter financial data by date, category, or transaction type.
*   **Responsive Design:** Fully optimized for desktop, tablet, and mobile devices.
*   **Advanced & Secure Authentication:** A robust implementation using **JWT Refresh Token Rotation**. Features include secure `HttpOnly` cookie storage, automatic session renewal, and instant server-side logout for a seamless and secure user experience.

---

## 🔐 Authentication Flow

To provide a secure and persistent user session, this application implements a JWT Access + Refresh Token strategy.

The process is managed by a custom Axios instance and React Context:

1.  **Login:** Upon successful login, the API returns a short-lived **Access Token** and a long-lived **Refresh Token**.
    *   The Access Token is stored in memory.
    *   The Refresh Token is stored in a secure, `HttpOnly` cookie, making it inaccessible to client-side JavaScript.
2.  **Authenticated Requests:** A global Axios interceptor automatically attaches the Access Token to the `Authorization` header of every outgoing request.
3.  **Handling Expiration:** If an API request fails with a `401 Unauthorized` status, the interceptor catches the error.
4.  **Silent Refresh:** The interceptor pauses all other pending API calls and sends a request to the `/auth/refresh` endpoint (the browser automatically includes the `HttpOnly` refresh token cookie).
5.  **Session Renewal:** The backend validates the refresh token, revokes it, and issues a *new* pair of access and refresh tokens (Token Rotation).
6.  **Retry & Resume:** The interceptor updates the stored Access Token and automatically retries the original failed request. All queued requests are then processed. The user experiences no interruption.

---

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   NPM or Yarn

### Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/samuelcmbah/expensevista.git
    cd expensevista
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory by copying the example file:
    ```bash
    cp .env.example .env.local
    ```
    Then, update the `VITE_API_URL` in `.env.local` to point to your backend.
    
    **For local development:**
    ```env
    VITE_API_URL=https://localhost:7000/api
    ```
    **For the live backend:**
    ```env
    VITE_API_URL=https://expensevista-api.onrender.com/api
    ```

4.  **Run the Development Server:**
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
