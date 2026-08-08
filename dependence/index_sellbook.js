const fs = require('fs');
const path = require('path');
const https = require('https');

const keepAliveAgent = new https.Agent({ keepAlive: true, maxSockets: 50 });

let projectId = '';
try {
  const keyPath = path.join(__dirname, 'serviceAccountKey.json');
  if (fs.existsSync(keyPath)) {
    const rawData = fs.readFileSync(keyPath, 'utf8').replace(/^\uFEFF/, '');
    projectId = JSON.parse(rawData).project_id;
  }
} catch (e) {}


function fetchAllBooks(projectId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'firestore.googleapis.com',
      port: 443,
      path: `/v1/projects/${projectId}/databases/(default)/documents/books`,
      method: 'GET',
      agent: keepAliveAgent,
      headers: { 'Accept': 'application/json' },
      timeout: 8000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.documents || []);
          } catch (e) { reject(e); }
        } else {
          resolve([]);
        }
      });
    });

    req.on('timeout', () => { req.destroy(); reject(new Error("Timeout")); });
    req.on('error', (err) => reject(err));
    req.end();
  });
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  let method = 'GET';
  try {
    const eventObj = typeof event === 'string' ? JSON.parse(event) : event;
    method = eventObj.requestContext?.http?.method || eventObj.httpMethod || 'GET';
  } catch (e) {}

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, isBase64Encoded: false, body: '' };
  }

  try {
    const documents = await fetchAllBooks(projectId);

    if (!documents || documents.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ error: true, message: "No books found in Firestore" })
      };
    }

    const randomIndex = Math.floor(Math.random() * documents.length);
    const selectedDoc = documents[randomIndex];
    const fields = selectedDoc.fields || {};

    const bookName = fields.name?.stringValue || fields.Name?.stringValue || "Unknown Title";

    const rawIsbn = fields.isbn?.integerValue || 
          fields.isbn?.stringValue || 
          fields.isbn?.doubleValue || 
          fields.ISBN?.integerValue || 
          fields.ISBN?.stringValue ;

    const isbn = String(rawIsbn); 

    const cleanIsbn = String(isbn).trim();
    const isStandardIsbn = (cleanIsbn.length === 10 || cleanIsbn.length === 13) && /^\d+$/.test(cleanIsbn);


    const coverUrl = isStandardIsbn
      ? `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`
      : `https://via.placeholder.com/300x400/2f3542/ffffff?text=${encodeURIComponent(bookName)}`;


    const responsePayload = {
      success: true,
      cardId: `CARD-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      book: {
        name: bookName,
        isbn: isbn,
        coverUrl: coverUrl
      }
    };

    return {
      statusCode: 200,
      headers,
      isBase64Encoded: false,
      body: JSON.stringify(responsePayload)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: true, message: error.message })
    };
  }
};