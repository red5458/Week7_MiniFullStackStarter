require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

async function seedData() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected!");

  await User.deleteMany();
  await Product.deleteMany();
  await Order.deleteMany();
  console.log("Old data cleared.");

  const defaultPassword = await bcrypt.hash("123456", 10);

  const admin = await User.create({
    username: "admin",
    name: "Admin User",
    email: "admin@test.com",
    password: defaultPassword,
    role: "admin",
    age: 20
  });

  const user1 = await User.create({
    username: "paul",
    name: "Paul Red",
    email: "paured5458@test.com",
    password: defaultPassword,
    role: "user",
    age: 20
  });

  const user2 = await User.create({
    username: "student",
    name: "Student User",
    email: "student@test.com",
    password: defaultPassword,
    role: "user",
    age: 21
  });

  console.log("Users created:", admin.username, user1.username, user2.username);

  const product1 = await Product.create({
    name: "Laptop",
    price: 50000,
    description: "Gaming laptop with high performance",
    createdBy: user1._id
  });

  const product2 = await Product.create({
    name: "IPhone 17 Pro Max",
    price: 80000,
    description: "A smartphone with great camera",
    createdBy: user1._id
  });
  console.log("Products created:", product1.name, ",", product2.name);

  const order = await Order.create({
    user: user1._id,
    products: [product1._id, product2._id],
    totalAmount: product1.price + product2.price
  });
  console.log("Order created! Total:", order.totalAmount);

  console.log("\nDatabase seeded successfully!");
  console.log("Login password for seeded users: 123456");
  process.exit();
}

seedData().catch(err => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});
