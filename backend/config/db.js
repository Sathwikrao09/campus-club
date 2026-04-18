const mongoose = require('mongoose');

const connectDB = async () => {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    throw new Error('MONGO_URI is missing. Add it to backend/.env before starting the server.');
  }

  const conn = await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};

module.exports = connectDB;
