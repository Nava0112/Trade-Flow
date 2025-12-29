import { createUser, getUserByEmail } from "../client/user.client.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import redis from "../db/redis.js";

export const signupController = async (req, res) => {
    const { email, password, name, balance } = req.body;
    try {
        const findUser = await getUserByEmail(email);
        if (findUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }
        const newUser = await createUser({ email, password: password, name, balance });  

        const accessToken = jwt.sign({
            id: newUser.id,
            email: newUser.email,
            role : newUser.role
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        const refreshToken = jwt.sign({
            id: newUser.id,
            email: newUser.email,
            role : newUser.role
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

        redis.set(`refreshToken:${newUser.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60);

        res.status(201).json({ user: newUser, accessToken : accessToken, refreshToken : refreshToken });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const loginController = async (req, res) => {   
    const {email, password} = req.body;
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            console.log("User not found");
            return res.status(401).json({ error: "Invalid email" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Invalid password");
            return res.status(401).json({ error: "Invalid password" });
        }
        const accessToken = jwt.sign({
            id: user.id,
            email: user.email,
            role : user.role
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        const refreshToken = jwt.sign({
            id: user.id,
            email: user.email,
            role : user.role
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

        redis.set(`refreshToken:${user.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60);

        res.status(200).json({ user, accessToken : accessToken, refreshToken : refreshToken });
    } catch (error) {
        console.error("Error during login:", error);
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
    await redis.del(`refreshToken:${req.user.id}`);
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

    const storedToken = await redis.get(`refreshToken:${decoded.id}`);
    if (!storedToken || storedToken !== refreshToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    await redis.set(
      `refreshToken:${decoded.id}`,
      newRefreshToken,
      "EX",
      7 * 24 * 60 * 60
    );

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
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
