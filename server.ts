import express from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import COS from "cos-nodejs-sdk-v5";
import path from "path";
import fs from "fs";

// Initialize COS instance (Users need to provide these via .env)
const cos = new COS({
  SecretId: process.env.TENCENT_SECRET_ID || "MOCK_SECRET_ID",
  SecretKey: process.env.TENCENT_SECRET_KEY || "MOCK_SECRET_KEY",
});

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  
  app.use(express.json());

  // API Routes
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Example proxy/upload API to COS
  app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
      const file = req.file;
      const { name } = req.body; // e.g., display name

      if (!file) {
        return res.status(400).json({ error: "No file provided" });
      }

      const bucket = process.env.TENCENT_BUCKET || "your-bucket-1250000000";
      const region = process.env.TENCENT_REGION || "ap-guangzhou";

      // Mock block: If credentials aren't set, just return mock success
      if (process.env.TENCENT_SECRET_ID === undefined) {
         console.warn("No Tencent credentials found. Mocking upload success.");
         return res.json({ 
           id: Date.now().toString(),
           url: `https://${bucket}.cos.${region}.myqcloud.com/mock/${file.originalname}`,
           name: name || file.originalname,
           type: file.mimetype.startsWith("video/") ? "video" : "image",
           size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
           uploadTime: new Date().toLocaleDateString('zh-CN', { hour: '2-digit', minute: '2-digit' })
         });
      }

      // Real Upload
      const key = `uploads/${Date.now()}-${file.originalname}`;
      cos.putObject({
        Bucket: bucket,
        Region: region,
        Key: key,
        Body: file.buffer,
        ContentLength: file.size,
        ContentType: file.mimetype,
      }, (err, data) => {
        if (err) {
          console.error("COS Upload Error:", err);
          return res.status(500).json({ error: "Failed to upload to COS" });
        }
        res.json({
           id: Date.now().toString(),
           url: `https://${bucket}.cos.${region}.myqcloud.com/${key}`,
           name: name || file.originalname,
           type: file.mimetype.startsWith("video/") ? "video" : "image",
           size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
           uploadTime: new Date().toLocaleDateString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


  // Delete API
  app.post("/api/delete", (req, res) => {
    const { key } = req.body;
    
    const bucket = process.env.TENCENT_BUCKET || "your-bucket-1250000000";
    const region = process.env.TENCENT_REGION || "ap-guangzhou";

    if (process.env.TENCENT_SECRET_ID === undefined) {
      return res.json({ success: true, message: "Mock deletion success" });
    }

    cos.deleteObject({
      Bucket: bucket,
      Region: region,
      Key: key,
    }, (err, data) => {
      if (err) {
        console.error("COS Delete Error:", err);
        return res.status(500).json({ error: "Failed to delete from COS" });
      }
      res.json({ success: true });
    });
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
