import fs from "fs";
import path from "path";

const uploadDir = "./uploads";

// Створюємо папку, якщо її немає
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

export function saveFile(data) {
  return new Promise((resolve, reject) => {
    const fileName = `up_${Date.now()}.mp3`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFile(filePath, data, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log(`File saved as ${filePath}`);
        resolve(`/uploads/${fileName}`);
      }
    });
  });
}
