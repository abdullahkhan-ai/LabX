import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const login = async (req, res) => {
  try {
    const {
      username,
      password,
    } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Username and password are required.",
      });
    }

    const user = await User.findOne({
      username: username
        .toLowerCase()
        .trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid username or password.",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid username or password.",
      });
    }

    const token =
      createToken(user);

    return res.status(200).json({
      success: true,

      message:
        "Login successful.",

      token,

      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.error(
      "Login error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error.",
    });
  }
};

/* =========================================================
   REGISTER
========================================================= */

export const register = async (
  req,
  res
) => {
  try {
    const {
      name,
      username,
      email,
      password,
    } = req.body;

    if (
      !name ||
      !username ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All registration fields are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters.",
      });
    }

    const cleanName =
      name.trim();

    const cleanUsername =
      username
        .toLowerCase()
        .trim();

    const cleanEmail =
      email
        .toLowerCase()
        .trim();

    const existingUsername =
      await User.findOne({
        username: cleanUsername,
      });

    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message:
          "This username is already registered.",
      });
    }

    const existingEmail =
      await User.findOne({
        email: cleanEmail,
      });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message:
          "This email is already registered.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await User.create({
        name: cleanName,
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
        role: "USER",
      });

    return res.status(201).json({
      success: true,

      message:
        "Account created successfully.",

      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.error(
      "Registration error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create account.",
    });
  }
};

/* =========================================================
   DEFAULT USERS
========================================================= */

export const seedUsers = async () => {
  try {

    const adminExists =
      await User.findOne({
        username: "admin",
      });

    if (!adminExists) {

      const hashedPassword =
        await bcrypt.hash(
          "admin123",
          10
        );

      await User.create({
        name: "Administrator",
        username: "admin",
        email: "admin@labx.local",
        password: hashedPassword,
        role: "ADMIN",
      });

      console.log(
        "Default admin account created."
      );
    }

    const userExists =
      await User.findOne({
        username: "user",
      });

    if (!userExists) {

      const hashedPassword =
        await bcrypt.hash(
          "user123",
          10
        );

      await User.create({
        name: "Lab User",
        username: "user",
        email: "user@labx.local",
        password: hashedPassword,
        role: "USER",
      });

      console.log(
        "Default user account created."
      );
    }

  } catch (error) {

    console.error(
      "User seeding failed:",
      error.message
    );
  }
};