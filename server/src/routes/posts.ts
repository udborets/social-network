import { db } from "../db/index.js";
import { TypedRequestBody } from "../models.js";

const all = async (req, res) => {
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
};

const update = async (
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
};

const create = async (
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
};

export const postsRoutes = {
  all,
  update,
  create,
};
