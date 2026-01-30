import jwt from "jsonwebtoken";

export interface User {
  userId: string;
  email: string;
  name: string;
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as User;
    return decoded;
  } catch {
    return null;
  }
}

export function generateToken(user: User): string {
  return jwt.sign(user, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d",
  });
}