import admin from 'firebase-admin';

let serviceAccount;

if (process.env.FIREBASE_PRIVATE_KEY) {
    // Use environment variables (required in production)
    serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };
} else if (process.env.NODE_ENV === 'production') {
    // Production requires environment variables
    throw new Error(
        'Firebase credentials not configured. Please set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL environment variables.'
    );
} else {
    // Development: use local JSON file
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    serviceAccount = require('../../the-notes-8047e-firebase-adminsdk-fbsvc-9a6df6bc9d.json');
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export default admin;
