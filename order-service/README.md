# Order Service

This service manages order placement, payment processing, and order history for the marketplace platform.

## Database Integration (Supabase/Postgres)

-   Uses a Postgres-compatible database (e.g., Supabase) for persistent storage.
-   Connection is managed via Laravel's Eloquent ORM and configured in `.env`:

```
DB_CONNECTION=pgsql
DB_HOST=<host>
DB_PORT=<port>
DB_DATABASE=<database>
DB_USERNAME=<user>
DB_PASSWORD=<password>
```

## Table Schemas

### Orders Table

```sql
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Payments Table

```sql
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  amount NUMERIC(10,2) NOT NULL,
  provider VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Migrations

-   Migration files are located in `database/migrations/`.
-   Run migrations with:
    ```bash
    php artisan migrate
    ```

### Health Check

-   The `/health` endpoint (if implemented) should check database connectivity and return a status.

## Security

-   Never commit `.env` files or credentials to version control.
-   Use Supabase's security features for authentication and access control as needed.

---

For more details on general Supabase setup, see `../../SUPABASE_SETUP.md`.
