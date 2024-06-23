const mongoose = require("mongoose");
const { User, Thought } = require("../models");
require("dotenv").config(); // Load environment variables from .env file

const mongoURI = process.env.MONGODB_URI;

const seedDatabase = async () => {
  try {
    // Ensure mongoURI is defined
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Thought.deleteMany({});

    // Create some users
    const users = await User.insertMany([
      { username: "Test 1", email: "test1@example.com", isActive: true },
      { username: "Test 2", email: "test2@example.com", isActive: true },
      { username: "Test 3", email: "test3@example.com", isActive: false },
      { username: "Test 4", email: "test4@example.com", isActive: true },
    ]);

    console.log("Users created:", users);

    // Create some thoughts
    const thoughts = await Thought.insertMany([
      {
        thoughtText: "This is a thought from Test 1",
        username: "Test 1",
      },
      {
        thoughtText: "Another thought from Test 1",
        username: "Test 1",
      },
      {
        thoughtText: "Thought from Test 2",
        username: "Test 2",
      },
    ]);

    console.log("Thoughts created:", thoughts);

    // Assign thoughts to users
    await User.findOneAndUpdate(
      { username: "Test 1" },
      { $push: { thoughts: { $each: [thoughts[0]._id, thoughts[1]._id] } } }
    );

    await User.findOneAndUpdate(
      { username: "Test 2" },
      { $push: { thoughts: thoughts[2]._id } }
    );

    console.log("Thoughts assigned to users");

    console.log("Database seeded successfully");
  } catch (err) {
    console.error("Error seeding the database:", err);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
};

// Run the seed function
seedDatabase();
