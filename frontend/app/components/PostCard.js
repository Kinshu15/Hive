"use client";

import { useState } from "react";
import axios from "axios";
import { API } from "@/app/utils/api";
import { Card, CardContent, CardActions, Typography, Button, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommentSection from "./CommentSection";

export default function PostCard({ post, onUpdate, onDelete }) {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);

  // Check if user owns this post
  useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setCurrentUserId(res.data.id))
        .catch(() => {});
    }
  }, []);

  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to like posts");
      return;
    }

    // Prevent multiple simultaneous clicks
    if (likeLoading) return;

    setLikeLoading(true);

    try {
      const res = await axios.post(`${API}/api/posts/${post.id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update with server response
      setLiked(res.data.liked);
      
      // Calculate new count based on server response
      if (res.data.liked && !liked) {
        // Was not liked, now liked
        setLikeCount(prev => prev + 1);
      } else if (!res.data.liked && liked) {
        // Was liked, now not liked
        setLikeCount(prev => Math.max(0, prev - 1)); // Ensure never negative
      }
    } catch (err) {
      console.error("Like Error:", err);
      
      if (err.response?.status === 400) {
        alert(err.response.data.message);
      }
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
      await axios.put(`${API}/api/posts/${post.id}`, 
        { content: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditDialogOpen(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update post");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API}/api/posts/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      handleMenuClose();
      if (onDelete) onDelete();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  const isEdited = post.updatedAt && new Date(post.updatedAt) > new Date(post.createdAt);
  const isOwner = currentUserId && post.userId === currentUserId;

  return (
    <Card 
      elevation={2} 
      sx={{ 
        mb: 3,
        borderRadius: 3,
        overflow: 'visible',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <Typography variant="caption" color="text.secondary" display="block">
              Posted by {post.user?.username || "User"} in {post.community?.name || "Community"}
              {isEdited && <span style={{ marginLeft: '8px', fontStyle: 'italic' }}>(edited)</span>}
            </Typography>
            {post.title && (
              <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                {post.title}
              </Typography>
            )}
            <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
              {post.content}
            </Typography>
          </div>
          {isOwner && (
            <>
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>Delete</MenuItem>
              </Menu>
            </>
          )}
        </div>
      </CardContent>
      <CardActions disableSpacing sx={{ pt: 0 }}>
        <IconButton onClick={handleLike} color={liked ? "error" : "default"} size="small">
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
          {likeCount}
        </Typography>
        <IconButton onClick={() => setCommentDialogOpen(true)} size="small">
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {post.commentCount || 0}
        </Typography>
      </CardActions>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Comment Section */}
      <CommentSection 
        post={post} 
        open={commentDialogOpen} 
        onClose={() => setCommentDialogOpen(false)} 
        onCommentAdded={onUpdate}
      />
    </Card>
  );
}
