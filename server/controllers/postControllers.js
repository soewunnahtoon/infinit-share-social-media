import { Comment } from "../models/Comment.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

const createPost = async (req, res) => {
  try {
    //Get Datas from the Request
    const { userId } = req.body.user;
    const { description, image } = req.body;
    if (!description) {
      return res
        .status(404)
        .json({ message: "You must provide a description." });
    }
    //Create and Save Post
    const createPost = await Post.create({
      userId,
      description,
      image,
    });

    return res.status(204).json({
      sucess: true,
      message: "Post created successfully.",
      data: createPost,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    //Get the Datas from Request
    const { userId } = req.body.user;
    const { search } = req.body;

    const user = await User.findById(userId);
    const friends = user?.friends?.toString().split(",") ?? [];
    friends.push(userId);
    //Search Options
    const searchPostQuery = {
      $or: [
        {
          description: { $regex: search, $options: "i" },
        },
      ],
    };
    // Search Post
    const posts = await Post.find(search ? searchPostQuery : {})
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 });

    const friendsPosts = posts?.filter((post) =>
      friends.includes(post?.userId?._id.toString())
    );

    const otherPosts = posts?.filter(
      (post) => !friends.includes(post?.userId?._id.toString())
    );

    let postsRes = null;

    if (friendsPosts?.length > 0) {
      postsRes = search ? friendsPosts : [...friendsPosts, ...otherPosts];
    } else {
      postsRes = posts;
    }

    return res.status(200).json({
      sucess: true,
      message: "Get posts successfully.",
      data: postsRes,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "firstName lastName location profileUrl -password",
        },
        options: {
          sort: "-_id",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "replies.userId",
          select: "firstName lastName location profileUrl -password",
        },
      });

    return res.status(204).json({
      sucess: true,
      message: "Get post successfully.",
      data: post,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.find({ userId: id })
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 });

    return res.status(200).json({
      sucess: true,
      message: "Get user post successfully.",
      data: post,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;

    const post = await Post.findById(id);

    const index = post.likes.findIndex((pid) => pid === String(userId));
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter((pid) => pid !== String(userId));
    }

    const newPost = await Post.findByIdAndUpdate(id, post, {
      new: true,
    });

    return res.status(200).json({
      sucess: true,
      message: "Like post successfully.",
      data: newPost,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const commentPost = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { comment, from } = req.body;
    const { id } = req.params;

    if (!comment) {
      return res.status(404).json({ message: "Comment is required." });
    }

    const newComment = await Comment.create({
      comment,
      from,
      userId,
      postId: id,
    });

    const post = await Post.findById(id);
    post.comments.push(newComment._id);

    await Post.findByIdAndUpdate(id, post, {
      new: true,
    });

    return res.status(201).json(newComment);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    await Post.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Deleted post successfully.",
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const postComments = await Comment.find({ postId })
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .populate({
        path: "replies.userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 });

    return res.status(200).json({
      sucess: true,
      message: "Get comments successfully.",
      data: postComments,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const likeComment = async (req, res) => {
  const { userId } = req.body.user;
  const { id, replyId } = req.params;

  try {
    if (replyId === undefined || replyId === null || replyId === "false") {
      const comment = await Comment.findById(id);

      const index = comment.likes.findIndex((el) => el === String(userId));
      if (index === -1) {
        comment.likes.push(userId);
      } else {
        comment.likes = comment.likes.filter((i) => i !== String(userId));
      }

      const updated = await Comment.findByIdAndUpdate(id, comment, {
        new: true,
      });

      return res.status(201).json(updated);
    } else {
      const replyComments = await Comment.findOne(
        { _id: id },
        {
          replies: {
            $elemMatch: {
              _id: replyId,
            },
          },
        }
      );

      const index = replyComments?.replies[0]?.likes.findIndex(
        (i) => i === String(userId)
      );
      if (index === -1) {
        replyComments.replies[0].likes.push(userId);
      } else {
        replyComments.replies[0].likes = replyComments.replies[0]?.likes.filter(
          (i) => i !== String(userId)
        );
      }

      const query = { _id: id, "replies._id": replyId };

      const updated = {
        $set: {
          "replies.$.likes": replyComments.replies[0].likes,
        },
      };

      const result = await Comment.updateOne(query, updated, { new: true });

      return res.status(201).json(result);
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const replyComment = async (req, res) => {
  const { userId } = req.body.user;
  const { comment, replyAt, from } = req.body;
  const { id } = req.params;

  if (comment === null) {
    return res.status(404).json({ message: "Comment is required." });
  }

  try {
    const commentInfo = await Comment.findById(id);

    commentInfo.replies.push({
      comment,
      replyAt,
      from,
      userId,
      created_At: Date.now(),
    });

    commentInfo.save();

    return res.status(200).json(commentInfo);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export {
  createPost,
  getPosts,
  getPost,
  getUserPosts,
  likePost,
  commentPost,
  deletePost,
  getComments,
  likeComment,
  replyComment,
};
