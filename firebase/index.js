const admin = require('firebase-admin');

const serviceAccount = require('../config/fbServiceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    // databaseURL: 'https://ecommerce-e53f3.firebaseio.com',
});

module.exports = admin;
