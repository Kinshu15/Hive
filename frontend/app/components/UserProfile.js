"use client";

import { Card, CardContent, Typography, Avatar, List, ListItem, ListItemText, Divider, ListItemButton, Box } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";

export default function UserProfile({ user }) {
  if (!user) return null;

  return (
    <Card 
      elevation={2} 
      sx={{ 
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <div className="flex flex-col items-center mb-3">
          <Avatar 
            sx={{ 
              width: 72, 
              height: 72, 
              mb: 2,
              bgcolor: 'primary.main',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
          >
            {user.username[0].toUpperCase()}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {user.username}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {user.email}
          </Typography>
        </div>

        <Divider sx={{ my: 2.5 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
          <GroupsIcon color="primary" fontSize="small" />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            My Communities
          </Typography>
        </Box>
        
        {user.communities && user.communities.length > 0 ? (
          <List dense sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 0.5 }}>
            {user.communities.map((comm) => (
              <ListItem key={comm.id} disablePadding>
                <ListItemButton 
                  component="a" 
                  href={`/communities/${comm.id}`}
                  sx={{ 
                    borderRadius: 1.5,
                    mb: 0.5,
                    '&:hover': {
                      bgcolor: 'primary.light'
                    }
                  }}
                >
                  <ListItemText 
                    primary={comm.name}
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            You haven't joined any communities yet.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
