import db from '../db/knex.js';

export const getUsers = async () => {
    return await db('users').select('*');
};

export const getUserByEmail = async (email) => {
    return await db('users').where({ email }).first();
}

export const createUser = async (user) => {
    const newUser = {
        name: user.name,
        email: user.email,
        password: user.password,
        balance: user.balance
    };
    const findUser = await getUserByEmail(newUser.email);
    if (findUser) {
        throw new Error('User with this email already exists');
    }
    const [createdUser] = await db('users').insert(newUser).returning('*');
    return createdUser;
}

export const updateUserBalance = async (id, balance) => {
    const [updatedUser] = await db('users').where({ id }).update({ balance }).returning('*');
    return updatedUser;
}

export const deleteUser = async (id) => {
    return await db('users').where({ id }).del();
}

export const updateUserPassword = async (id, password) => {
    const [updatedUser] = await db('users').where({ id }).update({ password }).returning('*');
    return updatedUser;
}

