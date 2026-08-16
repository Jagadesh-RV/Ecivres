# Backend API Reference

This reference outlines the current state of the REST API endpoints provided by the NestJS backend. All endpoints are prefixed with `/api/v1`.

## 🟢 IMPLEMENTED

### Authentication (`/auth`)
| Method | Endpoint | Purpose | Auth Required? | Roles |
|--------|----------|---------|----------------|-------|
| `POST` | `/auth/register` | Create a new user identity | ❌ No | N/A |
| `POST` | `/auth/login` | Exchange credentials for JWTs | ❌ No | N/A |
| `POST` | `/auth/refresh` | Exchange Refresh Token for new Access Token | ❌ No | N/A |
| `POST` | `/auth/logout` | Revoke a refresh token | ❌ No | N/A |

### Users (`/users`)
| Method | Endpoint | Purpose | Auth Required? | Roles |
|--------|----------|---------|----------------|-------|
| `GET` | `/users/me` | Fetch identity of current token holder | ✅ Yes | N/A |
| `PATCH` | `/users/me/profile` | Update the current user's profile | ✅ Yes | N/A |

*Note: The `@CurrentUser()` decorator heavily secures the `/users/me` endpoints to prevent IDOR.*

---

## 🟡 SCAFFOLDED (Not Fully Implemented)
These modules have directories and basic controllers generated, but lack actual business logic mapping to the Prisma models.

### Customers (`/customers`)
*Currently scaffolded controller. Needs logic to fetch marketplace data.*

### Providers (`/providers`)
*Currently scaffolded controller. Needs logic to list provider profiles.*

### Services (`/services`)
*Currently scaffolded controller. Needs logic to handle `Service` and `Category` database models.*

### Bookings (`/bookings`)
*Currently scaffolded controller. Needs logic for creating and transitioning `BookingStatus`.*

### Payments (`/payments`)
*Currently scaffolded controller. Needs integration with a payment gateway (e.g., Stripe).*

### Reviews (`/reviews`)
*Currently scaffolded controller.*

### Admin (`/admin`)
*Currently scaffolded controller. Intended for `ADMIN` role only to manage users/categories.*
