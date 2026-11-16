export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const path = req.query.path || "/";

  if (path === "/health") {
    return res.status(200).send("OK");
  }

  try {
    const targetUrl = "https://groq.com" + path;

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const bodyBuffer = chunks.length > 0 ? Buffer.concat(chunks) : undefined;

    const headers = {
      "Authorization": req.headers["authorization"] || "",
    };
    if (req.headers["content-type"]) {
      headers["Content-Type"] = req.headers["content-type"];
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? bodyBuffer : undefined,
    });

    const data = await response.text();
    res.status(response.status).setHeader("Content-Type", "application/json").send(data);
  } catch (err) {
    res.status(500).json({ proxy_error: err.message });
  }
}
