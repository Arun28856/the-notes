import admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('../../the-notes-8047e-firebase-adminsdk-fbsvc-9a6df6bc9d.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export default admin;