import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';
import { query } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const normalizeCollection = (row) => ({
    id: row.id,
    name: row.name,
    description: row.description || '',
    slug: row.slug,
    coverImage: row.cover_image || '',
    isPublic: !!row.is_public,
    createdAt: row.created_at,
    authorId: row.user_id
});

const normalizeCollectionWithRecipes = (row) => ({
    ...normalizeCollection(row),
    recipes: row.recipes || []
});

const generateSlug = (name = '') => {
    const base = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40);
    const suffix = crypto.randomUUID().split('-')[0];
    return `${base || 'collection'}-${suffix}`;
};

router.get('/public/:slug', async (req, res) => {
    const result = await query(
        `SELECT c.*, COALESCE(
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', r.id,
                    'title', r.title,
                    'category', r.category,
                    'source', r.source,
                    'servings', r.servings,
                    'ingredients', r.ingredients,
                    'instructions', r.instructions,
                    'image', r.image,
                    'isPublic', r.is_public
                )
            ) FILTER (WHERE r.id IS NOT NULL),
            '[]'::json
        ) AS recipes
        FROM collections c
        LEFT JOIN collection_recipes cr ON cr.collection_id = c.id
        LEFT JOIN recipes r ON r.id = cr.recipe_id
        WHERE c.slug = $1 AND c.is_public = TRUE
        GROUP BY c.id
        LIMIT 1`,
        [req.params.slug]
    );
    if (!result.rowCount) {
        return res.status(404).json({ message: 'Collection not found' });
    }
    res.json(normalizeCollectionWithRecipes(result.rows[0]));
});

router.get('/mine',
    authenticate,
    async (req, res) => {
        const result = await query(
            `SELECT c.*, COUNT(cr.recipe_id) AS recipe_count
             FROM collections c
             LEFT JOIN collection_recipes cr ON cr.collection_id = c.id
             WHERE c.user_id = $1
             GROUP BY c.id
             ORDER BY c.created_at DESC`,
            [req.user.id]
        );
        res.json(result.rows.map(row => ({
            ...normalizeCollection(row),
            recipeCount: Number(row.recipe_count || 0)
        })));
    }
);

router.post('/',
    authenticate,
    body('name').isLength({ min: 3, max: 80 }),
    body('description').optional().isLength({ max: 200 }),
    body('isPublic').optional().isBoolean(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { name, description = '', isPublic = true, coverImage = '' } = req.body;
        const slug = generateSlug(name);
        const result = await query(
            `INSERT INTO collections (user_id, name, description, slug, cover_image, is_public)
             VALUES ($1,$2,$3,$4,$5,$6)
             RETURNING *`,
            [req.user.id, name, description, slug, coverImage, isPublic]
        );
        res.status(201).json(normalizeCollection(result.rows[0]));
    }
);

router.patch('/:id',
    authenticate,
    body('name').optional().isLength({ min: 3, max: 80 }),
    body('description').optional().isLength({ max: 200 }),
    body('isPublic').optional().isBoolean(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const existing = await query(
            'SELECT * FROM collections WHERE id = $1 AND user_id = $2',
            [req.params.id, req.user.id]
        );
        if (!existing.rowCount) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        const current = existing.rows[0];
        const payload = {
            name: req.body.name ?? current.name,
            description: req.body.description ?? current.description,
            is_public: typeof req.body.isPublic === 'boolean' ? req.body.isPublic : current.is_public,
            cover_image: req.body.coverImage ?? current.cover_image
        };
        const result = await query(
            `UPDATE collections
             SET name = $1,
                 description = $2,
                 is_public = $3,
                 cover_image = $4
             WHERE id = $5 AND user_id = $6
             RETURNING *`,
            [payload.name, payload.description, payload.is_public, payload.cover_image, req.params.id, req.user.id]
        );
        res.json(normalizeCollection(result.rows[0]));
    }
);

router.delete('/:id',
    authenticate,
    async (req, res) => {
        const result = await query(
            'DELETE FROM collections WHERE id = $1 AND user_id = $2 RETURNING id',
            [req.params.id, req.user.id]
        );
        if (!result.rowCount) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        res.status(204).send();
    }
);

router.post('/:id/recipes',
    authenticate,
    body('recipeId').notEmpty(),
    body('position').optional().isInt({ min: 0, max: 1000 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const collectionCheck = await query(
            'SELECT id FROM collections WHERE id = $1 AND user_id = $2',
            [req.params.id, req.user.id]
        );
        if (!collectionCheck.rowCount) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        await query(
            `INSERT INTO collection_recipes (collection_id, recipe_id, position)
             VALUES ($1,$2,$3)
             ON CONFLICT (collection_id, recipe_id)
             DO UPDATE SET position = EXCLUDED.position`,
            [req.params.id, req.body.recipeId, req.body.position || 0]
        );
        res.status(204).send();
    }
);

router.delete('/:id/recipes/:recipeId',
    authenticate,
    async (req, res) => {
        await query(
            `DELETE FROM collection_recipes
             WHERE collection_id = $1 AND recipe_id = $2`,
            [req.params.id, req.params.recipeId]
        );
        res.status(204).send();
    }
);

export default router;
