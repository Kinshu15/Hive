const express = require("express");
const dotenv = require("dotenv");
const { connectDB, getDB } = require("./db");
const { ObjectId } = require("mongodb");

dotenv.config();

const app = express();
app.use(express.json());

// Connect DB
connectDB();

app.get("/", (req, res) => {
  res.send("Server running!");
});
app.post("/add-comment", async (req, res) => {
  try {
    const { name, email, movie_id, text } = req.body;
    const db = getDB();
    const commentsCollection = db.collection("comments");
    const newComment = {
      name,
      email,
      movie_id:new ObjectId(movie_id),
      text,
      date: new Date(),
    };
    const result = await commentsCollection.insertOne(newComment);
    res.status(201).json({
      message: "Comment added",
      id: result.insertedId,
    });
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).send("Failed to add comment");
  }
});

// app.post("/signup,(req,res)",async (req,res)=>{
//   try{
//     const {username,email,password}=req.body
//     const db = getDB
//     const userCollection = db.collection("users")
//     const newUser = {
//       username,
//       email,
//       password
//     }
//      if (!email || !username || !password){
//          res.status(500).json({message:"all fields required"})
//      }
//      else{
//      await userCollection.insertOne(newUser)
//      res.status(201).json({
//          message:"User Added"
//        })}
//   }catch(err){
//     console.error("Insert Error:", err);
//     res.status(500).send("Failed to add User");
//   }
// })
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
