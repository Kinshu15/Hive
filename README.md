# Hive Project
Hive – A Community-Driven Discussion and Image Sharing Platform

Hive is a modern web application where users can join communities, share images or memes, participate in discussions, and interact through comments and votes — all inside a clean, responsive, and community-focused platform.

🚀 1. Features
🔐 Authentication

JWT-based secure login, signup, and logout

Password hashing and token verification

📝 Posts, Comments & Communities (CRUD)

Create, Read, Update, Delete posts

Comment on posts

Community creation & listing

Users can delete their own content

Admins can moderate posts and comments

⚡ Dynamic Functionalities

Real-time data fetching through APIs

Search, Sort, Filter, Pagination for posts

Cloudinary-based image uploads

Responsive UI with smooth navigation

🧭 Frontend Routing

Pages include:

Home

Communities

Post Details

Profile

Login / Signup

☁ Hosting

Frontend: Vercel

Backend: Render / Railway

Database: MongoDB Atlas

Image Uploads: Cloudinary

🏗 2. System Architecture
Frontend (React)
      ↓
Backend API (Node + Express)
      ↓
Database (MongoDB Atlas)

🛠 3. Tech Stack
Layer	Technologies
Frontend	React.js, React Router, TailwindCSS, Axios
Backend	Node.js, Express.js
Database	MongoDB Atlas
Auth	JWT (JSON Web Token)
Hosting	Vercel, Render/Railway, Cloudinary
📡 4. API Overview
Authentication
Endpoint	Method	Description
/api/auth/signup	POST	Register user
/api/auth/login	POST	Login and receive JWT
Posts
Endpoint	Method	Description
/api/posts	GET	Fetch all posts (search, sort, filter, pagination)
/api/posts	POST	Create new post
/api/posts/:id	PUT	Update post
/api/posts/:id	DELETE	Delete post
Comments
Endpoint	Method	Description
/api/comments/:postId	GET	Get comments for a post
/api/comments	POST	Add a comment
/api/comments/:id	DELETE	Delete a comment
Communities
Endpoint	Method	Description
/api/communities	GET	Get all communities
/api/communities	POST	Create a community
📦 5. Project Setup
Frontend
cd frontend
npm install
npm run dev

Backend
cd backend
npm install
npm start
