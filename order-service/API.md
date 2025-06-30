# Order Service API Documentation

## POST /api/orders

Place a new order and process payment.

### Request Body

```
{
  "user_id": 1,
  "items": [
    {
      "product_id": 1,
      "name": "Test Product",
      "price": 10.0,
      "quantity": 2
    }
  ],
  "total": 20.0,
  "payment_provider": "mockpay"
}
```

#### Field Validation

-   `user_id`: integer, required, must exist in users table
-   `items`: array, required, at least 1 item
    -   `product_id`: integer, required
    -   `name`: string, required
    -   `price`: numeric, required, min 0
    -   `quantity`: integer, required, min 1
-   `total`: numeric, required, min 0
-   `payment_provider`: string, required

#### Advanced Validation

-   The `total` must match the sum of each item's `price * quantity` (with a small float tolerance).

### Success Response (201)

```
{
  "order": {
    "id": 1,
    "user_id": 1,
    "items": "[ ... ]", // JSON-encoded array
    "total": 20.0,
    "status": "pending",
    "created_at": "...",
    "updated_at": "..."
  },
  "payment": {
    "id": 1,
    "order_id": 1,
    "amount": 20.0,
    "provider": "mockpay",
    "status": "completed",
    "transaction_id": "txn_...",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

### Error Responses

#### 422 Unprocessable Entity (Validation Error)

-   Example: total does not match sum of item prices

```
{
  "error": "Total does not match sum of item prices."
}
```

#### 500 Internal Server Error

-   Example: Order creation or payment processing fails

```
{
  "error": "Order creation failed",
  "details": "..."
}
```

```
{
  "error": "Payment processing failed",
  "details": "..."
}
```

### Notes

-   If payment fails, the order is rolled back and not persisted.
-   For real-world use, product prices should be fetched from the Product Service, not provided by the client.
-   This API is covered by automated tests in `tests/Feature/OrderControllerTest.php`.
