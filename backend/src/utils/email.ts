import nodemailer, { Transporter } from 'nodemailer';
import { EmailOptions } from '../types';
import logger from './logger';

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: options.from || process.env.EMAIL_FROM || 'NexusAI <noreply@nexusai.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${options.to}`);
    } catch (error) {
      logger.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to NexusAI!</h1>
        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #0066cc; 
                  color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Verify Email Address
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
          If you didn't create an account with NexusAI, you can safely ignore this email.
        </p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Verify Your Email - NexusAI',
      html,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>You requested to reset your password. Click the button below to proceed:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #0066cc; 
                  color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
          If you didn't request a password reset, please ignore this email or contact support if you have concerns.
        </p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Password Reset - NexusAI',
      html,
    });
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to NexusAI, ${username}!</h1>
        <p>Your email has been verified successfully. You're now ready to start building amazing applications with AI!</p>
        <h2 style="color: #0066cc;">Getting Started</h2>
        <ul style="line-height: 1.8;">
          <li>Create your first project</li>
          <li>Chat with AI to design your app</li>
          <li>Deploy with one click</li>
        </ul>
        <a href="${process.env.FRONTEND_URL}/dashboard" 
           style="display: inline-block; padding: 12px 24px; background-color: #0066cc; 
                  color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Go to Dashboard
        </a>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Happy building!</p>
        <p>- The NexusAI Team</p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Welcome to NexusAI!',
      html,
    });
  }
}

export default new EmailService();
