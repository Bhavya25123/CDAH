const User = require("../Data/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { generateToken } = require('../utils/jwt');

// ✅ DEFINE REGISTER FIRST
  const register = async (req, res) => {
    try {
      const { fullName, email, city, province, zipCode, description, password } = req.body;
      if (!fullName || !email || !password) {
        return res
          .status(400)
          .json({ error: "fullName, email and password are required" });
      }

      // Avoid duplicate accounts
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({
        fullName,
        email,
        city,
        province,
        zipCode,
        description,
        passwordHash,
      });
      await newUser.save();
      return res.status(201).json({ message: "User created" });
    } catch (err) {
      console.error("❌ Error:", err);
      if (err.code === 11000) {
        return res.status(409).json({ error: "Email already registered" });
      }
      return res.status(500).json({ error: "Failed to register user" });
    }
  };

  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const user = await User.findOne({ email });
      const passwordValid = user && (await bcrypt.compare(password, user.passwordHash));
      if (!passwordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = generateToken(user);
      return res.status(200).json({ token, email: user.email, fullName: user.fullName });
    } catch (err) {
      console.error('❌ Login error:', err);
      return res.status(500).json({ error: 'Server error during login' });
    }
  };

  const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email required" });
      }
      const user = await User.findOne({ email });
      if (user) {
        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();
        console.log(`Password reset token for ${email}: ${token}`);
      }
      return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
    } catch (err) {
      console.error('❌ Forgot password error:', err);
      return res.status(500).json({ error: 'Server error during password reset' });
    }
  };

  const resetPassword = async (req, res) => {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.status(400).json({ error: "Token and new password required" });
      }
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!user) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }
      user.passwordHash = await bcrypt.hash(password, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(200).json({ message: "Password updated" });
    } catch (err) {
      console.error('❌ Reset password error:', err);
      return res.status(500).json({ error: 'Server error during password update' });
    }
  };

// ✅ THEN EXPORT IT
module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
