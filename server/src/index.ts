import cors from "cors";
import express from "express";

import { db } from "./db/index.js";
import { TypedRequestBody } from "./models.js";

const app = express();

app.use(express.json());
app.use(cors());

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
      const foundEmail = await db.user.findMany({
        where: {
          email: req.body.email,
        },
        include: {
          posts: true,
        },
      });
      const foundName = await db.user.findMany({
        where: {
          name: req.body.name,
        },
        include: {
          posts: true,
        },
      });
      if (!foundEmail.length && !foundName.length) {
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
      if (foundName) {
        return res.send({
          OK: false,
          message: "This username is already taken",
        });
      }
      if (foundEmail) {
        return res.send({
          OK: false,
          message: "This email is already taken",
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
    const foundUser = await db.user.findUnique({
      where: { id: req.body.id },
      include: { posts: true },
    });
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
  const allUsers = await db.user.findMany({
    include: {
      posts: true,
    },
  });
  res.send({
    users: allUsers,
    OK: true,
    message: "",
  });
});

app.post(
  "/users/update",
  async (
    req: TypedRequestBody<{
      id: string;
      avatarUrl: string;
      age?: string;
      city?: string;
      univ?: string;
    }>,
    res
  ) => {
    try {
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
          age: req.body.age ?? oldUserInfo?.age,
          city: req.body.city ?? oldUserInfo?.city,
          univ: req.body.univ ?? oldUserInfo?.univ,
        },
      });
      return res.send({
        OK: true,
        message: "",
        user: updatedUser,
      });
    } catch (e) {
      return res.send({
        OK: false,
        message: JSON.stringify(e),
      });
    }
  }
);

app.post("/posts", async (req, res) => {
  try {
    const allPosts = await db.post.findMany({
      include: {
        owner: true,
      },
    });
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

app.post(
  "/posts/update",
  async (
    req: TypedRequestBody<{
      id: string;
      likedBy: string[];
      userId: string;
    }>,
    res
  ) => {
    try {
      const oldPostInfo = await db.post.findUnique({
        where: {
          id: req.body.id,
        },
      });
      const updatedPost = await db.post.update({
        where: {
          id: req.body.id,
        },
        data: {
          likedBy: {
            set: [...(req.body?.likedBy ?? oldPostInfo.likedBy)],
          },
        },
        include: {
          owner: true,
        },
      });
      res.send({
        OK: true,
        message: "",
        post: updatedPost,
      });
    } catch (e) {
      res.send({
        OK: false,
        message: JSON.stringify(e),
      });
    }
  }
);

app.post(
  "/posts/create",
  async (
    req: TypedRequestBody<{
      ownerId: string;
      text: string;
      imageUrl: string;
    }>,
    res
  ) => {
    try {
      const createdPost = await db.post.create({
        data: {
          ownerId: req.body.ownerId,
          text: req.body.text ?? null,
          imageUrl: req.body.imageUrl ?? null,
        },
        include: {
          owner: true,
        },
      });
      if (createdPost) {
        return res.send({
          OK: true,
          post: createdPost,
          message: "",
        });
      }
      if (!createdPost) {
        return res.send({
          OK: false,
          post: null,
          message: "error while creating post",
        });
      }
    } catch (e) {
      return res.send({
        OK: false,
        message: JSON.stringify(e),
      });
    }
  }
);

app.post("/friends", async (req: TypedRequestBody<{}>, res) => {
  try {
    const friends = await db.friends.findMany();
    if (friends) {
      return res.send({
        OK: true,
        friends: friends,
      });
    }
    return res.send({
      OK: false,
      message: "friends not found",
    });
  } catch (e) {
    return res.send({
      OK: false,
      message: JSON.stringify(e),
    });
  }
});

app.post(
  "/friends/add",
  async (req: TypedRequestBody<{ userId: string; friendId: string }>, res) => {
    try {
      const createdFriend1 = await db.friends.create({
        data: {
          friendId: req.body.friendId,
          userId: req.body.userId,
        },
      });
      const createdFriend2 = await db.friends.create({
        data: {
          friendId: req.body.userId,
          userId: req.body.friendId,
        },
      });
      return res.send({
        OK: true,
        message: "",
      });
    } catch (e) {
      return res.send({
        OK: false,
        message: JSON.stringify(e),
      });
    }
  }
);

app.post(
  "/friends/remove",
  async (req: TypedRequestBody<{ userId: string; friendId: string }>, res) => {
    try {
      const foundFriend1 = await db.friends.findFirst({
        where: {
          friendId: req.body.friendId,
          userId: req.body.userId,
        },
      });
      const foundFriend2 = await db.friends.findFirst({
        where: {
          friendId: req.body.userId,
          userId: req.body.friendId,
        },
      });
      if (foundFriend1 && foundFriend2) {
        await db.friends.delete({
          where: {
            id: foundFriend1.id,
          },
        });
        await db.friends.delete({
          where: {
            id: foundFriend2.id,
          },
        });
        return res.send({
          OK: true,
          message: "",
        });
      }
      return res.send({
        OK: false,
        message: "friendship not found",
      });
    } catch (e) {
      return res.send({
        OK: false,
        message: JSON.stringify(e),
      });
    }
  }
);

app.listen(5000, () => {
  console.log("listening http://localhost:5000");
});
