const express = require("express");
const dotenv = require("dotenv");
const { connectDB, getDB } = require("./db");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors =require("cors")
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.json())
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

connectDB();

app.get("/", (req, res) => {
  return res.send("Server running!!!!");
});
app.post("/signup", async (req, res) => {
  try {
    const { username,email, password } = req.body;
    console.log("REQ BODY:", req.body)
    const db = getDB();
    const users = db.collection("users");
    const stringPassword= String(password)
    const hashedPassword = await bcrypt.hash(stringPassword, 10);
    const newUser = {
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };
    if (!email || !username || !password) {
      return res.status(500).json({ message: "all fields required" });
    } else {
      await users.insertOne(newUser);
      return res.status(201).json({
        message: "User Added",
      });
    }
    console.log("working")
  } catch (err) {
    console.error("Insert Error:", err);
    return res.status(500).send("Failed to add User");
  }
});

app.post("/login", async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection("users");
    const { email, password } = req.body;

    console.log("LOGIN BODY:", req.body)
    console.log("EMAIL RECEIVED:", req.body.email);
    console.log("PASSWORD RECEIVED:", req.body.password);

    const stringPassword= String(password)
    if (!email || !password) {
      return res.status(400).send("Some Fields misssing");
    }
    const user = await users.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(stringPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    return res.status(201).json({ message: "User verified" });
    console.log(email, password);
  } catch (err) {
    console.error("LOGIN ERROR:", err); // <-- ADD THIS
    return res.status(500).json({ error: "Something went wrong" });
  }


});
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
