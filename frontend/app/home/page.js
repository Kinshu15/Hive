"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/app/utils/api";
import { Container, Typography, CircularProgress, Pagination, Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import UserProfile from "../components/UserProfile";
import PostFeed from "../components/PostFeed";
import MobileNav from "../components/MobileNav";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }

    try {
      const [userRes, postsRes] = await Promise.all([
        axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/api/posts?type=feed&page=${page}&limit=10`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setUser(userRes.data);
      setPosts(postsRes.data.posts);
      setPagination(postsRes.data.pagination);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
      
      // If 403 (invalid token), clear token and redirect to login
      if (err.response?.status === 403 || err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
        return;
      }
      
      setError("Failed to load data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="flex justify-center mt-10"><CircularProgress /></div>;
  if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;

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

          {/* Middle Feed - Full width on Mobile */}
          <div className="w-full md:w-1/2">
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Your Feed
            </Typography>
            <PostFeed posts={posts} />
            
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
          </div>

          {/* Right User Profile - Hidden on Mobile, Sticky */}
          <div className="hidden md:block w-1/4">
            <div style={{ position: 'sticky', top: '20px' }}>
              <UserProfile user={user} />
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
