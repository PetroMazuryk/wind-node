import express from "express";
import http from "http";
import cors from "cors";
import { setupWebSocket } from "./services/setupWebSocket.js";
import { fileRoutes } from "./routes/fileRoutes.js";

const uploadDir = "./uploads";

// Ініціалізація Express
const app = express();
app.use(cors());
app.use("/uploads", express.static(uploadDir)); // Роздаємо файли

// Додаємо маршрути
app.use("/api", fileRoutes);

// Створюємо HTTP-сервер
const server = http.createServer(app);

// Налаштовуємо WebSocket
setupWebSocket(server);

// Запускаємо сервер
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
