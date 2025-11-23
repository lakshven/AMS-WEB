import { createTransport } from 'nodemailer';

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function sendMail({ to, subject, text }) {
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
}