"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/app/utils/api";
import { useRouter } from "next/navigation";
import { Container, Typography, CircularProgress, TextField, Paper, Button, Pagination, Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import PostFeed from "../components/PostFeed";
import MobileNav from "../components/MobileNav";

export default function ExplorePage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [topCommunities, setTopCommunities] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [postsRes, communitiesRes] = await Promise.all([
        axios.get(`${API}/api/posts?type=explore&page=${page}&limit=10`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
        axios.get(`${API}/api/communities`)
      ]);
      
      setPosts(postsRes.data.posts);
      setPagination(postsRes.data.pagination);
      
      // Sort communities by member count (descending)
      const sorted = communitiesRes.data.sort((a, b) => 
        (b._count?.members || 0) - (a._count?.members || 0)
      );
      setTopCommunities(sorted);
      
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load data");
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    setSearch(""); // Clear search when changing pages
    setSearchResults([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await axios.get(`${API}/api/communities?search=${query}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error("Search Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  if (loading) return <div className="flex justify-center mt-10"><CircularProgress /></div>;
  if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;

  return (
    <div className="bg-gray-100 min-h-screen pt-4 pb-16">
      <Container maxWidth="xl">
        <div className="flex gap-6">
          {/* Left Sidebar - Sticky */}
          <div className="hidden md:block w-1/4">
            <div style={{ position: 'sticky', top: '20px' }}>
              <Sidebar />
            </div>
          </div>

          {/* Middle Feed */}
          <div className="w-full md:w-1/2">
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Explore
            </Typography>

            {/* Search Bar and Create Button */}
            <div className="flex gap-2 mb-3">
              <TextField
                fullWidth
                placeholder="Search Communities..."
                variant="outlined"
                size="small"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                sx={{ bgcolor: 'white' }}
              />
              <Button 
                variant="contained" 
                onClick={() => router.push('/communities/create')}
                sx={{ 
                  whiteSpace: 'nowrap',
                  minWidth: '160px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '0.95rem'
                }}
              >
                + Create
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mb-4">
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Communities found:
                </Typography>
                <div className="space-y-2">
                  {searchResults.map(comm => (
                    <Paper key={comm.id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Typography variant="subtitle1" fontWeight="bold">{comm.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{comm._count?.members || 0} Members</Typography>
                      </div>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => router.push(`/communities/${comm.id}`)}
                      >
                        View
                      </Button>
                    </Paper>
                  ))}
                </div>
              </div>
            )}

            <PostFeed posts={posts} />
            
            {/* Pagination */}
            {!search && pagination && pagination.totalPages > 1 && (
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

          {/* Right Sidebar - Top Communities, Sticky */}
          <div className="hidden md:block w-1/4">
            <div style={{ position: 'sticky', top: '20px' }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Top Communities
                </Typography>
              <div className="space-y-2">
                {topCommunities.slice(0, 10).map((comm) => (
                  <div 
                    key={comm.id}
                    className="p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors"
                    onClick={() => router.push(`/communities/${comm.id}`)}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      {comm.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {comm._count?.members || 0} members
                    </Typography>
                  </div>
                ))}
              </div>
            </Paper>
            </div>
          </div>
        </div>
      </Container>
      <MobileNav />
    </div>
  );
}
