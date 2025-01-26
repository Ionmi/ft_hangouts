import * as SQLite from 'expo-sqlite';
import { Contact } from '../types/Contact';

const db = await SQLite.openDatabaseAsync('contacts.db');

// Crear la tabla de contactos
export const createContactsTable = async (): Promise<void> => {
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

// Guardar un contacto
export const saveContact = async (contact: Contact): Promise<void> => {
    const { name, phone, email, birthdate, photo } = contact;
    await db.runAsync(
        `INSERT INTO contacts (name, phone, email, birthdate, photo) VALUES (?, ?, ?, ?, ?);`,
        [name, phone, email, birthdate, photo]
    );
};

// Obtener todos los contactos
export const getContacts = async (): Promise<Contact[]> => {
    return await db.getAllAsync(`SELECT * FROM contacts;`) as Contact[];
};

// Actualizar un contacto
export const updateContact = async (id: number, contact: Partial<Contact>): Promise<void> => {
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

    values.push(id); // Añade el ID al final para la cláusula WHERE

    if (fields.length > 0) {
        const query = `UPDATE contacts SET ${fields.join(', ')} WHERE id = ?;`;
        await db.runAsync(query, values);
    }
};

// Eliminar un contacto
export const deleteContact = async (id: number): Promise<void> => {
    await db.runAsync(`DELETE FROM contacts WHERE id = ?;`, [id]);
};