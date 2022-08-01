const fs = require('fs');

const targetPath = './src/environments/environment.prod.ts';
const file = fs.readFileSync(targetPath, 'utf8');
const newFile = file.replace('GOOGLE_MAPS_API_KEY', process.env.GOOGLE_MAPS_API_KEY)
    .replace('FIREBASE_CONFIG_API_KEY', process.env.FIREBASE_CONFIG_API_KEY)
    .replace('FIREBASE_CONFIG_AUTH_DOMAIN', process.env.FIREBASE_CONFIG_AUTH_DOMAIN)
    .replace('FIREBASE_CONFIG_DATABASE_URL', process.env.FIREBASE_CONFIG_DATABASE_URL)
    .replace('FIREBASE_CONFIG_PROJECT_ID', process.env.FIREBASE_CONFIG_PROJECT_ID)
    .replace('FIREBASE_CONFIG_STORAGE_BUCKET', process.env.FIREBASE_CONFIG_STORAGE_BUCKET)
    .replace('FIREBASE_CONFIG_MESSAGING_SENDER_ID', process.env.FIREBASE_CONFIG_MESSAGING_SENDER_ID)
    .replace('FIREBASE_CONFIG_APP_ID', process.env.FIREBASE_CONFIG_APP_ID)
    .replace('CLOUD_FUNCTIONS_URL', process.env.CLOUD_FUNCTIONS_URL)
    .replace('OFFLINE_BASE_MAP_SOURCES_URL', process.env.OFFLINE_BASE_MAP_SOURCES_URL);

fs.writeFileSync(targetPath, newFile);