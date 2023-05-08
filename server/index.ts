import cors from "cors";
import express from "express";

import { db } from "./db";
import { TypedRequestBody } from "./models";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/get", async (req, res) => {
  const allUsers = await db.user.findMany();
  res.send(JSON.stringify(allUsers));
});

app.post(
  "/auth/registration",
  async (
    req: TypedRequestBody<{
      name: string;
      email: string;
      avatarUrl: string;
      password: string;
    }>,
    res
  ) => {
    try {
      const foundEmail = await db.user.findUnique({
        where: {
          email: req.body.email,
        },
      });
      const foundName = await db.user.findUnique({
        where: {
          name: req.body.name,
        },
      });
      if (!foundEmail && !foundName) {
        const createdUser = await db.user.create({
          data: {
            email: req.body.email,
            name: req.body.name,
            avatarUrl: req.body.avatarUrl ?? null,
          },
          include: {
            posts: true,
          },
        });
        await db.passwords.create({
          data: {
            ownerId: createdUser.id,
            password: req.body.password,
          },
        });
        return res.send({
          user: createdUser,
          OK: true,
          message: "",
        });
      }
      if (foundEmail) {
        return res.send({
          OK: false,
          message: "This email is already taken",
        });
      }
      if (foundName) {
        return res.send({
          OK: false,
          message: "This name is already taken",
        });
      }
    } catch (e) {
      console.error(e);
      return res.send({
        OK: false,
        message: JSON.stringify(e),
      });
    }
  }
);

app.post(
  "/auth/authorization",
  async (
    req: TypedRequestBody<{
      email: string;
      password: string;
    }>,
    res
  ) => {
    try {
      const userByEmail = await db.user.findUnique({
        where: {
          email: req.body.email,
        },
        include: {
          posts: true,
        },
      });
      if (userByEmail) {
        const userByEmailPassword = await db.passwords.findUnique({
          where: {
            ownerId: userByEmail.id,
          },
        });
        if (userByEmailPassword?.password === req.body.password) {
          return res.send({
            user: userByEmail,
            OK: true,
            message: "",
          });
        }
        if (userByEmailPassword?.password !== req.body.password) {
          return res.send({
            OK: false,
            message: "Incorrect password",
          });
        }
      }
      if (!userByEmail) {
        return res.send({
          message: "No user with such email",
          OK: false,
        });
      }
    } catch (e) {
      console.error(e);
      return res.send({
        message: JSON.stringify(e),
        OK: false,
      });
    }
  }
);

app.post("/users", async (req, res) => {
  const allUsers = await db.user.findMany();
  res.send({
    users: allUsers,
    OK: true,
    message: "",
  });
});

app.listen(5000, () => {
  console.log("listening http://localhost:5000");
});
