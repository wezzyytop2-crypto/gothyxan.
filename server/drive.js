// Пример, если ты будешь использовать Google Drive API
// Необязательно, можно пока использовать прямые URL изображений
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const KEYFILEPATH = path.join(__dirname, "credentials.json");
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES
});

async function uploadFile(filename, filepath) {
    const drive = google.drive({ version: "v3", auth });
    const fileMetadata = { name: filename };
    const media = { mimeType: 'image/png', body: fs.createReadStream(filepath) };
    const file = await drive.files.create({ resource: fileMetadata, media, fields: 'id' });
    return `https://drive.google.com/uc?id=${file.data.id}`;
}

module.exports = { uploadFile };
