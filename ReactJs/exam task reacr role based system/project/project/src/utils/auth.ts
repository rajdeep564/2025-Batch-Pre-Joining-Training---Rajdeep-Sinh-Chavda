import * as jose from 'jose';
import bcrypt from 'bcryptjs';
import { User } from '../types';

// 🔹 Secret key for JWT signing (must be at least 32 chars)
const SECRET_KEY = new TextEncoder().encode('e78b555f11e673d709bbbe937f16d7e3b5091278b41635f6c8bdb0e1b802a1a3df56d24dd98ff8f8d9f50151ee4e04016e343170820fd1de60ef70d515723011c39b25c5b46ec3b6a13a9f0380de0f46db4ce33a5550084d704ec67c543bdb1eb8f6e4fcba95e53608b174198efda6c1e78de4b198db1d3ec324261a14c10d99');

// 🔹 Generate JWT token
export const generateToken = async (user: Omit<User, 'password'>) => {
  const token = await new jose.SignJWT({ userId: user.id, roleId: user.roleId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h') // Token expires in 2 hours
    .sign(SECRET_KEY);
  
  return token;
};

// 🔹 Verify JWT token
export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET_KEY);
    return payload;
  } catch {
    throw new Error('Invalid token');
  }
};

// 🔹 Hash password securely before saving to database
export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

// 🔹 Compare a plain text password with a hashed password
export const comparePassword = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};
