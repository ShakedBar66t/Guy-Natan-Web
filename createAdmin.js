// Script to create an admin user
// INSTRUCTIONS:
// 1. Replace YOUR_ACTUAL_PASSWORD with your MongoDB password in the MONGODB_URI below
// 2. Run this script with: node createAdmin.js
// 3. This will create an admin user with:
//    - Email: alive2154@gmail.com
//    - Password: BAR123Bar
//    - Name: Guy Natan

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Use the actual MongoDB URI from your production environment
const MONGODB_URI = 'mongodb+srv://alive2154:YOUR_ACTUAL_PASSWORD@guyn-cluster.ji4uexj.mongodb.net/guynatan?retryWrites=true&w=majority&appName=GuyN-Cluster';

// Define the User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Create the model
const User = mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    
    console.log('Connected to MongoDB');
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'alive2154@gmail.com' });
    
    if (existingUser) {
      console.log('User already exists');
      await mongoose.disconnect();
      return;
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('BAR123Bar', salt);
    
    // Create the user
    const user = await User.create({
      name: 'Guy Natan',
      email: 'alive2154@gmail.com',
      password: hashedPassword,
      isAdmin: true,
    });
    
    console.log('Admin user created successfully:', user);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    await mongoose.disconnect();
  }
}

createAdmin(); 