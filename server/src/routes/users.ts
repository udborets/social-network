import { db } from "../db/index.js";
import { TypedRequestBody } from "../models.js";

const id = async (req: TypedRequestBody<{ id: string }>, res) => {
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
};

const all = async (req, res) => {
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
};

const update = async (
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
};

export const usersRoutes = {
  id,
  all,
  update,
};
