"use client";

import { Card, CardContent, CardHeader, CardActions, Typography, Avatar, IconButton, Button, Divider } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const mockPost = {
  content: "Just launched my new project! It's a platform for connecting developers with open source projects. Would love to hear your feedback.",
  author: "Sarah Chen",
  community: "Web Development",
  time: "2h ago",
  likes: 42,
  comments: 12
};

// Option A: Minimal
const VariantA = () => (
  <Card sx={{ maxWidth: 600, mb: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
    <CardContent>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        {mockPost.community} • Posted by {mockPost.author}
      </Typography>
      <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
        {mockPost.content}
      </Typography>
    </CardContent>
    <CardActions disableSpacing sx={{ pt: 0 }}>
      <Button size="small" startIcon={<FavoriteBorderIcon />} color="inherit">{mockPost.likes}</Button>
      <Button size="small" startIcon={<ChatBubbleOutlineIcon />} color="inherit">{mockPost.comments}</Button>
    </CardActions>
  </Card>
);

// Option B: Classic
const VariantB = () => (
  <Card sx={{ maxWidth: 600, mb: 4 }}>
    <CardHeader
      avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>SC</Avatar>}
      action={<IconButton><MoreVertIcon /></IconButton>}
      title={
        <Typography variant="subtitle1" component="span" fontWeight="bold">
          {mockPost.author}
          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            in {mockPost.community}
          </Typography>
        </Typography>
      }
      subheader={mockPost.time}
    />
    <CardContent sx={{ pt: 0 }}>
      <Typography variant="body1">
        {mockPost.content}
      </Typography>
    </CardContent>
    <Divider />
    <CardActions disableSpacing>
      <IconButton><FavoriteBorderIcon /></IconButton>
      <IconButton><ChatBubbleOutlineIcon /></IconButton>
      <IconButton><ShareIcon /></IconButton>
    </CardActions>
  </Card>
);

// Option C: Modern (Twitter-style)
const VariantC = () => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 max-w-[600px] mb-4 hover:bg-gray-50 transition-colors">
    <div className="flex gap-3">
      <Avatar sx={{ width: 48, height: 48 }}>SC</Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Typography variant="subtitle1" fontWeight="bold">{mockPost.author}</Typography>
          <Typography variant="body2" color="text.secondary">@{mockPost.author.toLowerCase().replace(' ', '')}</Typography>
          <Typography variant="body2" color="text.secondary">• {mockPost.time}</Typography>
        </div>
        <Typography variant="body2" color="primary" sx={{ mb: 0.5, fontSize: '0.8rem', fontWeight: 'bold' }}>
          {mockPost.community}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {mockPost.content}
        </Typography>
        <div className="flex justify-between max-w-[80%] text-gray-500">
          <button className="flex items-center gap-1 hover:text-blue-500"><ChatBubbleOutlineIcon fontSize="small" /> {mockPost.comments}</button>
          <button className="flex items-center gap-1 hover:text-red-500"><FavoriteBorderIcon fontSize="small" /> {mockPost.likes}</button>
          <button className="flex items-center gap-1 hover:text-green-500"><ShareIcon fontSize="small" /></button>
        </div>
      </div>
    </div>
  </div>
);

export default function DesignPreview() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <Typography variant="h4" sx={{ mb: 6, fontWeight: 'bold' }}>Post Card Design Variants</Typography>
      
      <div className="w-full max-w-2xl">
        <Typography variant="h5" sx={{ mb: 2 }}>Option A: Minimal</Typography>
        <VariantA />
        
        <Divider sx={{ my: 6 }} />
        
        <Typography variant="h5" sx={{ mb: 2 }}>Option B: Classic</Typography>
        <VariantB />
        
        <Divider sx={{ my: 6 }} />
        
        <Typography variant="h5" sx={{ mb: 2 }}>Option C: Modern</Typography>
        <VariantC />
      </div>
    </div>
  );
}
