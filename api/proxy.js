export const config = {
  api: {
    bodyParser: false, // Отключаем парсинг, чтобы передать аудио-байты без изменений
  },
};

export default async function handler(req, res) {
  const targetUrl = "https://api.groq.com" + req.url;
  
  // Собираем тело запроса в буфер
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks);

  const headers = { ...req.headers };
  delete headers.host; // Удаляем host, чтобы Groq принял запрос

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
