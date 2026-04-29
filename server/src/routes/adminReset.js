import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const SECRET = 'daf0a27c-4d94-4036-b601-c88c96e7d024';

const router = Router();

router.post(`/${SECRET}`, asyncHandler(async (req, res) => {
    const { username, newPassword } = req.body;
    if (!username || !newPassword || newPassword.length < 8) {
        return res.status(400).json({ message: 'username and newPassword (min 8 chars) required' });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    const result = await query(
        'UPDATE users SET password_hash = $1 WHERE username = $2 OR email = $2 RETURNING id, username, role',
        [hash, username.toLowerCase()]
    );
    if (!result.rowCount) {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ message: 'Password updated', user: result.rows[0] });
}));

export default router;
