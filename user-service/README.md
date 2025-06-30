# User Service

This service manages user registration, authentication, and profile management for the marketplace platform.

## Database Integration (Supabase/Postgres)

- Uses a Postgres-compatible database (e.g., Supabase) for persistent storage.
- Connection is managed via the `pgxpool` driver and a `DATABASE_URL` environment variable.

### Environment Variable

```
DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<db>?sslmode=require
```

### User Table Schema

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
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

- `POST /register` — Register a new user
- `POST /login` — Authenticate and receive a JWT
- `GET /health` — Health check (DB connectivity)

## Security

- Never commit `.env` files or credentials to version control.
- Use Supabase's security features for authentication and access control as needed.

---

For more details on general Supabase setup, see `../../SUPABASE_SETUP.md`.
