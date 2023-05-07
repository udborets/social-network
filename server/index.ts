import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/:id/a", (req, res) => {
  res.send(req.json());
});