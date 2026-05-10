exports.handler = async (event) => {
  const { url } = event.queryStringParameters || {};
  if (!url) return { statusCode: 400, body: 'url required' };

  try {
    const res = await fetch(decodeURIComponent(url), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://annas-archive.org/',
      },
    });

    if (!res.ok) return { statusCode: res.status, body: 'fetch failed' };

    const contentType = res.headers.get('content-type') || 'application/pdf';
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400',
      },
      body: base64,
      isBase64Encoded: true,
    };
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};
