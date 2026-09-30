# Error Handling

All error responses go through the global `errorHandler` middleware and share one JSON shape: `{ status, error, details? }`. Bodies below are real output captured from a running server.

### 404 — `GET /bookings/999` (unknown id → `NotFoundError`)
```json
{ "status": "fail", "error": "Booking not found" }
```

### 400 — `POST /bookings` (desk name under 3 chars → `BadRequestError`)
```json
{ "status": "fail", "error": "Desk name must be at least 3 characters long" }
```

### 500 — unexpected, non-operational error (e.g. a bug, not a thrown `AppError`)
```json
{ "status": "error", "error": "Something went wrong on our end" }
```

`status` is `"fail"` for 4xx and `"error"` for 5xx (set in [appError.ts](../src/utils/appError.ts)); every branch of `errorHandler` fills in the same two fields, so callers can rely on one shape regardless of which error type fired.

## Proof a 500 leaks no stack trace or file path

The unexpected error above was triggered from a route that throws:
```
Error: Unexpected failure while reading /Users/dev/cospace-backend/src/repositories/booking.repository.ts
```

Server console (`console.error(err.stack)` inside `errorHandler`) printed the full trace with absolute file paths:
```
Error: Unexpected failure while reading /Users/dev/cospace-backend/src/repositories/booking.repository.ts
    at .../src/index.ts:17:9
    at Layer.handleRequest (.../node_modules/router/lib/layer.js:152:17)
    at next (.../node_modules/router/lib/route.js:157:13)
    ...
```

The HTTP response body the client actually received was only:
```json
{ "status": "error", "error": "Something went wrong on our end" }
```

No file path, line number, or stack frame appears in the response — that detail exists solely in the server log, gated behind the `err.isOperational` check that separates trusted `AppError`s from unexpected ones.

## Why `Object.setPrototypeOf` is needed

TypeScript classes that `extend Error` (and subclasses that extend `AppError`) can lose their prototype link when compiled/transpiled, causing `err instanceof AppError` to evaluate `false` at runtime — without `Object.setPrototypeOf(this, new.target.prototype)`, an operational `NotFoundError` would fail the `AppError` check in `errorHandler` and fall through to the generic 500 branch instead of returning its correct 404.
