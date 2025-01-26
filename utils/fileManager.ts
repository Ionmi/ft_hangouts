import * as FileSystem from 'expo-file-system';

const CONTACT_IMAGES_DIR = `${FileSystem.documentDirectory}contacts/`;

// Crear el directorio si no existe
export const ensureImageDirectoryExists = async (): Promise<void> => {
    const dirInfo = await FileSystem.getInfoAsync(CONTACT_IMAGES_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(CONTACT_IMAGES_DIR, { intermediates: true });
    }
};

// Guardar una imagen
export const saveImage = async (uri: string, contactId: number): Promise<string> => {
    await ensureImageDirectoryExists();
    const fileName = `${contactId}.jpg`;
    const newPath = `${CONTACT_IMAGES_DIR}${fileName}`;
    await FileSystem.moveAsync({ from: uri, to: newPath });
    return newPath;
};

// Obtener la ruta de una imagen
export const getImagePath = (contactId: number): string => {
    return `${CONTACT_IMAGES_DIR}${contactId}.jpg`;
};