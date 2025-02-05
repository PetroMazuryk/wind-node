import { WebSocketServer } from "ws";
import { saveFile } from "./saveFile.js";

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection");

    ws.on("message", async (message) => {
      console.log("Received data");

      if (!message || message.length === 0) {
        ws.send("Empty file received");
        return;
      }

      // Перевіряємо, чи це бінарні дані
      if (Buffer.isBuffer(message)) {
        try {
          const fileUrl = await saveFile(message);
          ws.send(`File received and saved as ${fileUrl}`);
        } catch (error) {
          console.error("Error saving file:", error);
          ws.send("Error saving file");
        }
      } else {
        ws.send("Invalid data format. Expected binary data.");
      }
    });

    ws.send("Welcome to WebSocket server!");
  });
}
