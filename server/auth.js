// auth.js: Handles authentication logic using open-source Passport.js and JWT (free, secure token-based auth).
// Exports middleware for routes; integrates with Prisma for user DB operations.

const passport = require('passport');  // Open-source auth middleware
const LocalStrategy = require('passport-local').Strategy;  // strategy for username/password
const jwt = require('jsonwebtoken');  // JWT for token generation
const bcrypt = require('bcryptjs');  // hashing for passwords
const { PrismaClient } = require('@prisma/client');  // Prisma for DB
const prisma = new PrismaClient();  // Initializes Prisma Client 

const JWT_SECRET = 'your-secret-key';  // Replace with env var in production (free security best practice)

// Passport Local Strategy: For login with email/password
passport.use(new LocalStrategy({
  usernameField: 'email',  // Use email as username field
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });  // Query DB for user  (Prisma op)
    if (!user) return done(null, false, { message: 'Invalid credentials' });  // No user found.

    const isMatch = await bcrypt.compare(password, user.password);  // Compare hashed password (bcrypt)
    if (!isMatch) return done(null, false, { message: 'Invalid credentials' });

    return done(null, user);  // Success: Return user.
  } catch (error) {
    return done(error);  // Handle errors.
  }
}));

// Function to generate JWT token (used after login)
const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });  // Token expires in 1 hour (configurable)
};

// Middleware to verify JWT (for protected routes, e.g., dashboard access)
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract token from header.
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);  // Verify token (jwt).
    req.user = decoded;  // Attach user to request.
    next();  // Proceed if valid.
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { passport, generateToken, authenticateJWT };  // Export for use in index.js/routes.