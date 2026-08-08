const fs = require('fs');
const path = require('path');
const https = require('https');

const keepAliveAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 50
});

let projectId = '';
try {
  const keyPath = path.join(__dirname, 'serviceAccountKey.json');
  if (fs.existsSync(keyPath)) {
    const rawData = fs.readFileSync(keyPath, 'utf8').replace(/^\uFEFF/, '');
    const keyObj = JSON.parse(rawData);
    projectId = keyObj.project_id;
  }
} catch (e) {
  console.error("Failed to read serviceAccountKey.json:", e.message);
}

function fetchFirestoreDocs(projectId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'firestore.googleapis.com',
      port: 443,
      path: `/v1/projects/${projectId}/databases/(default)/documents/books`,
      method: 'GET',
      agent: keepAliveAgent,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AliyunFC/Nodejs'
      },
      timeout: 8000 
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error("JSON Parse Error"));
          }
        } else if (res.statusCode === 404) {
          resolve({ documents: [] });
        } else {
          reject(new Error(`Firestore API Http ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error("Request timed out after 8000ms"));
    });

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
    return {
      statusCode: 200,
      headers,
      isBase64Encoded: false,
      body: ''
    };
  }

  if (!projectId) {
    return {
      statusCode: 500,
      headers,
      isBase64Encoded: false,
      body: JSON.stringify({ error: true, message: "Missing project_id in serviceAccountKey.json" })
    };
  }

  try {
    const data = await fetchFirestoreDocs(projectId);
    const count = (data.documents && Array.isArray(data.documents)) ? data.documents.length : 0;

    return {
      statusCode: 200,
      headers,
      isBase64Encoded: false,
      body: JSON.stringify({ count })
    };
  } catch (error) {
    console.error("Fetch Error:", error.message);
    return {
      statusCode: 500,
      headers,
      isBase64Encoded: false,
      body: JSON.stringify({ error: true, message: error.message })
    };
  }
};