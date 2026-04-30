# IT 112 Mini Full-Stack Web App

This project extends the Week 7 Mini Full-Stack Starter into a deployed, secured, optimized, and installable Express + MongoDB web application.

Live Render URL: https://week7-minifullstackstarter.onrender.com/

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- bcrypt
- express-validator
- helmet
- express-rate-limit
- xss-clean
- node-cache
- Progressive Web App features

## How to Run

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

3. Start the server:

```bash
npm start
```

4. Open the app:

```text
http://localhost:3000
```

## Optional Seed Data

Run:

```bash
npm run seed
```

This creates:

- 1 admin user
- 2 normal users
- 2 products
- 1 order

Sample password:

```text
123456
```

Warning: `seed.js` clears existing Users, Products, and Orders before adding sample data.

## Implemented Weeks

### Week 10: Advanced Database Integration

Implemented MongoDB relationships using Mongoose models.

Added:

- `models/Product.js`
- `models/Order.js`
- Product routes
- Order routes
- ObjectId references between Users, Products, and Orders
- `populate()` for showing linked user/product data
- Seed script for sample database records

Main endpoints:

- `GET /api/products`
- `POST /api/products`
- `DELETE /api/products/:id`
- `GET /api/orders`
- `POST /api/orders`
- `DELETE /api/orders/:id`

### Week 11: Authentication Implementation

Implemented user registration, login, password hashing, and role-based access control.

Added:

- User authentication fields: `username`, `password`, `role`
- Password hashing using `bcrypt`
- Register route
- Login route
- Auth middleware
- Role authorization middleware
- Protected profile route
- Admin-only route

Main endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `GET /api/auth/admin`

### Week 12: Deployment to Render

Prepared and deployed the application to Render with MongoDB Atlas.

Implemented:

- `npm start` script
- Environment-based port using `process.env.PORT`
- Environment-based MongoDB URI using `process.env.MONGO_URI`
- `.env` ignored by Git
- `/status` endpoint for deployment health checks
- Frontend page for browser-based testing

Main endpoints:

- `GET /`
- `GET /status`
- `GET /api/health`

### Week 13: Web Security Implementation

Added validation, XSS protection, stronger password handling, rate limiting, and secure endpoints.

Implemented:

- Security headers using `helmet`
- Input validation using `express-validator`
- Strong password validation for registration
- XSS sanitizing using `xss-clean`
- Login rate limiting using `express-rate-limit`
- Improved unauthorized route messages
- Protected secure data route

Main endpoint added:

- `GET /api/auth/secure-data`

Security behavior:

- Empty fields are rejected
- Invalid emails are rejected
- Weak passwords are rejected during registration
- Login is limited after repeated attempts
- Script-like input is sanitized

### Week 14: Performance Optimization and Caching

Added caching, optimized database queries, and performance logging.

Implemented:

- `node-cache`
- Shared cache utility
- 30-second cache expiration
- Cached `/api/users`
- Cached `/api/products`
- Cache invalidation on create, update, and delete
- Query optimization with `.lean()`
- Reduced response size with `.select()`
- Performance logger middleware

Performance behavior:

- First request returns `source: "database"`
- Next request returns `source: "cache"`
- Logs show request duration in milliseconds

Example:

```json
{
  "source": "cache",
  "durationMs": 0,
  "data": []
}
```

### Week 15: Progressive Web App

Converted the app into a basic Progressive Web App.

Implemented:

- Web app manifest
- 192x192 app icon
- Service worker
- Offline fallback page
- Cached app shell
- Cached selected routes
- Installable app support

PWA files:

- `public/manifest.json`
- `public/sw.js`
- `public/offline.html`
- `public/icon.png`

Cached resources:

- `/`
- `/index.html`
- `/offline.html`
- `/css/styles.css`
- `/js/app.js`
- `/manifest.json`
- `/icon.png`
- `/status`
- `/api/health`
- `/api/users`

## Frontend Features

The browser UI includes:

- Registration form
- Login form
- Current session display
- Profile route test
- Admin route test
- Secure data route test
- User list
- Server/database status badge

## API Testing

Use Thunder Client or Postman.

Register:

```http
POST /api/auth/register
```

Example body:

```json
{
  "username": "sampleuser",
  "name": "Sample User",
  "email": "sample@test.com",
  "password": "Password1",
  "confirmPassword": "Password1",
  "role": "user"
}
```

Login:

```http
POST /api/auth/login
```

Example body:

```json
{
  "email": "admin@test.com",
  "password": "123456"
}
```

Protected route testing:

```http
GET /api/auth/profile
```

Header:

```text
role: user
```

Admin route testing:

```http
GET /api/auth/admin
```

Header:

```text
role: admin
```

## PWA Screensho


```html
<img src="https://res.cloudinary.com/dbx0kk6wq/image/upload/v1777522049/Screenshot_2026-04-30_120555_uvokeu.png" alt="PWA Installed App Screenshot" width="600">

<img src="YOUR_SECOND_IMAGE_LINK_HERE" alt="https://res.cloudinary.com/dbx0kk6wq/image/upload/v1777522097/Screenshot_2026-04-30_120748_gh1qan.png" width="600">
```
