const express = require("express");
const cors = require("cors");
const authRoutes = require("./features/auth/auth.routes");
const communityRoutes = require("./features/communities/communities.routes");
const postRoutes = require("./features/posts/posts.routes");
const commentRoutes = require("./features/comments/comments.routes");

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : '*', // Allow all origins in development
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

module.exports = app;
