require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

async function seedData() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected!");

  //Clear existing data
  await User.deleteMany();
  await Product.deleteMany();
  await Order.deleteMany();
  console.log("Old data cleared.");

  //Create a User
  const user = await User.create({
    name: "Paul Red",
    email: "paured5458@test.com",
    age: 20
  });
  console.log("User created:", user.name);

  //Create Products
  const product1 = await Product.create({
    name: "Laptop",
    price: 50000,
    description: "Gaming laptop with high performance",
    createdBy: user._id   // <-- links to the user above
  });

  const product2 = await Product.create({
    name: "IPhone 17 Pro Max",
    price: 80000,
    description: "A smartphone with great camera",
    createdBy: user._id
  });
  console.log("Products created:", product1.name, ",", product2.name);

  //Create an Order
  const order = await Order.create({
    user: user._id,                              
    products: [product1._id, product2._id],     
    totalAmount: product1.price + product2.price
  });
  console.log("Order created! Total:", order.totalAmount);

  console.log("\n✅ Database seeded successfully!");
  process.exit();
}

seedData().catch(err => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});
