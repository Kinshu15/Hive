const prisma = require("../../config/prisma");

const createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;
    const creatorId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const community = await prisma.community.create({
      data: {
        name,
        description,
        creator: { connect: { id: creatorId } },
        members: { connect: { id: creatorId } },
      },
    });

    res.status(201).json(community);
  } catch (err) {
    console.error("Create Community Error:", err);
    if (err.code === 'P2002') {
      return res.status(400).json({ message: "Community name already exists" });
    }
    res.status(500).json({ error: "Failed to create community" });
  }
};

const getCommunities = async (req, res) => {
  try {
    const { search } = req.query;
    let where = {};
    
    if (search) {
      where = {
        name: {
          contains: search,
          mode: 'insensitive'
        }
      };
    }

    const communities = await prisma.community.findMany({
      where,
      include: {
        creator: {
          select: { username: true }
        },
        _count: {
          select: { members: true }
        }
      }
    });
    res.json(communities);
  } catch (err) {
    console.error("Get Communities Error:", err);
    res.status(500).json({ error: "Failed to fetch communities" });
  }
};

const getCommunityById = async (req, res) => {
  try {
    const { id } = req.params;
    const community = await prisma.community.findUnique({
      where: { id },
      include: {
        creator: {
          select: { username: true }
        },
        members: {
          select: { id: true, username: true }
        },
        _count: {
          select: { members: true }
        }
      }
    });

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.json(community);
  } catch (err) {
    console.error("Get Community By ID Error:", err);
    res.status(500).json({ error: "Failed to fetch community" });
  }
};

const joinCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const community = await prisma.community.update({
      where: { id },
      data: {
        members: {
          connect: { id: userId }
        }
      }
    });

    res.json({ message: "Joined community successfully", community });
  } catch (err) {
    console.error("Join Community Error:", err);
    if (err.code === 'P2025') {
      return res.status(404).json({ message: "Community not found" });
    }
    res.status(500).json({ error: "Failed to join community" });
  }
};

const leaveCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const community = await prisma.community.update({
      where: { id },
      data: {
        members: {
          disconnect: { id: userId }
        }
      },
      include: {
        _count: { select: { members: true } }
      }
    });

    // Auto-delete if no members left
    if (community._count.members === 0) {
      await prisma.community.delete({ where: { id } });
      return res.json({ message: "Left community successfully. Community deleted (no members)", deleted: true });
    }

    res.json({ message: "Left community successfully", community });
  } catch (err) {
    console.error("Leave Community Error:", err);
    if (err.code === 'P2025') {
      return res.status(404).json({ message: "Community not found" });
    }
    res.status(500).json({ error: "Failed to leave community" });
  }
};

const deleteCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user is the creator
    const community = await prisma.community.findUnique({
      where: { id },
      select: { creatorId: true }
    });

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (community.creatorId !== userId) {
      return res.status(403).json({ message: "Only the creator can delete this community" });
    }

    // Delete community (posts will be cascade deleted)
    await prisma.community.delete({ where: { id } });

    res.json({ message: "Community deleted successfully" });
  } catch (err) {
    console.error("Delete Community Error:", err);
    res.status(500).json({ error: "Failed to delete community" });
  }
};

module.exports = { createCommunity, getCommunities, getCommunityById, joinCommunity, leaveCommunity, deleteCommunity };
