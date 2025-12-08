"use client";

import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleSignout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'white', color: 'inherit' }} elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}>
            Hive
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleSignout}
            sx={{
              fontSize: '1rem',
              '&:hover': {
                color: 'error.main',
                bgcolor: 'transparent',
              },
              transition: 'color 0.2s ease-in-out'
            }}
          >
            Log Out
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
