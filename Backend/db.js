const mongoose = require('mongoose')

const connectDB = async (mongoURI) => {
  console.log(mongoURI);
  
    try {
      const conn = await mongoose.connect(mongoURI)
      console.log('db connected');
      return conn;
    } catch (error) {
      console.error("Error connecting to MongoDB:", error.message);
      process.exit(1);
    }
  };
  
  module.exports = connectDB;