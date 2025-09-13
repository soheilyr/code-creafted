import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? ""; // Replace with env in production
// 604800000 => 7d
export function signJWT(payload: object, expiresIn: number = 604800000) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.log(error);
    return null;
  }
}
