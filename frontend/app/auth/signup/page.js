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
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/auth/signup`, form);
      setMessage("Signup successful!");

      window.location.href = "/auth/login";
    } catch (err) {
      setMessage(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <Card sx={{ width: 350, padding: 3 }}>
        <CardContent>
          <Typography variant="h5" className="text-center mb-4">
            Signup
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="UserName"
              name="username"
              value={form.username}
              margin="normal"
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              margin="normal"
              onChange={handleChange}
            />

            <TextField
              fullWidth
              type="password"
              label="Password"
              name="password"
              value={form.password}
              margin="normal"
              onChange={handleChange}
            />

            <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
              Signup
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account? <Link href="/auth/login" className="text-blue-600 hover:underline">Login</Link>
            </Typography>
          </form>

          <Typography className="text-red-500 mt-3 text-center">
            {message}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
