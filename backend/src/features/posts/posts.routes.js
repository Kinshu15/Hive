const express = require("express");
const { createPost, getPosts, toggleLike, updatePost, deletePost } = require("./posts.controller");
const { authenticateToken, optionalAuthenticateToken } = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticateToken, createPost);
router.get("/", optionalAuthenticateToken, getPosts);
router.post("/:id/like", authenticateToken, toggleLike);
router.put("/:id", authenticateToken, updatePost);
router.delete("/:id", authenticateToken, deletePost);

module.exports = router;
