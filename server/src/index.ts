import cors from "cors";
import express from "express";

import { authRoutes } from "./routes/auth.js";
import { friendsRoutes } from "./routes/friends.js";
import { postsRoutes } from "./routes/posts.js";
import { usersRoutes } from "./routes/users.js";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/auth/registration", authRoutes.registration);

app.post("/auth/authorization", authRoutes.authentication);

app.post("/users", usersRoutes.all);

app.post("/users/id", usersRoutes.id);

app.post("/users/update", usersRoutes.update);

app.post("/posts", postsRoutes.all);

app.post("/posts/update", postsRoutes.update);

app.post("/posts/create", postsRoutes.create);

app.post("/friends", friendsRoutes.all);

app.post("/friends/add", friendsRoutes.add);

app.post("/friends/remove", friendsRoutes.remove);

app.listen(5000, () => {
  console.log("listening http://localhost:5000");
});
