import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? ""; // Replace in prod

export function signJWT(payload: object, expiresIn: string = "7d") {
  console.log("JWT_SECRET", JWT_SECRET);
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
