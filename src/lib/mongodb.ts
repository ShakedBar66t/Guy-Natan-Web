import mongoose from 'mongoose';

// Use a default development-friendly MongoDB URL if the environment variable is not set
// This can be a local MongoDB instance or MongoDB Atlas with IP whitelisting turned off
const MONGODB_URI = process.env.MONGODB_URI || 
  "mongodb+srv://***REMOVED***@guyn-cluster.ji4uexj.mongodb.net/?retryWrites=true&w=majority&appName=GuyN-Cluster";

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// Define a type for the global mongoose cache
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Define a global with the mongoose property
declare global {
  var mongoose: MongooseCache | undefined;
}

// Initialize the cached connection
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// Save the cached connection
if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectToDatabase() {
  console.log('Attempting to connect to MongoDB...');
  console.log('Connection URL:', MONGODB_URI.replace(/([^:]+):([^@]+)@/, '$1:****@')); // Hide password in logs

  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Creating new MongoDB connection...');
    const opts = {
      bufferCommands: false,
      // Increase timeout values
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        console.log('Connection details:', {
          host: mongoose.connection.host,
          port: mongoose.connection.port,
          name: mongoose.connection.name,
          readyState: mongoose.connection.readyState
        });
        return mongoose;
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        
        // Log more detailed error information
        if (error.name === 'MongoNetworkError' || 
            error.message?.includes('IP address') || 
            error.message?.includes('whitelist')) {
          console.error(`
=========== MONGODB CONNECTION ERROR ===========
It appears that your IP address is not whitelisted in MongoDB Atlas.
To fix this you can:

1. Log in to MongoDB Atlas at https://cloud.mongodb.com
2. Go to Network Access in the left sidebar
3. Click "Add IP Address" and add your current IP
4. Or temporarily add 0.0.0.0/0 to allow all IP addresses (development only)

You can also use a local MongoDB instance by setting MONGODB_URI
in your .env.local file to a local connection string.
==================================================
`);
        }
        
        throw error;
      });
  }

  try {
    console.log('Awaiting MongoDB connection...');
    cached.conn = await cached.promise;
    console.log('MongoDB connection established');
  } catch (e) {
    console.error('Failed to establish MongoDB connection:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase; 