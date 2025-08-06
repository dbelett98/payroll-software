// index.js: Main Express server file (updated for auth routes, body parsing to fix 400, and CORS – free open-source Express).
const express = require('express');  // Open-source Express (free).
const cors = require('cors');  // Free open-source CORS middleware (if installed; fixes cross-port if needed).
const { passport, generateToken, authenticateJWT } = require('./auth');  // Import from auth.js.
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();  // Free Prisma.
const bcrypt = require('bcryptjs');  // For registration hashing.
const defineAbilitiesFor = require('./rbac');  // Import from rbac.js

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:3001' }));  // Free CORS for client on 3001 (add this first if not present).
app.use(express.json());  // Free body parser for JSON requests (fixes 400 Bad Request on POST – add before routes).
app.use(passport.initialize());  // Initialize Passport (free).

// Register Route: POST /register (creates new user).
app.post('/register', async (req, res) => {
  const { email, password, role } = req.body;  // Extract from request (now parsed via express.json()).
  try {
    const hashedPassword = await bcrypt.hash(password, 10);  // Hash password (free, 10 salt rounds).
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role }  // Insert into DB (free Prisma).
    });
    res.status(201).json({ message: 'User created', userId: user.id });  // Success response.
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });  // Handle errors.
  }
});

// Login Route: POST /login (authenticates and returns JWT, with custom error handling to avoid generic 400).
app.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);  // Handle internal errors.
    if (!user) return res.status(401).json({ message: info ? info.message : 'Invalid credentials' });  // Custom 401 for failures (free override of 400).
    const token = generateToken(user);  // Generate JWT (from auth.js).
    res.json({ token });  // Return token for client storage.
  })(req, res, next);
});

// Protected Route Example: GET /protected (requires JWT; for testing).
app.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'Protected content', user: req.user });  // Accessible only with valid token.
});

// Protected Route Example: GET /protected (requires JWT and RBAC check).
app.get('/protected', authenticateJWT, (req, res) => {
  const ability = defineAbilitiesFor(req.user);  // Define abilities based on user role from JWT (free CASL call).
  if (!ability.can('read', 'Protected')) return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });  // Check permission (free, denies if cannot).

  res.json({ message: 'Protected content accessed', user: req.user });  // Success if allowed (free response).
});

// Existing root route (unchanged).
app.get('/', (req, res) => {
  res.send('PSB Payroll Backend - Open-Source Node.js/Express');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//  (updated with /clients route for dashboard – free open-source Express/Prisma).
// ... (existing imports and app setup)

app.get('/clients', authenticateJWT, async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      where: { userId: req.user.id }  // Fetch clients for the logged-in user (free Prisma query, RBAC via JWT role if needed).
    });
    res.json(clients);  // Return client list (free response).
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clients', error });  // Handle errors (free).
  }
});

app.get('/employees', authenticateJWT, async (req, res) => {
  const { clientId } = req.query;  // Get clientId from query (free).
  try {
    const employees = await prisma.employee.findMany({
      where: { clientId: parseInt(clientId) }  // Fetch for specific client (free Prisma query).
    });
    res.json(employees);  // Return list (free).
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error });  // Handle errors (free).
  }
});