import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
    const result = await query(
        `SELECT id, title, category, source, servings, featured, created_at
         FROM recipes ORDER BY created_at DESC LIMIT 200`
    );
    res.json(result.rows);
});

router.post('/',
    authenticate,
    requireRole('admin', 'editor'),
    body('title').isLength({ min: 3, max: 200 }),
    body('category').notEmpty(),
    body('instructions').isLength({ min: 10 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { title, category, instructions, source, servings, ingredients = [] } = req.body;
        const result = await query(
            `INSERT INTO recipes (title, category, instructions, source, servings, author_id, ingredients)
             VALUES ($1,$2,$3,$4,$5,$6,$7)
             RETURNING id, title, category, source, servings, featured, created_at`,
            [title, category, instructions, source, servings, req.user.id, ingredients]
        );
        res.status(201).json(result.rows[0]);
    }
);

router.patch('/:id/featured',
    authenticate,
    requireRole('admin', 'editor'),
    body('featured').isBoolean(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { featured } = req.body;
        const result = await query(
            'UPDATE recipes SET featured = $1 WHERE id = $2 RETURNING id, title, featured',
            [featured, req.params.id]
        );
        if (!result.rowCount) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(result.rows[0]);
    }
);

router.delete('/:id',
    authenticate,
    requireRole('admin'),
    async (req, res) => {
        const result = await query('DELETE FROM recipes WHERE id = $1 RETURNING id', [req.params.id]);
        if (!result.rowCount) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(204).send();
    }
);

export default router;
