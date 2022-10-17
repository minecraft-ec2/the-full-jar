import { initializeApp } from 'firebase/app';
import { signInWithEmailAndPassword, getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

const app = initializeApp({
    apiKey: import.meta.env.PROD ? 'AIzaSyCGn4BO1ODLIR23pmmJ0aSqsyRMu_cmnyk' : 'AIzaSyA82-4qHPLRVug60YtQVM-t-x48nslDTak',
    authDomain: 'cookie-jar-smp.firebaseapp.com',
    projectId: 'cookie-jar-smp',
    storageBucket: 'cookie-jar-smp.appspot.com',
    messagingSenderId: '462122566954',
    appId: '1:462122566954:web:155453786420ad3f708a53'
});

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
let isElevatedUserDocumentReference;

const sendStartCommand = httpsCallable(functions, 'start')

export const start = async () => (await sendStartCommand()).data;
export const stats = httpsCallable(functions, 'stats');

export const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    console.debug(credential.user);
};

export const logout = () => signOut(auth);

export const addAuthListener = (func) => onAuthStateChanged(auth, func);

export const isElevatedUser = async () => (await getDoc(isElevatedUserDocumentReference)).exists();

addAuthListener(credential => {
    isElevatedUserDocumentReference = doc(db, '/elevated-users/' + credential.uid);
});