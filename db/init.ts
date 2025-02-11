// src/database/initDb.ts
import { SQLiteDatabase } from 'expo-sqlite';

const DATABASE_VERSION = 1;

// Migration function
export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    let currentDbVersion = result ? result.user_version : 0;

    if (currentDbVersion >= DATABASE_VERSION) {
        return;
    }

    if (currentDbVersion === 0) {
        await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        birthdate TEXT NOT NULL,
        photo TEXT
      );
    `);

        currentDbVersion = 1;  // Update the version after migration
    }

    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}