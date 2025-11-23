import pool from '../models/db.js';
export const getAssets = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM assets');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};