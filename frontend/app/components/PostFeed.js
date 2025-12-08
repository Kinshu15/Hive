"use client";

import { Typography } from "@mui/material";
import PostCard from "./PostCard";

export default function PostFeed({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
        No posts found. Join some communities or create a post!
      </Typography>
    );
  }

  return (
    <div className="w-full">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
