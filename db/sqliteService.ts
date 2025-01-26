// src/database/contactActions.ts
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { Contact } from '../types/Contact';

// Create a contact table
export const createContactsTable = async (db: SQLiteDatabase): Promise<void> => {
    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT NOT NULL,
          birthdate TEXT NOT NULL,
          photo TEXT NOT NULL
        );`
    );
};

// Save a contact
export const saveContact = async (db: SQLiteDatabase, contact: Contact): Promise<void> => {
    const { name, phone, email, birthdate, photo } = contact;
    await db.runAsync(
        `INSERT INTO contacts (name, phone, email, birthdate, photo) VALUES (?, ?, ?, ?, ?);`,
        [name, phone, email, birthdate, photo]
    );
};

// Get all contacts
export const getContacts = async (db: SQLiteDatabase): Promise<Contact[]> => {
    const result = await db.getAllAsync<Contact>(`SELECT * FROM contacts;`);
    return result;
};

// Update a contact
export const updateContact = async (id: number, contact: Partial<Contact>): Promise<void> => {
    const db = useSQLiteContext();
    const fields = [];
    const values: (string | number | null)[] = [];

    if (contact.name) {
        fields.push('name = ?');
        values.push(contact.name);
    }
    if (contact.phone) {
        fields.push('phone = ?');
        values.push(contact.phone);
    }
    if (contact.email) {
        fields.push('email = ?');
        values.push(contact.email);
    }
    if (contact.birthdate) {
        fields.push('birthdate = ?');
        values.push(contact.birthdate);
    }
    if (contact.photo !== undefined) {
        fields.push('photo = ?');
        values.push(contact.photo);
    }

    values.push(id); // Adds the ID for WHERE clause

    if (fields.length > 0) {
        const query = `UPDATE contacts SET ${fields.join(', ')} WHERE id = ?;`;
        await db.runAsync(query, values);
    }
};

// Delete a contact
export const deleteContact = async (id: number): Promise<void> => {
    const db = useSQLiteContext();
    await db.runAsync(`DELETE FROM contacts WHERE id = ?;`, [id]);
};