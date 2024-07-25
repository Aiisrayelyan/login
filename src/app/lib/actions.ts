"use server"

import { nanoid } from "nanoid"
import { OptionalUser, IUser } from "./types"
import bcrypt from "bcrypt"
import { addUser, getUserByLogin } from "./api"
import Database from 'better-sqlite3';

// Open the SQLite database
const db = new Database('./auth.db');

// Refined regular expression for password validation
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&+])[A-Za-z\d@$!%*?&+]{6,}$/;

function validateRegistration(login: string, password: string): { valid: boolean, message: string } {
    const existingUser = db.prepare('SELECT login FROM users WHERE login = ?').get(login);
    if (existingUser) {
        return { valid: false, message: 'Login is already taken.' };
    }

    if (!passwordRegex.test(password)) {
        return { valid: false, message: 'Password must be at least 6 characters long and include letters, numbers, and symbols.' };
    }

    return { valid: true, message: 'Validation successful.' };
}

export const handleSignup = async (prev: unknown, data: FormData) => {
    if (!data.get('name') || !data.get('surname')) {
        return { message: 'please fill all of the fields' };
    }

    const login = data.get('login') as string;
    const password = data.get('password') as string;

    const validation = validateRegistration(login, password);
    if (!validation.valid) {
        return { message: validation.message };
    }

    const user: OptionalUser = {
        id: nanoid(),
        name: data.get('name') as string,
        surname: data.get('surname') as string,
        login: login,
        password: await bcrypt.hash(password, 10)
    };

    addUser(user);
}

// Function to handle login
export const handleLogin = async (prev: unknown, data: any): Promise<{ message: string, user?: IUser }> => {
    const login = data.login as string;
    const password = data.password as string;

    if (!login || !password) {
        return { message: 'Please fill all of the fields' };
    }

    const user = getUserByLogin(login);

    if (!user) {
        return { message: 'Login does not exist' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
        return { message: 'Incorrect password' };
    }

    return {
        message: 'Login successful',
        user: {
            id: user.id,
            name: user.name,
            surname: user.surname,
            login: user.login,
        }
    };
};
