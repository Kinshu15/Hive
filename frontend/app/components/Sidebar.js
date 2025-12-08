"use client";

import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";

export default function Sidebar() {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'white'
      }}
    >
      <div style={{ padding: '16px 16px 8px 16px' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
          Navigation
        </Typography>
      </div>
      <List sx={{ py: 0 }}>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            href="/home"
            sx={{ 
              py: 1.5,
              px: 2,
              '&:hover': {
                bgcolor: 'primary.light',
                '& .MuiListItemIcon-root': {
                  color: 'primary.main'
                },
                '& .MuiListItemText-primary': {
                  fontWeight: 600
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Home" 
              primaryTypographyProps={{ fontSize: '0.95rem' }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            href="/explore"
            sx={{ 
              py: 1.5,
              px: 2,
              '&:hover': {
                bgcolor: 'primary.light',
                '& .MuiListItemIcon-root': {
                  color: 'primary.main'
                },
                '& .MuiListItemText-primary': {
                  fontWeight: 600
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ExploreIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Explore" 
              primaryTypographyProps={{ fontSize: '0.95rem' }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            href="/profile"
            sx={{ 
              py: 1.5,
              px: 2,
              mb: 1,
              '&:hover': {
                bgcolor: 'primary.light',
                '& .MuiListItemIcon-root': {
                  color: 'primary.main'
                },
                '& .MuiListItemText-primary': {
                  fontWeight: 600
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Profile" 
              primaryTypographyProps={{ fontSize: '0.95rem' }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Paper>
  );
}
