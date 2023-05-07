import express from "express";
import cors from "cors";
import { db } from "./db";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/get", async (req, res) => {
  const allUsers = await db.user.findMany();
  res.send(JSON.stringify(allUsers));
});

app.listen(3000, () => {
  console.log('listening http://localhost:3000')
})