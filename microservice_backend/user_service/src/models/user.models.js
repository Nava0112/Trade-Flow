import db from '../db/knex.js';
import bcrypt from 'bcrypt';

export const getUsers = async () => {
    return await db('users').select('*');
};

export const getUserByEmail = async (email) => {
    return await db('users').where({ email }).first();
}

export const getUserById = async (id) => {
    return await db('users').where({ id }).first();
}

export const createBotUser = async (bot) => {
    const newBot = {
        id: 0,
        name: bot.name,
        email: bot.email,
        password: await hashPassword(bot.password),
        role: 'BOT',
    };
    const [createdBot] = await db('users').insert(newBot).returning('*');
    return createdBot;
}

export const createUser = async (user) => {
    const newUser = {
        name: user.name,
        email: user.email,
        password: await hashPassword(user.password),
    };
    const findUser = await getUserByEmail(newUser.email);
    if (findUser) {
        throw new Error('User with this email already exists');
    }
    const [createdUser] = await db('users').insert(newUser).returning('*');
    return createdUser;
}

export const getUserPortfolio = async (user_id) => {
    return await db('portfolios').where({ user_id });
}

export const deleteUser = async (id) => {
    // const existingPortfolios = await db('portfolios').where({ user_id: id });
    // if (existingPortfolios.length > 0) {
    //     await db('portfolios').where({ user_id: id }).del();
    // }
    return await db('users').where({ id }).del();
}

export const updateUserPassword = async (id, password) => {
    password =  await hashPassword(password);
    const [updatedUser] = await db('users').where({ id }).update({ password }).returning('*');
    return updatedUser;
}

export const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export const updateUser = async (id, user) => {
    const [updatedUser] = await db('users').where({ id }).update(user).returning('*');
    return updatedUser;
}