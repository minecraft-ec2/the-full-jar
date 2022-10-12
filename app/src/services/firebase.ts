import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';

const app = initializeApp({
    apiKey: 'AIzaSyCGn4BO1ODLIR23pmmJ0aSqsyRMu_cmnyk',
    authDomain: 'cookie-jar-smp.firebaseapp.com',
    projectId: 'cookie-jar-smp',
    storageBucket: 'cookie-jar-smp.appspot.com',
    messagingSenderId: '462122566954',
    appId: '1:462122566954:web:155453786420ad3f708a53'
});

const auth = getAuth(app);

export const login = () => signInAnonymously(auth);

export const getStatus = () => {

};