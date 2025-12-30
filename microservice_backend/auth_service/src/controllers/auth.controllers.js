import { createUser, getUserByEmail } from "../client/user.client.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from "../../../shared/logger/index.js";

export const signupController = async (req, res) => {
  const { email, password, name, balance } = req.body;
  try {
    logger.info({
      requestId: req.requestId,
      msg: "Forwarding request",
      target: "User Service",
      path: req.originalUrl
    });

    const findUser = await getUserByEmail(email);

    if (findUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    const user = {
      email,
      password,
      name,
      balance
    };
    const newUser = await createUser(user);

    if (!newUser) {
      return res.status(500).json({ error: "Failed to create user" });
    }

    const accessToken = jwt.sign({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

    const refreshToken = jwt.sign({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === 'production' ? process.env.COOKIE_SAME_SITE_PROD : process.env.COOKIE_SAME_SITE_DEV,
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === 'production' ? process.env.COOKIE_SAME_SITE_PROD : process.env.COOKIE_SAME_SITE_DEV,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      user: newUser,
      accessToken,
      refreshToken
    });
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      msg: "Upstream service error",
      error: error.message,
      status: error.response?.status
    });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      logger.error({
        requestId: req.requestId,
        msg: "Upstream service error",
        error: "Invalid email",
        status: 401
      });
      return res.status(401).json({ error: "Invalid email" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.error({
        requestId: req.requestId,
        msg: "Upstream service error",
        error: "Invalid password",
        status: 401
      });
      return res.status(401).json({ error: "Invalid password" });
    }
    const accessToken = jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

    const refreshToken = jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === 'production' ? process.env.COOKIE_SAME_SITE_PROD : process.env.COOKIE_SAME_SITE_DEV,
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === 'production' ? process.env.COOKIE_SAME_SITE_PROD : process.env.COOKIE_SAME_SITE_DEV,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ user, accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      msg: "Upstream service error",
      error: error.message,
      status: error.response?.status
    });
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logoutController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: "Logout successful" });
}

export const refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

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

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? process.env.COOKIE_SAME_SITE_PROD : process.env.COOKIE_SAME_SITE_DEV,
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? process.env.COOKIE_SAME_SITE_PROD : process.env.COOKIE_SAME_SITE_DEV,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });

  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};