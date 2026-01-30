import jwt from 'jsonwebtoken';
import { config } from '../config/environment';

// Generate access and refresh tokens
export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign({ id: userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
};

// Verify refresh token
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.jwt.refreshSecret) as { id: string };
};

// Generate email verification token
export const generateEmailVerificationToken = (userId: string) => {
  return jwt.sign({ id: userId, type: 'email_verification' }, config.jwt.secret, {
    expiresIn: '24h',
  });
};

// Generate password reset token
export const generatePasswordResetToken = (userId: string) => {
  return jwt.sign({ id: userId, type: 'password_reset' }, config.jwt.secret, {
    expiresIn: '10m',
  });
};

// Verify token and return payload
export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwt.secret) as {
    id: string;
    type?: string;
    iat: number;
    exp: number;
  };
};