"use client";

import { useState } from "react";
import axios from "axios";
import { API } from "@/app/utils/api";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import MobileNav from "../../components/MobileNav";
import { useRouter } from "next/navigation";

export default function CreateCommunityPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please login to create a community");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API}/api/communities`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage("Community created successfully!");
      setForm({ name: "", description: "" });
      
      // Redirect to the new community page after 1 second
      setTimeout(() => {
        router.push(`/communities/${res.data.id}`);
      }, 1000);
    } catch (err) {
      console.error("Create Community Error:", err);
      setMessage(err.response?.data?.message || "Failed to create community");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 pb-16">
      <Card sx={{ width: 400, padding: 3 }}>
        <CardContent>
          <Typography variant="h5" className="text-center mb-4">
            Create Community
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Community Name"
              name="name"
              value={form.name}
              margin="normal"
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={form.description}
              margin="normal"
              onChange={handleChange}
              multiline
              rows={3}
            />

            <Button 
              variant="contained" 
              type="submit" 
              fullWidth 
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </form>

          {message && (
            <Typography className="text-center mt-3" color={message.includes("success") ? "primary" : "error"}>
              {message}
            </Typography>
          )}
        </CardContent>
      </Card>
      <MobileNav />
    </div>
  );
}
