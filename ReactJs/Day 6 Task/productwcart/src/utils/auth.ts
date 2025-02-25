import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode("super-secret-key");

export const signJWT = async (payload: object) => {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).sign(SECRET);
};

export const verifyJWT = async (token: string) => {
  const { payload } = await jwtVerify(token, SECRET);
  return payload;
};
