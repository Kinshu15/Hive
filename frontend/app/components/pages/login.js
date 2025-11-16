"use client";

import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("Login:", email, password);
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <Card sx={{ width: 350, padding: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
