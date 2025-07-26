// index.js: Main Express server file (updated for auth routes)
const express = require('express');  // Open-source Express 
const { passport, generateToken, authenticateJWT } = require('./auth');  // Import from auth.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();  
const bcrypt = require('bcryptjs');  // For registration hashing

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());  // Parse JSON bodies (Express middleware)
app.use(passport.initialize());  // Initialize Passport

// Register Route: POST /register (creates new user)
app.post('/register', async (req, res) => {
  const { email, password, role } = req.body;  // Extract from request
  try {
    const hashedPassword = await bcrypt.hash(password, 10);  // Hash password (10 salt rounds)
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role }  // Insert into DB ( Prisma).
    });
    res.status(201).json({ message: 'User created', userId: user.id });  // Success response.
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });  // Handle errors.
  }
});

// Login Route: POST /login (authenticates and returns JWT).
app.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const token = generateToken(req.user);  // Generate JWT (from auth.js).
  res.json({ token });  // Return token for client storage.
});

// Protected Route Example: GET /protected (requires JWT; for testing).
app.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'Protected content', user: req.user });  // Accessible only with valid token.
});

// Existing root route (unchanged).
app.get('/', (req, res) => {
  res.send('PSB Payroll Backend - Open-Source Node.js/Express');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});