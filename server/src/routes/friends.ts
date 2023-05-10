import { db } from "../db/index.js";
import { TypedRequestBody } from "../models.js";

const all = async (req, res) => {
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
};

const add = async (
  req: TypedRequestBody<{ userId: string; friendId: string }>,
  res
) => {
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
};

const remove = async (req: TypedRequestBody<{ userId: string; friendId: string }>, res) => {
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

export const friendsRoutes = {
  all,
  add,
  remove,
};
