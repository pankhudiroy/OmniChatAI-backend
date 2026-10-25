import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/signup", async(req,res) =>{
    try {
      const {email, username, password} = req.body;
      if (!email || !username || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email : email,
        username : username,
        password : hashedPassword,
      });

      const response = await user.save();
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: response._id,
          email: response.email,
          username: response.username
        }
      });
    }catch(err){
      console.log(err);
      res.status(500).json({error: "Failed to save in DB"});
    }
});

router.post("/login", async(req,res) =>{
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    //generating web token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      username: user.username
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/test-protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed a protected route!",
    userId: req.userId
  });
});

export default router;