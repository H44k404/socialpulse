import nodemailer from 'nodemailer';
import { config } from '../config/environment';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

const createTransporter = () => {
  return nodemailer.createTransport({
    host: config.email.smtp.host,
    port: config.email.smtp.port,
    secure: config.email.smtp.secure,
    auth: {
      user: config.email.smtp.auth.user,
      pass: config.email.smtp.auth.pass,
    },
  });
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `${config.email.from}`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (email: string, firstName: string): Promise<void> => {
  const subject = 'Welcome to YourAgencyName!';
  const message = `
    Hi ${firstName},

    Welcome to YourAgencyName! We're excited to have you on board.

    Your account has been successfully created. You can now start creating and scheduling your social media posts across all platforms.

    If you have any questions, feel free to reach out to our support team.

    Best regards,
    The YourAgencyName Team
  `;

  await sendEmail({ email, subject, message });
};

export const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<void> => {
  const resetUrl = `${config.cors.origin[0]}/reset-password/${resetToken}`;
  const subject = 'Password Reset Request';
  const message = `
    You are receiving this email because you (or someone else) has requested the reset of a password.

    Please click on the following link, or paste this into your browser to complete the process:

    ${resetUrl}

    This link will expire in 10 minutes.

    If you did not request this, please ignore this email and your password will remain unchanged.
  `;

  await sendEmail({ email, subject, message });
};

export const sendEmailVerificationEmail = async (email: string, verificationToken: string): Promise<void> => {
  const verificationUrl = `${config.cors.origin[0]}/verify-email/${verificationToken}`;
  const subject = 'Email Verification';
  const message = `
    Please verify your email address by clicking the link below:

    ${verificationUrl}

    This link will expire in 24 hours.

    If you did not create an account, please ignore this email.
  `;

  await sendEmail({ email, subject, message });
};

export const sendTeamInvitationEmail = async (
  email: string,
  teamName: string,
  inviterName: string,
  invitationToken: string
): Promise<void> => {
  const acceptUrl = `${config.cors.origin[0]}/team/invite/${invitationToken}`;
  const subject = `You're invited to join ${teamName}`;
  const message = `
    Hi,

    ${inviterName} has invited you to join the ${teamName} team on YourAgencyName.

    Click the link below to accept the invitation:

    ${acceptUrl}

    This invitation will expire in 7 days.

    If you don't want to join this team, you can safely ignore this email.
  `;

  await sendEmail({ email, subject, message });
};