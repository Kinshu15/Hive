const prisma = require("../../config/prisma");

const createPost = async (req, res) => {
  try {
    const { content, communityId } = req.body;
    const userId = req.user.id;

    if (!content || !communityId) {
      return res.status(400).json({ message: "Content and Community ID are required" });
    }

    const post = await prisma.post.create({
      data: {
        content,
        userId,
        communityId,
      },
      include: {
        user: { select: { username: true } },
        community: { select: { name: true } }
      }
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("Create Post Error:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
};

const getPosts = async (req, res) => {
  try {
    const { type, communityId, page = 1, limit = 10 } = req.query;
    
    // Calculate skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    let where = {};

    if (communityId) {
      where = { communityId };
    } else if (type === 'feed') {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required for feed" });
      }
      
      // Fetch user to get joined community IDs
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { communityIds: true }
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      where = {
        communityId: { in: user.communityIds }
      };
    }
    // Default (or type=explore) is to fetch all posts (empty where)

    // Get total count for pagination
    const totalCount = await prisma.post.count({ where });

    const posts = await prisma.post.findMany({
      where,
      include: {
        user: { select: { username: true, id: true } },
        community: { select: { name: true } },
        likes: { select: { userId: true } },
        _count: { select: { likes: true, comments: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take
    });

    // Transform data to include isLiked, likeCount, and commentCount
    const postsWithLikes = posts.map(post => ({
      ...post,
      userId: post.userId, // Explicitly include userId for ownership checks
      isLiked: req.user ? post.likes.some(like => like.userId === req.user.id) : false,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
      likes: undefined,
      _count: undefined
    }));

    res.json({
      posts: postsWithLikes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / take),
        totalCount,
        hasMore: skip + posts.length < totalCount
      }
    });
  } catch (err) {
    console.error("Get Posts Error:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: id
        }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      res.json({ message: "Post unliked", liked: false });
    } else {
      // Like
      try {
        await prisma.like.create({
          data: {
            userId,
            postId: id
          }
        });
        res.json({ message: "Post liked", liked: true });
      } catch (createErr) {
        // Handle unique constraint violation (P2002)
        if (createErr.code === 'P2002') {
          return res.status(400).json({ message: "You have already liked this post", liked: true });
        }
        throw createErr;
      }
    }
  } catch (err) {
    console.error("Toggle Like Error:", err);
    res.status(500).json({ error: "Failed to toggle like" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Check if user owns the post
    const post = await prisma.post.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ message: "You can only edit your own posts" });
    }

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { content },
      include: {
        user: { select: { username: true } },
        community: { select: { name: true } }
      }
    });

    res.json(updatedPost);
  } catch (err) {
    console.error("Update Post Error:", err);
    res.status(500).json({ error: "Failed to update post" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user owns the post
    const post = await prisma.post.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    // Delete post
    await prisma.post.delete({ where: { id } });

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete Post Error:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

module.exports = { createPost, getPosts, toggleLike, updatePost, deletePost };
