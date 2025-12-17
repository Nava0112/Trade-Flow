import { 
    getUsers, 
    createUser, 
    getUserByEmail, 
    deleteUser, 
    updateUserPassword 
} from '../models/user.models.js';

export const createUserController = async (req, res) => {
    const { name, email, password, balance } = req.body;
    const newUser = { name, email, password, balance };
    try {
        const findUser = await getUserByEmail(newUser.email);
        if (findUser) {
            return  res.status(400).json({ error: "User with this email already exists" });
        }
        const addedUser = await createUser(newUser);
        res.status(201).json(addedUser);
    }
    catch(err){
        console.error("Error adding user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getAllUsersController = async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    }
    catch(err){
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getUserByEmailController = async (req, res) => {
    const email = req.params.email;
    try {
        const user = await getUserByEmail(email);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    }
    catch(err){
        console.error("Error fetching user by email:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteUserController = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedCount = await deleteUser(id);
        if (deletedCount) {
            res.status(200).json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    }
    catch(err){
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateUserPasswordController = async (req, res) => {
    const id = req.params.id;
    const { password } = req.body;
    try {
        const updatedUser = await updateUserPassword(id, password);
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    }
    catch(err){
        console.error("Error updating user password:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

