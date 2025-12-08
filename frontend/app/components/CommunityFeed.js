"use client";

import { Card, CardContent, CardActions, Typography, Button, Grid } from "@mui/material";

export default function CommunityFeed({ communities, joinedCommunityIds, onJoin, onLeave }) {
  return (
    <Grid container spacing={2}>
      {communities.map((community) => {
        const isJoined = joinedCommunityIds.includes(community.id);

        return (
          <Grid item xs={12} key={community.id}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {community.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary" variant="body2">
                  Created by {community.creator?.username || "Unknown"}
                </Typography>
                <Typography variant="body2">
                  {community.description || "No description provided."}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {community._count?.members || 0} Members
                </Typography>
              </CardContent>
              <CardActions>
                {isJoined ? (
                  <Button size="small" color="error" onClick={() => onLeave(community.id)}>
                    Leave
                  </Button>
                ) : (
                  <Button size="small" variant="contained" onClick={() => onJoin(community.id)}>
                    Join
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
