const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../config/prisma");

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("REQ BODY:", req.body);

    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Validate email format
    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check for existing email
    const existingEmail = await prisma.user.findUnique({ 
      where: { email } 
    });
    
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check for existing username
    const existingUsername = await prisma.user.findFirst({ 
      where: { username } 
    });
    
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const stringPassword = String(password);
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(stringPassword, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log("User created:", newUser);
    return res.status(201).json({
      message: "User Added",
      user: newUser
    });
  } catch (err) {
    console.error("Insert Error:", err);
    if (err.code === 'P2002') {
      return res.status(400).json({ message: "Email already exists" });
    }
    return res.status(500).send("Failed to add User");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN BODY:", req.body);

    if (!email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    // Validate email format
    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const stringPassword = String(password);
    const isMatch = await bcrypt.compare(stringPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    return res.status(200).json({ message: "User verified", token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        communities: true,
        createdCommunities: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Exclude password
    const { password, ...userInfo } = user;
    res.json(userInfo);
  } catch (err) {
    console.error("Get Me Error:", err);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

module.exports = { signup, login, getMe };
