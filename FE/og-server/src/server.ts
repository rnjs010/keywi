import express from "express";
import cors from "cors";
import { fetchOgTags } from "./utils/feachOgTags";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get("/api/og", async (req, res) => {
  const url = req.query.url as string;
  if (!url) return res.status(400).json({ error: "url 쿼리 파라미터 필요" });

  try {
    const data = await fetchOgTags(url);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ OGTag 서버가 포트 ${PORT}번에서 실행 중입니다.`);
});
