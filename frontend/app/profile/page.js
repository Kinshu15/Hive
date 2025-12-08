"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/app/utils/api";
import { Container, CircularProgress, Typography } from "@mui/material";
import UserProfile from "../components/UserProfile";
import MobileNav from "../components/MobileNav";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/auth/login";
        return;
      }

      try {
        const res = await axios.get(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load profile");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div className="flex justify-center mt-10"><CircularProgress /></div>;
  if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;

  return (
    <div className="bg-gray-100 min-h-screen pt-4 pb-16">
      <Container maxWidth="sm">
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Your Profile
        </Typography>
        <UserProfile user={user} />
      </Container>
      <MobileNav />
    </div>
  );
}
