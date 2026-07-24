require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');

async function updateSizes() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not defined. Please set it in your environment or a backend/.env file.");
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    const result = await Product.updateMany(
      { category: { $regex: /Bangles/i } },
      {
        $set: {
          sizes: [
            { value: '2.2', available: true },
            { value: '2.4', available: true },
            { value: '2.6', available: true },
            { value: '2.8', available: true }
          ]
        }
      }
    );

    console.log(`Successfully updated ${result.modifiedCount} bangles with default sizes in the database.`);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error updating sizes:", error);
    process.exit(1);
  }
}

updateSizes();
