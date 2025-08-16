import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? ""; // Replace with env in production
// 604800000 => 7d
console.log(JWT_SECRET);
export function signJWT(payload: object, expiresIn: number = 604800) {
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
