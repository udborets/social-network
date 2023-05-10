import { db } from "../db/index.js";
import { TypedRequestBody } from "../models.js";

const registration = async (
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
    if (foundName.length !== 0) {
      return res.send({
        OK: false,
        message: "This username is already taken",
      });
    }
    if (foundEmail.length !== 0) {
      console.log(foundEmail);
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
};

const authentication = async (
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
};

export const authRoutes = {
  authentication,
  registration,
};
