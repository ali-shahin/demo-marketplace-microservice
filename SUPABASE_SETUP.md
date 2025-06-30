# Supabase/Postgres Integration: General Setup for Microservices

This guide describes how to connect all marketplace microservices to a shared Supabase (Postgres) database.

## 1. Create a Supabase Project

- Go to https://supabase.com/ and create a new project.
- Note your database credentials and connection string ("Connection Pooling" recommended for production).

## 2. Environment Variable

- Each service should use a `DATABASE_URL` environment variable:
  ```
  DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<db>?sslmode=require
  ```
- Store this in a `.env` file or your deployment environment for each service.

## 3. Service Integration

- **Golang services:** Use `pgxpool` or `database/sql` with the `pgx` driver.
- **Laravel services:** Set `DB_CONNECTION=pgsql` and configure `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` in `.env`.
- **Node.js services:** Use `pg` or an ORM like `Prisma` or `Sequelize`.

## 4. Example Table Schema

- Example for a `users` table:
  ```sql
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
  ```
- Repeat for other entities (products, orders, etc.) as needed.

## 5. Health Check

- Each service should fail to start if it cannot connect to the database.
- Optionally, expose a `/health` endpoint to check DB connectivity.

## 6. Security

- Never commit `.env` files or credentials to version control.
- Use Supabase's built-in security features for authentication and access control as needed.

## 7. Documentation

- Document any service-specific queries, migrations, or schema changes in each service's README or a dedicated `SUPABASE.md`.

---

This setup ensures all microservices can reliably connect to a shared, scalable Postgres database via Supabase.
