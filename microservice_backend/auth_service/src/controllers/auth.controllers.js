import { createUser, getUserByEmail } from "../client/user.client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../../../shared/logger/index.js";

const isProduction = process.env.NODE_ENV === "production";


export const signupController = async (req, res) => {
  const { email, password, name, balance } = req.body;

  try {
    logger.info({
      requestId: req.requestId,
      msg: "Signup request received",
      email
    });

    const findUser = await getUserByEmail(email);

    if (findUser.success && findUser.data?.data) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    const newUserResult = await createUser({
      email,
      password,
      name,
      balance
    });

    if (!newUserResult.success) {
      logger.error({
        requestId: req.requestId,
        msg: "User service failed to create user"
      });
      return res.status(500).json({ error: "Failed to create user" });
    }

    const newUser = newUserResult.data.data;

    const accessToken = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction
        ? process.env.COOKIE_SAME_SITE_PROD
        : process.env.COOKIE_SAME_SITE_DEV,
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction
        ? process.env.COOKIE_SAME_SITE_PROD
        : process.env.COOKIE_SAME_SITE_DEV,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      success: true,
      data: {
        user: newUser
      }
    });
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      msg: "Signup controller failed",
      error: error.message
    });
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await getUserByEmail(email);

    if (!userResult.success || !userResult.data?.data) {
      logger.warn({
        requestId: req.requestId,
        msg: "Invalid login attempt - email not found",
        email
      });
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = userResult.data.data;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn({
        requestId: req.requestId,
        msg: "Invalid login attempt - wrong password",
        email
      });
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction
        ? process.env.COOKIE_SAME_SITE_PROD
        : process.env.COOKIE_SAME_SITE_DEV,
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction
        ? process.env.COOKIE_SAME_SITE_PROD
        : process.env.COOKIE_SAME_SITE_DEV,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      msg: "Login controller failed",
      error: error.message
    });
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const logoutController = async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction
      ? process.env.COOKIE_SAME_SITE_PROD
      : process.env.COOKIE_SAME_SITE_DEV
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction
      ? process.env.COOKIE_SAME_SITE_PROD
      : process.env.COOKIE_SAME_SITE_DEV
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful"
  });
};


export const refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction
        ? process.env.COOKIE_SAME_SITE_PROD
        : process.env.COOKIE_SAME_SITE_DEV,
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction
        ? process.env.COOKIE_SAME_SITE_PROD
        : process.env.COOKIE_SAME_SITE_DEV,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
