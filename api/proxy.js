export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Формируем точный URL без лишних редиректов
  const targetUrl = `https://api.groq.com${req.url}`;
  
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks);

  const headers = {};
  if (req.headers['content-type']) headers['content-type'] = req.headers['content-type'];
  if (req.headers['authorization']) headers['authorization'] = req.headers['authorization'];

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? body : undefined,
    });

    const data = await response.arrayBuffer();
    res.status(response.status).send(Buffer.from(data));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
