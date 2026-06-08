// routes/tasks.js — REST API for tasks
// In-memory store; swap for a database later without changing the route logic.

const express = require('express');
const router  = express.Router();

// Seed with a couple of example tasks so the app isn't empty on first load
let tasks = [
  { id: 1,           text: 'Review the project spec',    completed: false, createdAt: new Date().toISOString() },
  { id: 2,           text: 'Set up the Express server',  completed: true,  createdAt: new Date().toISOString() },
];

let nextId = tasks.length + 1;

// ── GET /api/tasks ─────────────────────────────────────────
// Returns all tasks, newest first.
router.get('/', (req, res) => {
  res.json(tasks);
});

// ── POST /api/tasks ────────────────────────────────────────
// Body: { text: string }
// Creates a new task and returns it.
router.post('/', (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Task text is required.' });
  }

  const task = {
    id:        nextId++,
    text:      text.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(task);
  res.status(201).json(task);
});

// ── PATCH /api/tasks/:id ───────────────────────────────────
// Body: { text?: string, completed?: boolean }
// Updates one or both fields on the task.
router.patch('/:id', (req, res) => {
  const id   = Number(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  const { text, completed } = req.body;

  if (text !== undefined) {
    if (!text.trim()) return res.status(400).json({ error: 'Task text cannot be empty.' });
    task.text = text.trim();
  }

  if (completed !== undefined) {
    task.completed = Boolean(completed);
  }

  res.json(task);
});

// ── DELETE /api/tasks/:id ──────────────────────────────────
router.delete('/:id', (req, res) => {
  const id    = Number(req.params.id);
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  tasks.splice(index, 1);
  res.status(204).send();
});

// ── DELETE /api/tasks (bulk clear completed) ───────────────
router.delete('/', (req, res) => {
  tasks = tasks.filter(t => !t.completed);
  res.json(tasks);
});

module.exports = router;
