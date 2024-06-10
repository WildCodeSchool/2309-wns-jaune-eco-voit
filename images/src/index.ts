import express, { Response } from "express"; // on importe express
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";

const app = express(); // on instancie express
const port = 8000;
app.use(cors()); // on autorise tout le monde à accêder à l'API

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
// on instancie multer en lui passant le middleware de stockage
app.get("/", (req: any, res: Response) => {
  res.send("Hello World!");
});

app.post("/profile", upload.single("avatar"), (req: any, res: Response) => {
  fs.readFile(req.file.path, (err, content) => {
    if (err) {
      res.status(500).send({ error: err });
    }
    res.status(201).send({ status: "success", filename: req.file.filename });
  });
});

app.get("/avatar/:filename", (req: any, res: Response) => {
  const file = path.join(__dirname, "/../uploads", req.params.filename);
  fs.readFile(file, (err, content) => {
    if (err) {
      res.set("Content-Type", "text");
      res.status(404).send("File not found");
    }
    res.set("Content-Type", "application/octet-stream");
    res.status(200).send(content);
  });
});

app.listen(port, () => {
  console.log(`Image uploader is listening on port ${port}`);
});
