export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Set up nodemailer transporter with Gmail and app password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,     // e.g., hetvishukla1001@gmail.com
    pass: process.env.GMAIL_PASSKEY,     // 16-char app password (no spaces)
  },
});

// Email template generator
const generateEmailTemplate = (name, email, userMessage) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #007BFF;">New Message Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0;">
        ${userMessage}
      </blockquote>
      <p style="font-size: 12px; color: #888;">Click reply to respond to the sender.</p>
    </div>
  </div>
`;

// POST route handler
export async function POST(request) {
  console.log('EMAIL_ADDRESS:', process.env.EMAIL_ADDRESS);
  console.log('GMAIL_PASSKEY set?:', !!process.env.GMAIL_PASSKEY);
  try {
    const payload = await request.json();
    const { name, email, message: userMessage } = payload;

    // Validate input
    if (!name || !email || !userMessage) {
      return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 });
    }

    // Compose email
    const mailOptions = {
      from: 'Portfolio Contact Form',
      to: process.env.EMAIL_ADDRESS,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${userMessage}`,
      html: generateEmailTemplate(name, email, userMessage),
      replyTo: email,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
    }, { status: 200 });

  } catch (error) {
    console.error('Email sending error:', error.message);
    return NextResponse.json({
      success: false,
      message: 'Failed to send message. Server error.',
    }, { status: 500 });
  }
}
