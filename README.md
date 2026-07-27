# E-Commerce Project

A full-stack e-commerce application built with React, Node.js/Express, and PostgreSQL. This project extends a previously built REST API with a complete, interactive client, covering authentication, product browsing, cart management, payment processing, and order history.

**Live demo:** https://ecommerce-project-d4l8.onrender.com

## Features

- **User authentication**
  - Register/login with username and password (bcrypt password hashing)
  - Google OAuth 2.0 login
  - Session-based authentication (Passport.js + express-session)
  - Logout
- **Product catalog**
  - Browse all products with images, descriptions, and pricing
  - View detailed product pages
- **Shopping cart**
  - Add and remove items
  - Cart persists per logged-in user
- **Checkout**
  - Real payment processing via Stripe (Payment Intents + Stripe Elements)
  - Order confirmation and cart clearing on successful payment
- **Order history**
  - View past orders and their line items
- **Protected routes**
  - Cart, checkout, and order endpoints require authentication (both frontend and backend enforcement)

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router 7
- Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- Context API for cart state management

**Backend**
- Node.js + Express 5
- PostgreSQL (`pg`)
- Passport.js (local strategy + Google OAuth 2.0)
- bcrypt for password hashing
- express-session for session management
- Stripe for payment processing
- Swagger/OpenAPI documentation

**Infrastructure**
- Deployed on Render (Web Service for the API, Static Site for the client, managed PostgreSQL)

## Project Structure

ecommerce/
├── ecommerce-api/ # Backend (Express + PostgreSQL)
│ ├── app.js
│ ├── db.js
│ ├── passportConfig.js
│ ├── openapi.yaml
│ └── public/images/
└── ecommerce-client/ # Frontend (React + Vite)
└── src/
├── pages/
├── components/
├── context/
└── services/


## Getting Started Locally

### Prerequisites
- Node.js
- PostgreSQL
- A Stripe account (test mode)
- A Google Cloud project with OAuth 2.0 credentials

### Backend setup

```bash
cd ecommerce-api
npm install
```

Create a `.env` file with:

DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=your_stripe_secret_key


Run the server:

```bash
npm run dev
```

API docs available at `http://localhost:3000/api-docs`.

### Frontend setup

```bash
cd ecommerce-client
npm install
```

Create a `.env` file with:

VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key


Run the dev server:

```bash
npm run dev
```

## API Overview

| Resource | Endpoints |
|---|---|
| Auth | `POST /register`, `POST /login`, `GET /auth/google`, `GET /me`, `POST /logout` |
| Products | `GET/POST /products`, `GET/PUT/DELETE /products/:id` |
| Cart | `POST /cart`, `GET/POST /cart/:cartId`, `DELETE /cart/:cartId/items/:itemId`, `GET /cart/user/:userId` |
| Checkout | `POST /create-payment-intent`, `POST /cart/:cartId/checkout` |
| Orders | `GET /orders`, `GET /orders/:orderId` |

Full API documentation available via Swagger at `/api-docs`.

## Testing Payments

Use Stripe's test card numbers in test mode:

Card number: 4242 4242 4242 4242
Expiry: any future date
CVC: any 3 digits


## Author

Henrique Andraus
- GitHub: [@henriqueandraus](https://github.com/henriqueandraus)
