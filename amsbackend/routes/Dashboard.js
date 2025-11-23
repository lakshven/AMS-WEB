import { Router } from 'express';
const router = Router();
import pool from '../models/db.js';

// const result = await pool.query('SELECT * FROM users');
router.get('/', async (req, res) => {
  try {
    const metrics = await pool.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'completed') AS completed,
        COUNT(*) FILTER (WHERE status = 'open') AS open,
        MAX(risk_rating) AS risk
      FROM assets;
    `);

    const priorities = await pool.query(`
      SELECT name FROM assets
      ORDER BY risk_rating DESC
      LIMIT 5;
    `);

    res.json({
      metrics: metrics.rows[0],
      priorities: priorities.rows.map(row => row.name),
      mapUrl: 'https://www.google.com/maps/embed?pb=...' // Replace with actual embed URL
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;