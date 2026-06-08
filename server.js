// server.js — Express entry point

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const taskRoutes = require('./routes/tasks');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve the frontend from the project root
app.use(express.static(path.join(__dirname)));

// ── API routes ─────────────────────────────────────────────
app.use('/api/tasks', taskRoutes);

// Catch-all: serve index.html for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`TaskFlow running at http://localhost:${PORT}`);
});
