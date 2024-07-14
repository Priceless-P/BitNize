import { openDB } from 'idb';

const DB_NAME = 'walletDB';
const STORE_NAME = 'walletStore';
const MNEMONIC_STORE = 'mnemonicStore';

const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(MNEMONIC_STORE)) {
                db.createObjectStore(MNEMONIC_STORE, { keyPath: 'id' });
            }
        },
    });
}

export const setEncryptedPrivateKey = async (id, encryptedPrivateKey) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.put({ id, encryptedPrivateKey });
    await tx.done;
}

export const getEncryptedPrivateKey = async (id) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const data = await store.get(id);
    await tx.done;
    return data ? data.encryptedPrivateKey : null;
}

export const getStoredWalletAddresses = async () => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const keys = await store.getAllKeys()
    await tx.done;
    return keys;
}

export const setWalletMnemonics = async (id, mnemonic) => {
    const db = await initDB();
    const tx = db.transaction(MNEMONIC_STORE, 'readwrite');
    const store = tx.objectStore(MNEMONIC_STORE);
    await store.put({ id, mnemonic });
    await tx.done;
}

export const getWalletMnemonics = async (id) => {
    const db = await initDB();
    const tx = db.transaction(MNEMONIC_STORE, 'readonly');
    const store = tx.objectStore(MNEMONIC_STORE);
    const data = await store.get(id);
    await tx.done;
    return data ? data.mnemonic : null;
}
