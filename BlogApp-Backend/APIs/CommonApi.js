import exp from "express";
import { authenticate } from "../services/authService.js";
import { UserTypeModel } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "../Middlewares/verifytoken.js";

export const commonRouter = exp.Router();

//login
//login
commonRouter.post("/login", async (req, res) => {
  try {

    //get user cred object
    let userCred = req.body;

    //call authenticate service
    let { token, user } = await authenticate(userCred);

    //save token as httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    //send res
    res.status(200).json({
      message: "login success",
      payload: user
    });

  } catch (err) {

    res.status(err.status || 500).json({
      error: err.message || "Login failed",
    });

  }
});

//logout for User, Author and Admin
commonRouter.get("/logout", (req, res) => {
  // Clear the cookie named 'token'
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({ message: "Logged out successfully" });
});

//Forgot password
commonRouter.put("/forgot-password", async (req, res) => {
  const { email, newPassword } = req.body;
  
  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required" });
  }

  const account = await UserTypeModel.findOne({ email });

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  account.password = await bcrypt.hash(newPassword, 10);
  await account.save();

  res.status(200).json({ message: "Password updated successfully" });
});

//Change password(Protected route)
commonRouter.put("/change-password", async (req, res) => {
  //get current password and new password
  const { role, email, currentPassword, newPassword } = req.body;

  if (currentPassword === newPassword) {
    return res.status(400).json({
      message: "newPassword must be different from currentPassword",
    });
  }

  const account = await UserTypeModel.findOne({ email });

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  const isMatch = await bcrypt.compare(currentPassword, account.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  account.password = await bcrypt.hash(newPassword, 10);
  await account.save();

  res.status(200).json({ message: "Password changed successfully" });
});


// -------------------- ADDED CODE (NO EXISTING LINE CHANGED) --------------------


//check authentication
commonRouter.get(
  "/check-auth",
  verifyToken("USER","AUTHOR","ADMIN"),
  async (req, res) => {
    try {
      const user = await UserTypeModel.findById(req.user.userId).select("-password");
      res.status(200).json({
        message: "authenticated",
        payload: user,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);