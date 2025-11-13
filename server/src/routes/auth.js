import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { query } from '../db.js';

const router = Router();

const userFields = [
    body('name').trim().isLength({ min: 2, max: 80 }),
    body('email').isEmail().normalizeEmail(),
    body('username').isLength({ min: 3, max: 40 }).matches(/^[a-z0-9._-]+$/),
    body('password').isLength({ min: 8 }),
    body('role').isIn(['admin', 'editor', 'viewer'])
];

router.post('/register', userFields, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { name, email, username, password, role } = req.body;
    const existing = await query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [email, username]
    );
    if (existing.rowCount > 0) {
        return res.status(409).json({ message: 'Email or username already in use' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await query(
        `INSERT INTO users (name, email, username, password_hash, role)
         VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, username, role, created_at`,
        [name, email, username, passwordHash, role]
    );
    return res.status(201).json(result.rows[0]);
});

router.post('/login',
    body('username').notEmpty(),
    body('password').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { username, password } = req.body;
        const result = await query(
            'SELECT id, name, email, username, password_hash, role FROM users WHERE username = $1 OR email = $1 LIMIT 1',
            [username.toLowerCase()]
        );
        if (result.rowCount === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
        );
        return res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                role: user.role
            }
        });
    }
);

export default router;
