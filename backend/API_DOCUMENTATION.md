# EcoCloset Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## User Roles
- `user` - Regular user (can swap and donate items)
- `admin` - System administrator
- `ngo` - Non-profit organization

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`
Register a new user
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "role": "user" // optional: "user", "admin", "ngo"
}
```

#### POST `/api/auth/login`
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/profile`
Get current user profile (Protected)

#### PUT `/api/auth/profile`
Update user profile (Protected)

#### POST `/api/auth/upload-profile-image`
Upload profile image (Protected, multipart/form-data)

#### PUT `/api/auth/change-password`
Change password (Protected)
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

### Items Routes (`/api/items`)

#### GET `/api/items`
Get all items with filtering and pagination
Query parameters:
- `page`, `limit` - Pagination
- `category`, `size`, `color`, `condition`, `type`, `status` - Filters
- `search` - Text search
- `sortBy`, `sortOrder` - Sorting

#### GET `/api/items/:id`
Get single item by ID

#### POST `/api/items`
Create new item (Protected, multipart/form-data)
```json
{
  "title": "Vintage Denim Jacket",
  "description": "Classic denim jacket in great condition",
  "category": "jackets",
  "size": "m",
  "color": "blue",
  "brand": "Levi's",
  "condition": "good",
  "type": "swap", // "swap", "donation", "both"
  "swapPreferences": {...},
  "donationInfo": {...},
  "tags": "vintage, denim, jacket",
  "sustainabilityScore": 7,
  "materials": "denim, cotton",
  "careInstructions": "Machine wash cold"
}
```

#### PUT `/api/items/:id`
Update item (Protected, owner only)

#### DELETE `/api/items/:id`
Delete item (Protected, owner only)

#### GET `/api/items/user/my-items`
Get current user's items (Protected)

#### POST `/api/items/:id/like`
Like/unlike item (Protected)

### Swap Requests Routes (`/api/swaps`)

#### POST `/api/swaps`
Create swap request (Protected)
```json
{
  "itemRequested": "item_id",
  "itemOffered": "item_id",
  "message": "Would love to swap!",
  "proposedMeeting": {
    "date": "2024-01-15",
    "location": "Central Park",
    "notes": "Near the fountain"
  }
}
```

#### GET `/api/swaps`
Get user's swap requests (Protected)
Query parameters:
- `type` - "sent", "received", "all"
- `status` - "pending", "accepted", "rejected", "completed", "cancelled"

#### GET `/api/swaps/:id`
Get single swap request (Protected)

#### PUT `/api/swaps/:id/respond`
Respond to swap request (Protected, item owner only)
```json
{
  "status": "accepted", // "accepted" or "rejected"
  "responseMessage": "Great! Let's meet up.",
  "confirmedMeeting": {
    "date": "2024-01-15",
    "location": "Central Park",
    "notes": "Near the fountain"
  }
}
```

#### PUT `/api/swaps/:id/complete`
Complete swap request (Protected)
```json
{
  "reviews": {
    "requesterReview": {
      "rating": 5,
      "comment": "Great experience!"
    },
    "ownerReview": {
      "rating": 4,
      "comment": "Smooth transaction"
    }
  }
}
```

#### PUT `/api/swaps/:id/cancel`
Cancel swap request (Protected)

### Donation Routes (`/api/donations`)

#### POST `/api/donations`
Create donation request (Protected)
```json
{
  "item": "item_id",
  "ngo": "ngo_user_id",
  "donationType": "pickup", // "pickup" or "dropoff"
  "pickupDetails": {
    "address": {...},
    "contactPerson": {...},
    "specialInstructions": "Ring doorbell"
  },
  "dropoffDetails": {...},
  "estimatedValue": 50,
  "taxReceipt": {
    "requested": true
  }
}
```

#### GET `/api/donations`
Get user's donations (Protected)
Query parameters:
- `type` - "donated", "received", "all"
- `status` - "pending", "accepted", "scheduled_pickup", "picked_up", "delivered", "cancelled"

#### GET `/api/donations/:id`
Get single donation (Protected)

#### PUT `/api/donations/:id/respond`
Respond to donation request (Protected, NGO only)
```json
{
  "status": "accepted", // "accepted" or "cancelled"
  "notes": "Thank you for your donation!"
}
```

#### PUT `/api/donations/:id/schedule`
Schedule donation pickup/dropoff (Protected, NGO only)
```json
{
  "scheduledDate": "2024-01-15",
  "scheduledTime": "10:00 AM",
  "location": "NGO Office",
  "contactPerson": {
    "name": "Jane Smith",
    "phone": "1234567890"
  }
}
```

#### PUT `/api/donations/:id/complete`
Mark donation as completed (Protected, NGO only)
```json
{
  "impact": {
    "category": "clothing",
    "beneficiaries": 5,
    "story": "These clothes helped families in need",
    "photos": ["photo_url1", "photo_url2"]
  }
}
```

#### PUT `/api/donations/:id/review`
Add review to donation (Protected)
```json
{
  "rating": 5,
  "comment": "Great organization!"
}
```

### Admin Routes (`/api/admin`)
All routes require admin role.

#### GET `/api/admin/dashboard/stats`
Get dashboard statistics

#### GET `/api/admin/reports`
Get system reports
Query parameters:
- `type` - "overview", "users", "items", "swaps", "donations"
- `period` - "7d", "30d", "90d"

#### GET `/api/admin/users`
Get all users with pagination and filtering

#### GET `/api/admin/users/:id`
Get single user with activity

#### PUT `/api/admin/users/:id`
Update user (Admin only)

#### DELETE `/api/admin/users/:id`
Delete user (Admin only)

#### GET `/api/admin/items`
Get all items (Admin view)

#### GET `/api/admin/swaps`
Get all swap requests (Admin view)

#### GET `/api/admin/donations`
Get all donations (Admin view)

### NGO Routes (`/api/ngo`)
All routes require NGO role.

#### GET `/api/ngo/dashboard`
Get NGO dashboard statistics

#### GET `/api/ngo/profile`
Get NGO profile

#### PUT `/api/ngo/profile`
Update NGO profile
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "1234567890",
  "address": {...},
  "description": "We help communities in need",
  "website": "https://example.org",
  "socialMedia": {...},
  "operatingHours": "9 AM - 5 PM",
  "pickupAreas": ["Manhattan", "Brooklyn"],
  "acceptedCategories": ["shirts", "pants", "dresses"]
}
```

#### GET `/api/ngo/items/available`
Get available items for donation

#### GET `/api/ngo/donations`
Get donation history

#### GET `/api/ngo/donations/impact-report`
Generate impact report
Query parameters:
- `startDate`, `endDate` - Date range
- `format` - "summary" or "detailed"

#### GET `/api/ngo/pickups`
Get pickup schedule

## Error Responses

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Success Responses

Most endpoints return:
```json
{
  "success": true,
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

## File Uploads

- Profile images: POST to `/api/auth/upload-profile-image`
- Item images: Include in POST to `/api/items`
- Max file size: 5MB
- Supported formats: jpg, jpeg, png, gif, webp, svg

## Pagination

Paginated endpoints return:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```
