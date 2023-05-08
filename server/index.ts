import cors from "cors";
import express from "express";

import { db } from "./db";
import { TypedRequestBody } from "./models";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/users", async (req, res) => {
  try {
    const allUsers = await db.user.findMany();
    res.send({
      users: allUsers,
      OK: true,
      message: "",
    });
  } catch (e) {
    res.send({
      OK: false,
      message: JSON.stringify(e),
    });
  }
});

app.post(
  "/auth/registration",
  async (
    req: TypedRequestBody<{
      id: string;
      name: string;
      email: string;
      avatarUrl: string;
      password: string;
    }>,
    res
  ) => {
    try {
      console.log(req.body.id);
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
            id: req.body.id,
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
          message: "This username is already taken",
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

app.post("/users/id", async (req: TypedRequestBody<{ id: string }>, res) => {
  try {
    const foundUser =await db.user.findUnique({
      where: { id: req.body.id },
      include: { posts: true },
    });
    console.log(foundUser)
    if (!foundUser) {
      return res.send({
        user: null,
        OK: false,
        message: "no user with such id",
      });
    }
    return res.send({
      user: foundUser,
      OK: true,
      message: "",
    });
  } catch (e) {
    console.error(e);
    res.send({
      OK: false,
      message: "user not found",
    });
  }
});

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

app.post(
  "user/update",
  async (
    req: TypedRequestBody<{
      id: string;
      avatarUrl: string;
      age?: number;
      city?: string;
      univ?: string;
    }>,
    res
  ) => {
    const oldUserInfo = await db.user.findUnique({
      where: {
        id: req.body.id,
      },
    });
    if (!oldUserInfo) {
      res.send({
        OK: false,
        message: "No user with this id",
      });
    }
    const updatedUser = await db.user.update({
      where: {
        id: req.body.id,
      },
      data: {
        age: req.body.age ?? oldUserInfo?.age ?? null,
        city: req.body.city ?? oldUserInfo?.city ?? null,
        univ: req.body.univ ?? oldUserInfo?.univ ?? null,
      },
    });
    return res.send({
      OK: true,
      message: "",
      user: updatedUser,
    });
  }
);

app.get("posts", async (req, res) => {
  try {
    const allPosts = await db.post.findMany();
    res.send({
      OK: true,
      message: "",
      posts: allPosts,
    });
  } catch (e) {
    res.send({
      OK: false,
      message: JSON.stringify(e),
    });
  }
});

app.listen(5000, () => {
  console.log("listening http://localhost:5000");
});
