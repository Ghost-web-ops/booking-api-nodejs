# Booking System API 🚀

A complete backend API for a booking system application built with Node.js, Express, Prisma, and TypeScript. This project includes features like secure authentication, role-based authorization, property and booking management, and advanced data validation.

## ✨ Key Features

- **Secure Authentication:** User registration and login with JWT (JSON Web Tokens).
- **Role-Based Authorization:** Middleware to protect routes for `USER` and `ADMIN` roles.
- **Full CRUD for Properties:** Admin-only endpoints to create, read, update, and delete properties.
- **Complex Booking Logic:** Endpoints for users to create, edit, and delete bookings with ownership checks and date conflict detection.
- **Advanced Validation:** Schema-based input validation using `zod`.
- **Database Seeding:** A script to automatically create an admin user.
- **Centralized Error Handling:** A single middleware to handle all application errors gracefully.
- **Pagination:** Scalable endpoints for fetching lists of data.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT, bcryptjs
- **Validation:** Zod
- **Infrastructure:** Docker

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- Docker (optional)

### Installation

1. **Clone the repository**

    ```bash
    git clone [https://github.com/Ghost-web-ops/booking-api-nodejs.git](https://github.com/Ghost-web-ops/booking-api-nodejs.git)
    cd booking-api-nodejs
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**
    - Create a `.env` file in the root directory.
    - Add the following variables (replace with your own values):

        ```env
        DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/YOUR_DB_NAME"
        JWT_SECRET="YOUR_SUPER_SECRET_KEY"
        ```

4. **Run database migrations**

    ```bash
    npx prisma migrate dev
    ```

5. **Seed the database** (This will create the first admin user)

    ```bash
    npx prisma db seed
    ```

6. **Start the development server**

    ```bash
    npm run dev
    ```

    The server will be available at `http://localhost:3000`.

## ⚙️ API Endpoints

A brief overview of the main API endpoints:

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in a user and get a JWT.
- `GET /api/properties`: Get a list of all properties.
- `POST /api/bookings`: Create a new booking (Authentication required).

For full details, please refer to the API documentation or the code.
# booking-api-nodejs
