# Token Route Access Guide

This guide is for an AI agent to fetch data from the token-secured read-only routes under /api/v1/token/*. All routes share tokenMiddleware, which validates a stored access token before the controllers in src/modules/common/token.route.ts run.

## Prerequisites

1. Admin-generated token – Create or fetch a token with the admin-only access-token endpoints in src/modules/access-token/access-token.route.ts. They require authMiddleware.verifyAuth(ENUM_ROLE.ADMIN).
2. Bearer header – Every /token route requires Authorization: Bearer <token> (verified by src/middlewares/tokenMiddleware.ts). Missing or bad tokens return 401.
3. Base URL – Production: https://api.sitepins.com/api/v1 (swap if you run locally).

## Authentication Implementation
For internal services, use the following environment variables (defined in `.env.local`):

- `NEXT_PUBLIC_SITE_PINS_API_TOKEN`: The bearer access token provided.
- `NEXT_PUBLIC_SITE_PINS_API_BASE_URL`: The base URL for the API.

Always include the `Authorization: Bearer <token>` header in requests.

## Routes and Payloads

### Users
- GET /api/v1/token/users – Pagination (page, limit); filters search, country (comma-separated). Returns list and meta.
  Request: /api/v1/token/users?page=1&limit=20&search=smith&country=US,CA

```json
{
  "success": true,
  "statusCode": 200,
  "result": [{ "_id": "u123", "email": "alice@example.com", "country": "US" }],
  "meta": { "page": 1, "limit": 20, "total": 42 },
  "message": "data get successfully"
}
```

- GET /api/v1/token/user/:id – Single user by _id.
- GET /api/v1/token/user-log/:userId – User log by user ID.

### Orders
- GET /api/v1/token/orders – Filters search, package, status (comma-separated) plus pagination.
  Request: /api/v1/token/orders?page=1&limit=10&status=paid,trial&package=starter

```json
{
  "success": true,
  "statusCode": 200,
  "result": [{ "_id": "ord1", "status": "paid", "package": "starter" }],
  "meta": { "page": 1, "limit": 10, "total": 5 },
  "message": "data get successfully"
}
```

- GET /api/v1/token/order/:id – Single order by _id.

### Organizations
- GET /api/v1/token/organizations – Forwards query params (e.g., owner_id, status) with pagination.
- GET /api/v1/token/organization/:org_id – Organization by org_id; optional owner_id.
- GET /api/v1/token/organization/user – Organizations for authenticated user (or override with userId).

### Projects
- GET /api/v1/token/projects – Forwards req.query to projectService (orgId, status, etc.).
- GET /api/v1/token/project/:projectId – Single project by project_id.

### Project Logs
- GET /api/v1/token/project-log/:project_id – Requires project_id; supports pagination (page, limit).

```json
{
  "success": true,
  "statusCode": 200,
  "result": [{ "project_id": "proj-xyz", "event": "deploy", "timestamp": "2024-01-01T12:00:00Z" }],
  "meta": { "page": 1, "limit": 50, "total": 120 },
  "message": "data retrieved successfully"
}
```

## Sample Request Template

```http
GET /api/v1/token/users?page=1&limit=20&search=smith&country=US,CA HTTP/1.1
Host: api.sitepins.com
Authorization: Bearer eyJhbGciOi...
Accept: application/json
```

## Diagnostics

If you hit a 401 error, verify:
- The token exists in AccessToken (src/modules/access-token/access-token.model.ts).
- The Authorization header uses the Bearer prefix.
- expires_in is still in the future.

All responses follow the sendResponse shape: { success, statusCode, message, result, meta? }.
