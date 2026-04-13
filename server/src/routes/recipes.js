import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

const baseRecipeSelect = `
    id, title, category, source, servings, featured,
    ingredients, instructions, image, author_id,
    is_public, published_at, created_at
`;

const recipeValidators = [
    body('title').isLength({ min: 3, max: 200 }),
    body('category').notEmpty(),
    body('instructions').isLength({ min: 10 }),
    body('ingredients').optional().isArray({ max: 200 }),
    body('ingredients.*').optional().isString().trim().isLength({ min: 1, max: 400 }),
    body('source').optional().isLength({ max: 200 }),
    body('servings').optional().isLength({ max: 120 }),
    body('image').optional().isString().isLength({ max: 500000 })
];

const normalizeRecipeRow = (row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    source: row.source || '',
    servings: row.servings || '',
    instructions: row.instructions,
    ingredients: Array.isArray(row.ingredients) ? row.ingredients : [],
    image: row.image || null,
    featured: !!row.featured,
    authorId: row.author_id || null,
    isPublic: !!row.is_public,
    publishedAt: row.published_at,
    dateAdded: row.created_at
});

router.get('/', async (_req, res) => {
    const result = await query(
        `SELECT ${baseRecipeSelect}
         FROM recipes ORDER BY created_at DESC LIMIT 200`
    );
    res.json(result.rows.map(normalizeRecipeRow));
});

router.get('/public', async (_req, res) => {
    const result = await query(
        `SELECT ${baseRecipeSelect}
         FROM recipes
         WHERE is_public = true
         ORDER BY COALESCE(published_at, created_at) DESC
         LIMIT 200`
    );
    res.json(result.rows.map(normalizeRecipeRow));
});

router.post('/',
    authenticate,
    requireRole('admin', 'editor'),
    recipeValidators,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const {
            title,
            category,
            instructions,
            source,
            servings,
            ingredients = [],
            image = null
        } = req.body;
        const result = await query(
            `INSERT INTO recipes (title, category, instructions, source, servings, author_id, ingredients, image)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
             RETURNING ${baseRecipeSelect}`,
            [title, category, instructions, source, servings, req.user.id, ingredients, image]
        );
        res.status(201).json(normalizeRecipeRow(result.rows[0]));
    }
);

router.get('/mine',
    authenticate,
    async (req, res) => {
        const result = await query(
            `SELECT ${baseRecipeSelect}
             FROM recipes
             WHERE author_id = $1
             ORDER BY created_at DESC`,
            [req.user.id]
        );
        res.json(result.rows.map(normalizeRecipeRow));
    }
);

router.get('/mine/:id',
    authenticate,
    async (req, res) => {
        const result = await query(
            `SELECT ${baseRecipeSelect}
             FROM recipes
             WHERE id = $1 AND author_id = $2
             LIMIT 1`,
            [req.params.id, req.user.id]
        );
        if (!result.rowCount) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(normalizeRecipeRow(result.rows[0]));
    }
);

router.post('/mine',
    authenticate,
    recipeValidators,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const {
            title,
            category,
            instructions,
            source,
            servings,
            ingredients = [],
            image = null
        } = req.body;
        const result = await query(
            `INSERT INTO recipes (title, category, instructions, source, servings, author_id, ingredients, image)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
             RETURNING ${baseRecipeSelect}`,
            [title, category, instructions, source, servings, req.user.id, ingredients, image]
        );
        res.status(201).json(normalizeRecipeRow(result.rows[0]));
    }
);

router.delete('/mine/:id',
    authenticate,
    async (req, res) => {
        const result = await query(
            `DELETE FROM recipes
             WHERE id = $1 AND author_id = $2
             RETURNING id`,
            [req.params.id, req.user.id]
        );
        if (!result.rowCount) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(204).send();
    }
);

router.patch('/mine/:id/publish',
    authenticate,
    body('isPublic').isBoolean(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { isPublic } = req.body;
        const result = await query(
            `UPDATE recipes
             SET is_public = $1,
                 published_at = CASE WHEN $1 THEN COALESCE(published_at, now()) ELSE NULL END
             WHERE id = $2 AND author_id = $3
             RETURNING ${baseRecipeSelect}`,
            [isPublic, req.params.id, req.user.id]
        );
        if (!result.rowCount) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(normalizeRecipeRow(result.rows[0]));
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
