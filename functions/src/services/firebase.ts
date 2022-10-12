import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();

const auth = getAuth();
const db = getFirestore();

const main = db.collection('main');

const ipDocument = main.doc('ip'),
    timeDocument = main.doc('time');

export const verify: (token: string, checkRevoked?: boolean) => Promise<boolean> = async (...args) => {
    try {
        auth.verifyIdToken(...args);
        return true;
    } catch (err) {
        return false;
    };
};

// @ts-ignore - This will exist in Firestore
export const getIp = async () => (await ipDocument.get()).data()?.ip;
export const updateIp = async (ip: string) => (await ipDocument.update({ ip }));

export const getTimeConstraints = async () => (await timeDocument.get()).data();