import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

async function run() {
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is not set. Cannot run migrations.');
        process.exit(1);
    }

const shouldUseSSL = (() => {
    if (typeof process.env.DB_SSL !== 'undefined') {
        return process.env.DB_SSL !== 'false';
    }
    return !/localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL);
})();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: shouldUseSSL ? { rejectUnauthorized: false } : false
});

    const statements = [
        'ALTER TABLE recipes ADD COLUMN IF NOT EXISTS image TEXT;',
        'ALTER TABLE recipes ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;',
        'ALTER TABLE recipes ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;',
        `CREATE TABLE IF NOT EXISTS collections (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            description TEXT,
            slug TEXT UNIQUE NOT NULL,
            cover_image TEXT,
            is_public BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT now()
        );`,
        `CREATE TABLE IF NOT EXISTS collection_recipes (
            collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
            recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
            position INTEGER DEFAULT 0,
            added_at TIMESTAMPTZ DEFAULT now(),
            PRIMARY KEY (collection_id, recipe_id)
        );`
    ];

    const client = await pool.connect();
    try {
        for (const statement of statements) {
            await client.query(statement);
        }
        console.log('Database migrations applied successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
}

run();
