import express from "express";
import fs from "fs";

const uploadDir = "./uploads";
export const fileRoutes = express.Router();

fileRoutes.get("/files", (req, res) => {
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
