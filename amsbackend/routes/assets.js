import { Router } from 'express';
import pool from '../models/db.js'
import { getAssets } from '../controllers/assets.js';
const router = Router();
router.get('/', getAssets);
router.get('/summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) AS total,
             COUNT(*) FILTER (WHERE risk_rating >= 7) AS high_risk
      FROM assets
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching summary');
  }
});
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, location, material_type, risk_rating } = req.body;
  try {
    await pool.query(
      'UPDATE assets SET name=$1, location=$2, material_type=$3, risk_rating=$4 WHERE id=$5',
      [name, location, material_type, risk_rating, id]
    );
    res.send('Asset updated');
  } catch (err) {
    res.status(500).send('Update failed');
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM assets WHERE id=$1', [id]);
    res.send('Asset deleted');
  } catch (err) {
    res.status(500).send('Delete failed');
  }
});
export default router;