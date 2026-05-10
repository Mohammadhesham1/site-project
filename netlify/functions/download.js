const https = require('https');

const RAPID_KEY = '6063f46b64msh60311f8db150077p1a9e1djsn408e2c59887f';
const RAPID_HOST = 'annas-archive-api.p.rapidapi.com';

function httpsGet(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
    req.end();
  });
}

exports.handler = async (event) => {
  const { md5 } = event.queryStringParameters || {};
  if (!md5) return {
    statusCode: 400,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ error: 'md5 required' })
  };

  try {
    const result = await httpsGet({
      hostname: RAPID_HOST,
      path: `/downloadBook?md5=${md5}`,
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPID_KEY,
        'X-RapidAPI-Host': RAPID_HOST,
      }
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: result.body,
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
