// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elite_construction');
//     console.log(`MongoDB connected: ${conn.connection.host}`);
//     return conn;
//   } catch (error) {
//     console.error('MongoDB connection error:', error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
const mongoose = require('mongoose');
require('dotenv').config(); // ← Add this line!

const connectDB = async () => {
  try {
    // Remove the fallback to force Atlas connection
    if (!process.env.MONGODB_URI) {
      console.error(' MONGODB_URI is not defined in .env file!');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(` MongoDB connected: ${conn.connection.host}`);
    console.log(` Database: ${conn.connection.db.databaseName}`);
    return conn;
  } catch (error) {
    console.error(' MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
