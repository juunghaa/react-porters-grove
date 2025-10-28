// /api/proxy.js
export default async function handler(req, res) {
    try {
      const response = await fetch("http://52.79.131.1/api/v1/auth/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
  
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error("❌ Proxy error:", error);
      res.status(500).json({ error: "Proxy request failed" });
    }
  }