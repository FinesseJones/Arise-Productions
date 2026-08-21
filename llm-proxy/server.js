import express from "express";
const app = express();
app.use(express.json({ limit: "1mb" }));
const NVIDIA_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
app.get("/api/health", (_req, res) => res.json({ ok: true, key: !!NVIDIA_KEY }));
app.post("/api/chat", async (req, res) => {
  if (!NVIDIA_KEY) return res.status(500).json({ error: "NVIDIA_API_KEY not set" });
  try {
    const r = await fetch(NVIDIA_URL, {
      method: "POST",
      headers: { "Authorization": `Bearer ${NVIDIA_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: req.body.model || "meta/llama-3.1-70b-instruct",
        messages: req.body.messages || [],
        temperature: req.body.temperature ?? 0.6,
        max_tokens: req.body.max_tokens ?? 1024,
        stream: false,
      }),
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});
app.listen(8787, () => console.log("llm-proxy listening on :8787"));
