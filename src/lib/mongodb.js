import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

// MongoDB connection options optimized for Vercel/serverless
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  // Ensure SSL/TLS is properly configured for MongoDB Atlas
  tls: true,
  tlsAllowInvalidCertificates: false,
  // Retry configuration
  retryWrites: true,
  retryReads: true,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development, reuse the same client across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((error) => {
      console.error('MongoDB connection error:', error);
      throw error;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client for each serverless function
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((error) => {
    console.error('MongoDB connection error:', error);
    throw error;
  });
}

export default clientPromise;

