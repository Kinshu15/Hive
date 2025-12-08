const express = require("express");
const { createCommunity, getCommunities, getCommunityById, joinCommunity, leaveCommunity, deleteCommunity } = require("./communities.controller");
const { authenticateToken } = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticateToken, createCommunity);
router.get("/", getCommunities);
router.post("/:id/join", authenticateToken, joinCommunity);
router.post("/:id/leave", authenticateToken, leaveCommunity);
router.get("/:id", getCommunityById);
router.delete("/:id", authenticateToken, deleteCommunity);

module.exports = router;
