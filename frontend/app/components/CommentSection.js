"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/app/utils/api";
import { Dialog, DialogTitle, DialogContent, TextField, Button, Typography, CircularProgress } from "@mui/material";
import CommentItem from "./CommentItem";

export default function CommentSection({ post, open, onClose, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/comments/post/${post.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setComments(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Comments Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open, post.id]);

  const handleSubmitComment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to comment");
      return;
    }

    if (!newComment.trim()) return;

    try {
      await axios.post(`${API}/api/comments`, {
        content: newComment,
        postId: post.id,
        parentCommentId: replyTo
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNewComment("");
      setReplyTo(null);
      fetchComments();
      
      // Notify parent to refresh post data
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error("Create Comment Error:", err);
      alert("Failed to create comment");
    }
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  // Organize comments into tree structure
  const topLevelComments = comments.filter(c => !c.parentCommentId);
  const getReplies = (commentId) => comments.filter(c => c.parentCommentId === commentId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Comments ({comments.length})</DialogTitle>
      <DialogContent>
        {/* Comment Input */}
        <div className="mb-4">
          {replyTo && (
            <Typography variant="caption" color="primary" sx={{ display: 'block', mb: 1 }}>
              Replying to comment... <Button size="small" onClick={handleCancelReply}>Cancel</Button>
            </Typography>
          )}
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button variant="contained" onClick={handleSubmitComment} disabled={!newComment.trim()}>
            {replyTo ? "Reply" : "Comment"}
          </Button>
        </div>

        {/* Comments List */}
        {loading ? (
          <div className="flex justify-center p-4">
            <CircularProgress />
          </div>
        ) : comments.length === 0 ? (
          <Typography color="text.secondary" align="center">No comments yet. Be the first to comment!</Typography>
        ) : (
          <div className="space-y-3">
            {topLevelComments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                replies={getReplies(comment.id)}
                onReply={handleReply}
                onUpdate={fetchComments}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
