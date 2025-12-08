"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/app/utils/api";
import { Card, CardContent, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

export default function CreatePostForm({ communityId, onPostCreated }) {
  const [content, setContent] = useState("");
  const [selectedCommunityId, setSelectedCommunityId] = useState(communityId || "");
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!communityId) {
      // Fetch joined communities if no ID provided (Home Page mode)
      const fetchCommunities = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
          const res = await axios.get(`${API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCommunities(res.data.communities || []);
        } catch (err) {
          console.error("Failed to fetch communities", err);
        }
      };
      fetchCommunities();
    } else {
      setSelectedCommunityId(communityId);
    }
  }, [communityId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !selectedCommunityId) return;

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${API}/api/posts`,
        { content, communityId: selectedCommunityId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent("");
      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error("Failed to create post:", err);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      elevation={2} 
      sx={{ 
        mb: 3,
        borderRadius: 3
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Create Post
        </Typography>
        
        {!communityId && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Community</InputLabel>
            <Select
              value={selectedCommunityId}
              label="Select Community"
              onChange={(e) => setSelectedCommunityId(e.target.value)}
            >
              {communities.map((comm) => (
                <MenuItem key={comm.id} value={comm.id}>
                  {comm.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button 
          variant="contained" 
          onClick={handleSubmit} 
          disabled={loading || !content.trim() || (!communityId && !selectedCommunityId)}
          fullWidth
          sx={{ 
            borderRadius: 2,
            py: 1.2,
            fontWeight: 'bold'
          }}
        >
          {loading ? "Posting..." : "Post"}
        </Button>
      </CardContent>
    </Card>
  );
}
