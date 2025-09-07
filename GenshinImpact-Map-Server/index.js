import express from "express";
import cors from "cors";
import open from "open";
import apiRouter from "./routes/api.js";
import path from "path";
import { fileURLToPath } from "url"; // 新增导入
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3454;

const allowedOrigin = [
  "http://genshin.impact.map.react.shaoyahu.com.cn",
  "http://genshin.impact.map.vue.shaoyahu.com.cn",
];

// 启用 CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigin.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "public")));

// 解析 JSON 请求体
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API 路由
app.use("/api", apiRouter);

// 启动服务器
app.listen(PORT, async () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Mock server running on ${url}`);

  try {
    await open(url);
  } catch (error) {
    console.error("无法自动打开浏览器:", error.message);
    console.log(`请手动访问: ${url}`);
  }
});
