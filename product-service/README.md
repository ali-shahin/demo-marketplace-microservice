# Product Service

This service manages product listings, categories, inventory, and search for the marketplace platform.

## Database Integration (Supabase/Postgres)

- Uses a Postgres-compatible database (e.g., Supabase) for persistent storage.
- Connection is managed via the `database/sql` package and the `lib/pq` driver.
- Connection parameters are set via environment variables:

```
DB_HOST=<host>
DB_PORT=<port>
DB_USER=<user>
DB_PASSWORD=<password>
DB_NAME=<database>
```

## Product Table Schema

```sql
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Migrations

- Migration files are located in `migrations/`.
- Apply migrations using your preferred tool or manually in Supabase SQL editor.

### Health Check

- The `/health` endpoint checks database connectivity and returns a status.

## Endpoints

- `POST /products` — Create a new product
- `GET /products/:id` — Get product by ID
- `PUT /products/:id` — Update product
- `DELETE /products/:id` — Delete product
- `GET /products` — List/search products
- `GET /health` — Health check (DB connectivity)

## Security

- Never commit `.env` files or credentials to version control.
- Use Supabase's security features for authentication and access control as needed.

---

For more details on general Supabase setup, see `../../SUPABASE_SETUP.md`.
