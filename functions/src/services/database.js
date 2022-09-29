const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();

const collection = getFirestore().collection('main');
const ipDocument = collection.doc('ip'),
    apikeyDocument = collection.doc('apikey');;

exports.getAPIKEY = async () => (await apikeyDocument.get()).data().value;

exports.getIP = async () => (await ipDocument.get()).data().value;

exports.setIP = async (ip) => await ipDocument.update({ value: ip });