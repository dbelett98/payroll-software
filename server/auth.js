// auth.js: Handles authentication logic using open-source Passport.js and JWT (free, secure token-based auth).
// Exports middleware for routes; integrates with Prisma for user DB operations.

const passport = require('passport');  // Open-source auth middleware (free).
const LocalStrategy = require('passport-local').Strategy;  // Free strategy for username/password.
const jwt = require('jsonwebtoken');  // Free JWT for token generation.
const bcrypt = require('bcryptjs');  // Free hashing for passwords.
const { PrismaClient } = require('@prisma/client');  // From Step C, free Prisma for DB.
const prisma = new PrismaClient();  // Initializes Prisma Client (free).

const JWT_SECRET = 'your-secret-key';  // Replace with env var in production (free security best practice).

// Passport Local Strategy: For login with email/password.
passport.use(new LocalStrategy({
  usernameField: 'email',  // Use email as username field.
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });  // Query DB for user (free Prisma op).
    if (!user) return done(null, false, { message: 'Invalid credentials' });  // No user found.

    const isMatch = await bcrypt.compare(password, user.password);  // Compare hashed password (free bcrypt).
    if (!isMatch) return done(null, false, { message: 'Invalid credentials' });

    return done(null, user);  // Success: Return user.
  } catch (error) {
    return done(error);  // Handle errors.
  }
}));

// Function to generate JWT token (free, used after login).
const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });  // Token expires in 1 hour (configurable).
};

// Middleware to verify JWT (for protected routes, e.g., dashboard access).
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract token from header.
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);  // Verify token (free jwt).
    req.user = decoded;  // Attach user to request.
    next();  // Proceed if valid.
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { passport, generateToken, authenticateJWT };  // Export for use in index.js/routes.