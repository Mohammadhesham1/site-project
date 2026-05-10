const RAPID_KEY = '6063f46b64msh60311f8db150077p1a9e1djsn408e2c59887f';

exports.handler = async (event) => {
  const { q = '', lang = '', format = '', page = '1' } = event.queryStringParameters || {};
  if (!q) return { statusCode: 400, body: JSON.stringify({ error: 'query required' }) };

  const params = new URLSearchParams({
    query: q,
    page: page,
    ...(lang && { language: lang }),
    ...(format && { format }),
  });

  try {
    const res = await fetch(`https://annas-archive-api.p.rapidapi.com/searchBook?${params}`, {
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
