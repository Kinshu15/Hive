"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/app/utils/api";
import { Container, Typography, CircularProgress, Button, Paper, Avatar, Pagination, Box } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import PostCard from "../../components/PostCard";
import CreatePostForm from "../../components/CreatePostForm";
import MobileNav from "../../components/MobileNav";
import { useParams } from "next/navigation";

export default function CommunityPage() {
  const params = useParams();
  const communityId = params.id;
  
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      // Fetch Posts
      const postsRes = await axios.get(`${API}/api/posts?communityId=${communityId}&page=${page}&limit=10`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setPosts(postsRes.data.posts || postsRes.data);
      setPagination(postsRes.data.pagination);

      // Fetch Community Info with Members
      const commRes = await axios.get(`${API}/api/communities/${communityId}`);
      setCommunity(commRes.data);
      
      // Check if joined
      if (token) {
         const meRes = await axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
         const myCommunities = meRes.data.communities || [];
         setIsJoined(myCommunities.some(c => c.id === communityId));
         setCurrentUserId(meRes.data.id);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
      
      // If 403 (invalid token), clear token and redirect to login
      if (err.response?.status === 403 || err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
        return;
      }
      
      setError("Failed to load community");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (communityId) fetchData();
  }, [communityId, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJoin = async () => {
    const token = localStorage.getItem("token");
    if (!token) return window.location.href = "/auth/login";
    try {
      await axios.post(`${API}/api/communities/${communityId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsJoined(true);
    } catch (err) {
      alert("Failed to join");
    }
  };

  const handleLeave = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${API}/api/communities/${communityId}/leave`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsJoined(false);
    } catch (err) {
      alert("Failed to leave");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this community? All posts will be permanently deleted.")) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API}/api/communities/${communityId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Community deleted successfully");
      window.location.href = "/explore";
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete community");
    }
  };

  if (loading) return <div className="flex justify-center mt-10"><CircularProgress /></div>;
  if (error || !community) return <Typography color="error" align="center" mt={4}>{error || "Not Found"}</Typography>;

  return (
    <div className="bg-gray-100 min-h-screen pt-4 pb-16">
      <Container maxWidth="xl">
        <div className="flex gap-6">
          {/* Left Sidebar - Hidden on Mobile, Sticky */}
          <div className="hidden md:block w-1/4">
            <div style={{ position: 'sticky', top: '20px' }}>
              <Sidebar />
            </div>
          </div>

          {/* Middle Content */}
          <div className="w-full md:w-1/2">
            {/* Community Header */}
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {community.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {community.description || "No description"}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {community._count?.members || 0} Members
                  </Typography>
                </div>
                <div className="flex gap-2">
                  {isJoined ? (
                    <Button variant="outlined" color="error" onClick={handleLeave}>Leave</Button>
                  ) : (
                    <Button variant="contained" onClick={handleJoin}>Join</Button>
                  )}
                  {currentUserId && community.creatorId === currentUserId && (
                    <Button variant="outlined" color="error" onClick={handleDelete}>Delete Community</Button>
                  )}
                </div>
              </div>
            </Paper>

            {/* Create Post (Only if joined) */}
            {isJoined && (
              <CreatePostForm communityId={communityId} onPostCreated={fetchData} />
            )}

            {/* Posts Feed */}
            <Typography variant="h6" sx={{ mb: 2 }}>Posts</Typography>
            {posts.length > 0 ? (
              <>
                {posts.map(post => <PostCard key={post.id} post={post} onUpdate={fetchData} />)}
                
                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination 
                      count={pagination.totalPages} 
                      page={page} 
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            ) : (
              <Typography color="text.secondary" align="center">No posts yet. Be the first!</Typography>
            )}
          </div>

          {/* Right Sidebar (Community Members) - Sticky */}
          <div className="hidden md:block w-1/4">
            <div style={{ position: 'sticky', top: '20px' }}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Members
                </Typography>
                {community.members && community.members.length > 0 ? (
                  <div className="space-y-3">
                    {community.members.map((member) => (
                      <div key={member.id} className="flex items-center gap-2">
                        <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                          {member.username[0].toUpperCase()}
                        </Avatar>
                        <Typography variant="body2">{member.username}</Typography>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No members yet.
                  </Typography>
                )}
              </Paper>
            </div>
          </div>
        </div>
      </Container>
      <MobileNav />
    </div>
  );
}
