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

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/login`, {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);

      setMessage("Login successful!");
      window.location.href = "/success";
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <Card sx={{ width: 350, padding: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom className="text-center">
            Login
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              value={form.email}
              onChange={handleChange}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              value={form.password}
              onChange={handleChange}
            />

            <Button variant="contained" fullWidth sx={{ mt: 2 }} type="submit">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
