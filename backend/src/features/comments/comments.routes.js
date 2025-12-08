const express = require("express");
const { createComment, getCommentsByPost, updateComment, deleteComment, toggleCommentLike } = require("./comments.controller");
const { authenticateToken, optionalAuthenticateToken } = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticateToken, createComment);
router.get("/post/:postId", optionalAuthenticateToken, getCommentsByPost);
router.put("/:id", authenticateToken, updateComment);
router.delete("/:id", authenticateToken, deleteComment);
router.post("/:id/like", authenticateToken, toggleCommentLike);

module.exports = router;
