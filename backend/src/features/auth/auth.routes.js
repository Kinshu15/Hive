const express = require("express");
const { signup, login, getMe } = require("./auth.controller");
const { authenticateToken } = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authenticateToken, getMe);

module.exports = router;
