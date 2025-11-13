import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/',
    authenticate,
    requireRole('admin'),
    async (_req, res) => {
        const result = await query(
            'SELECT id, name, email, username, role, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(result.rows);
    }
);

router.post('/',
    authenticate,
    requireRole('admin'),
    body('name').isLength({ min: 2, max: 80 }),
    body('email').isEmail().normalizeEmail(),
    body('username').isLength({ min: 3, max: 40 }).matches(/^[a-z0-9._-]+$/),
    body('role').isIn(['admin', 'editor', 'viewer']),
    body('password').isLength({ min: 8 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { name, email, username, role, password } = req.body;
        const existing = await query(
            'SELECT id FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );
        if (existing.rowCount > 0) {
            return res.status(409).json({ message: 'Email or username already in use' });
        }
        const hash = await bcrypt.hash(password, 10);
        const result = await query(
            `INSERT INTO users (name, email, username, password_hash, role)
             VALUES ($1,$2,$3,$4,$5)
             RETURNING id, name, email, username, role, created_at`,
            [name, email, username, hash, role]
        );
        res.status(201).json(result.rows[0]);
    }
);

router.post('/:id/password',
    authenticate,
    requireRole('admin'),
    body('password').isLength({ min: 8 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const hash = await bcrypt.hash(req.body.password, 10);
        const result = await query(
            'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id',
            [hash, req.params.id]
        );
        if (!result.rowCount) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send();
    }
);

router.delete('/:id',
    authenticate,
    requireRole('admin'),
    async (req, res) => {
        const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
        if (!result.rowCount) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send();
    }
);

export default router;
