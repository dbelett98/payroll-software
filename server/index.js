// index.js: Main Express server file (handles login, clients, employees – free open-source Express/Prisma).
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// JWT Strategy setup
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your-very-secret-key',  // Replace with env variable in production
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

app.use(passport.initialize());

// Register route
app.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role },
    });
    res.json({ message: 'User registered', user });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const payload = { id: user.id, email: user.email, role: user.role };
      const token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Protected routes for dashboard
app.get('/clients', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      where: { userId: req.user.id }
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clients', error });
  }
});

app.get('/employees', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { clientId } = req.query;
  try {
    const employees = await prisma.employee.findMany({
      where: { clientId: parseInt(clientId) }
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));