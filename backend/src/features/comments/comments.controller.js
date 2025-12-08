const prisma = require("../../config/prisma");

const createComment = async (req, res) => {
  try {
    const { content, postId, parentCommentId } = req.body;
    const userId = req.user.id;

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        postId,
        parentCommentId: parentCommentId || null
      },
      include: {
        user: { select: { username: true, id: true } }
      }
    });

    res.json(comment);
  } catch (err) {
    console.error("Create Comment Error:", err);
    res.status(500).json({ error: "Failed to create comment" });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: { select: { username: true, id: true } },
        likes: { select: { userId: true } },
        _count: { select: { likes: true, replies: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Transform to include isLiked and likeCount
    const commentsWithLikes = comments.map(comment => ({
      ...comment,
      userId: comment.userId,
      isLiked: req.user ? comment.likes.some(like => like.userId === req.user.id) : false,
      likeCount: comment._count.likes,
      replyCount: comment._count.replies,
      likes: undefined,
      _count: undefined
    }));

    res.json(commentsWithLikes);
  } catch (err) {
    console.error("Get Comments Error:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Check ownership
    const comment = await prisma.comment.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ message: "You can only edit your own comments" });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        user: { select: { username: true, id: true } }
      }
    });

    res.json(updatedComment);
  } catch (err) {
    console.error("Update Comment Error:", err);
    res.status(500).json({ error: "Failed to update comment" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check ownership
    const comment = await prisma.comment.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    await prisma.comment.delete({ where: { id } });

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Delete Comment Error:", err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

const toggleCommentLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId: id
        }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.commentLike.delete({
        where: { id: existingLike.id }
      });
      res.json({ message: "Comment unliked", liked: false });
    } else {
      // Like
      try {
        await prisma.commentLike.create({
          data: {
            userId,
            commentId: id
          }
        });
        res.json({ message: "Comment liked", liked: true });
      } catch (createErr) {
        if (createErr.code === 'P2002') {
          return res.status(400).json({ message: "You have already liked this comment", liked: true });
        }
        throw createErr;
      }
    }
  } catch (err) {
    console.error("Toggle Comment Like Error:", err);
    res.status(500).json({ error: "Failed to toggle comment like" });
  }
};

module.exports = { createComment, getCommentsByPost, updateComment, deleteComment, toggleCommentLike };
