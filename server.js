import { WebSocketServer } from "ws";
import express from "express";
import fs from "fs";
import path from "path";
import http from "http";
import cors from "cors";

const uploadDir = "./uploads";

// Створюємо папку, якщо її немає
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Ініціалізація Express
const app = express();
app.use(cors());
app.use("/uploads", express.static(uploadDir)); // Роздаємо файли

// Створюємо HTTP-сервер і WebSocket-сервер на одному порту
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  ws.on("message", (message) => {
    console.log("Received data");

    if (!message || message.length === 0) {
      ws.send("Empty file received");
      return;
    }

    // Перевіряємо, чи це бінарні дані
    if (Buffer.isBuffer(message)) {
      const fileName = `uploaded_${Date.now()}.mp3`;
      const filePath = path.join(uploadDir, fileName);

      // Зберігаємо файл
      fs.writeFile(filePath, message, (err) => {
        if (err) {
          console.error("Error saving file:", err);
          ws.send("Error saving file");
        } else {
          console.log(`File saved as ${filePath}`);
          // Повертаємо правильний URL файлу
          const fileUrl = `/uploads/${fileName}`;
          ws.send(`File received and saved as ${fileUrl}`);
        }
      });
    } else {
      ws.send("Invalid data format. Expected binary data.");
    }
  });

  ws.send("Welcome to WebSocket server!");
});

app.get("/api/files", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to read files" });
    }

    const fileUrls = files.map(
      (file) => `http://localhost:8080/uploads/${file}`
    );
    res.json(fileUrls);
  });
});

// Запускаємо сервер
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
