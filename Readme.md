# TechFin Backend API

A backend service for TechFin, a SaaS platform helping users manage financial transactions.

---

## Project Overview

This service supports:

- Secure user signup, login via JWT
- Create new financial transactions
- Read & paginate transactions
- Edit existing transactions
- Soft-delete transactions

Designed for performance and maintainability.

---

## Tech Stack

- **Node.js + Express**: API server
- **TypeScript**: Type safety
- **Prisma ORM**: Data modeling and database access
- **Postgres**: Database for local development
- **JWT**: Authentication
- **Autocannon**: Performance testing

---

## Data Integrity with Versioning

Each transaction includes a `version` field which auto-increments on update.

- This ensures **optimistic concurrency control**.
- Prevents race conditions during concurrent edits.
- Can be used to reject outdated payloads from stale clients.

When editing a transaction:
```ts
await prisma.transaction.update({
  where: { id: "uuid", version: oldVersion },
  data: { amount: newAmount, version: { increment: 1 } }
});
```

If the `version` check fails, the update is ignored ensuring **write consistency**.

---

## Design Highlights

- **Separation of Concerns**: Authentication, database, and routes are modularized.
- **Soft Deletes**: Transactions are never permanently deleted, allowing recovery.
- **Prisma ORM**: Easily swappable to any SQL-compatible DB.
- **JWT Security**: Stateless sessions allow horizontal scaling.
- **Bulk Uploads**: Handles batch uploads.

---

## Setup & Running Locally

1.  **Clone the repository**
    ```sh
    git clone https://github.com/your-username/techfin-backend.git
    cd techfin-backend
    ```

2.  **Install dependencies**
    ```sh
    npm install
    ```

3.  **Set environment variables**
    Copy the example environment file and fill in your secret key.
    ```sh
    cp .env.example .env
    # Open .env and add your JWT_SECRET and DATABASE_URL
    ```

4.  **Initialize the database**
    ```sh
    npx prisma migrate dev --name init
    ```

5.  **Start the server**
    ```sh
    npm run dev
    ```

---

## API Overview

All endpoints require an `Authorization: Bearer <token>` header after a successful login.

### Auth

#### `POST /api/users/register`
Registers a new user.

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

#### `POST /api/users/login`
Logs in and returns a JWT token.

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

---

### Transactions

#### `POST /api/transactions`
Create a single transaction.

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"payee": "Netflix", "amount": 15.99, "category": "Entertainment", "date": "2025-06-01"}'
```

#### `GET /api/transactions`
Get a paginated list of transactions.

```bash
curl -X GET http://localhost:3000/api/transactions?page=1&limit=10 \
  -H "Authorization: Bearer <token>"
```

#### `PATCH /api/transactions/:id`
Edit an existing transaction.

```bash
curl -X PATCH http://localhost:3000/api/transactions/<id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"amount": 19.99}'
```

#### `DELETE /api/transactions/:id`
Soft-delete a transaction (recoverable).

```bash
curl -X DELETE http://localhost:3000/api/transactions/<id> \
  -H "Authorization: Bearer <token>"
```

---

### Bulk Upload

#### `POST /api/transactions/bulk-upload`
Bulk-create transactions.

```bash
curl -X POST http://localhost:3000/api/transactions/bulk-upload \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"transactions": [ {"payee": "Netflix", "amount": 15.99, "category": "Entertainment", "date": "2025-06-01"}, {"payee": "Amazon", "amount": 59.49, "category": "Shopping", "date": "2025-06-02"}, { "payee": "Uber", "amount": 9.75, "category": "Travel", "date": "2025-06-03"}]}'
```

---

## Potential Enhancements

- [ ] Redis caching for common queries
- [ ] Rate limiting middleware
- [ ] Swagger/OpenAPI docs

---

## Notes & Assumptions

- Each user sees only their transactions
