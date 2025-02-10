// contexts/ContactsContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { useSQLiteContext } from 'expo-sqlite';
import { Contact } from '../types/Contact';
import { deleteContact as deleteC, getContacts, saveContact, updateContact } from '../db/sqliteService';

interface ContactsContextType {
    contacts: Contact[];
    fetchContacts: () => Promise<void>;
    saveContact: (contact: Contact) => Promise<void>;
    updateContact: (id: number, contact: Partial<Contact>) => Promise<void>;
    deleteContact: (id: number) => Promise<void>;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const ContactsProvider = ({ children }: { children: ReactNode }) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const db = useSQLiteContext();

    const fetchContacts = async () => {
        const result = await getContacts(db);
        setContacts(result);
    };

    const handleSaveContact = async (contact: Contact) => {
        await saveContact(db, contact);
        const updatedContacts = await getContacts(db);
        setContacts(updatedContacts);
    };

    const handleUpdateContact = async (id: number, contact: Partial<Contact>) => {
        await updateContact(db, id, contact);
        const updatedContacts = await getContacts(db);
        setContacts(updatedContacts);
    }


    const deleteContact = async (id: number) => {
        await deleteC(db, id);
        const updatedContacts = await getContacts(db);
        setContacts(updatedContacts);
    }

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <ContactsContext.Provider value={{ contacts, fetchContacts, saveContact: handleSaveContact, deleteContact, updateContact: handleUpdateContact }}>
            {children}
        </ContactsContext.Provider>
    );
};

export const useContacts = () => {
    const context = useContext(ContactsContext);
    if (!context) {
        throw new Error('useContacts must be used within a ContactsProvider');
    }
    return context;
};