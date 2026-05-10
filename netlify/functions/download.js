const RAPID_KEY = '6063f46b64msh60311f8db150077p1a9e1djsn408e2c59887f';

exports.handler = async (event) => {
  const { md5 } = event.queryStringParameters || {};
  if (!md5) return { statusCode: 400, body: JSON.stringify({ error: 'md5 required' }) };

  try {
    const res = await fetch(`https://annas-archive-api.p.rapidapi.com/downloadBook?md5=${md5}`, {
      headers: {
        'X-RapidAPI-Key': RAPID_KEY,
        'X-RapidAPI-Host': 'annas-archive-api.p.rapidapi.com',
      },
    });
    const data = await res.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
