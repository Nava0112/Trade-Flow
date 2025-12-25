import { hashPassword } from "../src/models/user.models.js";
import bcrypt from "bcrypt";

export const validatePassword = async () => {
    const password = "asdf";
    const hashedPassword = await hashPassword(password);

    console.log("Password:", password);
    console.log("Hashed:", hashedPassword);

    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log("Valid:", isValid);

    return isValid;
};

validatePassword().catch(console.error);
