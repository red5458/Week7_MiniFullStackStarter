
## Project Overview

This project extends the Week 7 Mini Full-Stack Starter (CRUD + MongoDB) to implement advanced data modeling using Mongoose. It introduces two new models — **Product** and **Order** — and connects them to the existing **User** model using MongoDB ObjectId references and the `populate()` method.

**Tech Stack:** Node.js · Express · MongoDB Atlas · Mongoose · Bootstrap 5

Render URL: https://week7-minifullstackstarter.onrender.com/


---
## How to Run the Project

### 1. Clone the repository
### 2. Install dependencies
```bash
npm install
```

### 3. Set up your `.env` file
Create a `.env` file in the project root:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/week10db
PORT=3000
```


### 4. Start the server
```bash
npm run dev
```
The app will run at `http://localhost:3000`

### 5. Seed the database

To populate the database with sample data (1 user, 2 products, 1 order), run:
```bash
node seed.js
```

Expected output:
```
Connecting to MongoDB...
Connected!
Old data cleared.
User created: Test User
Products created: Laptop , Phone
Order created! Total: 70000

✅ Database seeded successfully!
```

> ⚠️ **Warning:** `seed.js` deletes **all existing** Users, Products, and Orders before inserting new data. Only run it when you want to reset your test data.

---

## Changes Made from Week 7 to Week 10

### New Files Added

| File | Description |
|------|-------------|
| `models/Product.js` | Product schema with `name`, `price`, `description`, and a `createdBy` field referencing a User |
| `models/Order.js` | Order schema linking one User and an array of Products via ObjectId references |
| `routes/products.js` | GET, POST, DELETE endpoints for products |
| `routes/orders.js` | GET, POST, DELETE endpoints for orders — uses `populate()` on both `user` and `products` |
| `seed.js` | One-time script that inserts a test User, two Products, and one linked Order |

### Modified Files

#### `server.js`
Registered the two new routers:
```js
const productsRouter = require('./routes/products');
const ordersRouter   = require('./routes/orders');

app.use('/api/products', productsRouter);
app.use('/api/orders',   ordersRouter);
```

#### `public/index.html`
Added a new **Order List** section below the existing Users row:
```html
<div class="col-12">
  <div class="main-card shadow-sm">
    <h5 class="mono fw-bold mb-2">// ORDER LIST</h5>
    <p class="text-muted small mb-3">Run <code>node seed.js</code> to add sample data.</p>
    <div id="orderList" class="list-group list-group-flush small"></div>
  </div>
</div>
```

#### `public/js/app.js`
Added `loadOrders()` to fetch and display orders with populated data, and `deleteOrder()` for deleting an order. Both functions are called on page load alongside the existing `loadUsers()`.

```js
async function loadOrders() {
  const res = await fetch('/api/orders');
  const orders = await res.json();
  // order.user and order.products are full objects, not just IDs
  // thanks to populate() in the backend
}

async function deleteOrder(id) {
  await fetch(`/api/orders/${id}`, { method: 'DELETE' });
  loadOrders();
}
```
