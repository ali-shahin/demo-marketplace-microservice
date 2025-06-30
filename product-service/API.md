# Product Service API Documentation

## GET /products

Retrieve a list of products with optional search and filtering.

### Query Parameters

- `name` (string): Filter by product name (case-insensitive, partial match)
- `min_price` (number): Minimum price
- `max_price` (number): Maximum price
- `stock` (integer): Exact stock value

### Example Requests

- `/products?name=apple`
- `/products?min_price=10&max_price=100`
- `/products?stock=0`
- `/products?name=fruit&min_price=1&max_price=5&stock=10`

### Example Response

```
[
  {
    "id": 1,
    "name": "Apple",
    "description": "Fresh apple",
    "price": 1.99,
    "stock": 10,
    "created_at": "2025-06-30T10:00:00Z",
    "updated_at": "2025-06-30T10:00:00Z"
  },
  ...
]
```

### Error Responses

- `400 Bad Request`: Invalid query parameter (e.g., non-numeric min_price)
- `500 Internal Server Error`: Database or server error

---

## GET /products/:id

Retrieve a single product by its ID.

### Example Request

- `/products/1`

### Example Response

```
{
  "id": 1,
  "name": "Apple",
  "description": "Fresh apple",
  "price": 1.99,
  "stock": 10,
  "created_at": "2025-06-30T10:00:00Z",
  "updated_at": "2025-06-30T10:00:00Z"
}
```

### Error Responses

- `404 Not Found`: Product not found
- `500 Internal Server Error`: Database or server error

---

## POST /products

Create a new product.

### Request Body

```
{
  "name": "Apple",
  "description": "Fresh apple",
  "price": 1.99,
  "stock": 10
}
```

### Example Response

```
{
  "id": 1,
  "name": "Apple",
  "description": "Fresh apple",
  "price": 1.99,
  "stock": 10,
  "created_at": "2025-06-30T10:00:00Z",
  "updated_at": "2025-06-30T10:00:00Z"
}
```

### Error Responses

- `400 Bad Request`: Invalid or missing fields
- `500 Internal Server Error`: Database or server error

---

## PUT /products/:id

Update an existing product by its ID.

### Request Body

```
{
  "name": "Apple",
  "description": "Updated description",
  "price": 2.49,
  "stock": 8
}
```

### Example Response

```
{
  "id": 1,
  "name": "Apple",
  "description": "Updated description",
  "price": 2.49,
  "stock": 8,
  "created_at": "2025-06-30T10:00:00Z",
  "updated_at": "2025-06-30T12:00:00Z"
}
```

### Error Responses

- `400 Bad Request`: Invalid or missing fields
- `404 Not Found`: Product not found
- `500 Internal Server Error`: Database or server error

---

## DELETE /products/:id

Delete a product by its ID.

### Example Request

- `/products/1`

### Example Response

- `204 No Content`

### Error Responses

- `500 Internal Server Error`: Database or server error

---

For more endpoints and details, see the main README or other service-specific docs.
