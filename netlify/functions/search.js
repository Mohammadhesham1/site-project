const https = require('https');

const RAPID_KEY = '6063f46b64msh60311f8db150077p1a9e1djsn408e2c59887f';

function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error('JSON parse error: ' + data.slice(0,200))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

exports.handler = async (event) => {
  const { q = '', lang = '', format = '', page = '1' } = event.queryStringParameters || {};
  if (!q) return { statusCode: 400, body: JSON.stringify({ error: 'query required' }) };

  const params = new URLSearchParams({ query: q, page });
  if (lang) params.set('language', lang);
  if (format) params.set('format', format);

  const url = `https://annas-archive-api.p.rapidapi.com/searchBook?${params}`;

  try {
    const data = await httpsGet(url, {
      'X-RapidAPI-Key': RAPID_KEY,
      'X-RapidAPI-Host': 'annas-archive-api.p.rapidapi.com',
    });
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
