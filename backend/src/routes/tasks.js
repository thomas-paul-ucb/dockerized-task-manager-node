// src/routes/tasks.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// GET /tasks - Fetch all tasks
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks - Add a new task
router.post('/', async (req, res) => {
  const { title } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// Update a task (title or completed status)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const result = await pool.query(
      'UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 RETURNING *',
      [title, completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /tasks error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted', task: result.rows[0] });
  } catch (err) {
    console.error('DELETE /tasks error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


