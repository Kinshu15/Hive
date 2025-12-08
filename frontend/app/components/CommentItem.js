"use client";

import { useState } from "react";
import axios from "axios";
import { API } from "@/app/utils/api";
import { Typography, IconButton, Menu, MenuItem, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function CommentItem({ comment, replies, onReply, onUpdate, depth = 0 }) {
  const [liked, setLiked] = useState(comment.isLiked || false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showReplies, setShowReplies] = useState(true);

  // Check if user owns this comment
  useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setCurrentUserId(res.data.id))
        .catch(() => {});
    }
  }, []);

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to like comments");
      return;
    }

    if (likeLoading) return;
    setLikeLoading(true);

    try {
      const res = await axios.post(`${API}/api/comments/${comment.id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setLiked(res.data.liked);
      
      if (res.data.liked && !liked) {
        setLikeCount(prev => prev + 1);
      } else if (!res.data.liked && liked) {
        setLikeCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Like Comment Error:", err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleEditSave = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`${API}/api/comments/${comment.id}`, 
        { content: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditDialogOpen(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update comment");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API}/api/comments/${comment.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      handleMenuClose();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete comment");
    }
  };

  const isEdited = comment.updatedAt && new Date(comment.updatedAt) > new Date(comment.createdAt);
  const isOwner = currentUserId && comment.userId === currentUserId;

  return (
    <div style={{ marginLeft: depth > 0 ? '32px' : '0' }} className="border-l-2 border-gray-200 pl-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Typography variant="caption" fontWeight="bold">
            {comment.user?.username || "User"}
            {isEdited && <span style={{ marginLeft: '8px', fontStyle: 'italic', fontWeight: 'normal' }}>(edited)</span>}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, mb: 1 }}>
            {comment.content}
          </Typography>
          
          <div className="flex items-center gap-2">
            <IconButton onClick={handleLike} color={liked ? "error" : "default"} size="small">
              {liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            </IconButton>
            <Typography variant="caption">{likeCount}</Typography>
            <Button size="small" onClick={() => onReply(comment.id)}>Reply</Button>
          </div>
        </div>
        
        {isOwner && (
          <>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleEditClick}>Edit</MenuItem>
              <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>Delete</MenuItem>
            </Menu>
          </>
        )}
      </div>

      {/* Replies */}
      {replies && replies.length > 0 && (
        <div className="mt-2">
          {showReplies && replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={[]}
              onReply={onReply}
              onUpdate={onUpdate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            multiline
            rows={3}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
