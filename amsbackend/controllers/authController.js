import pool  from '../models/db.js';
import { hash, compare } from 'bcryptjs';
import { randomBytes}   from 'crypto';
import nodemailer from 'nodemailer';
import sendEmail from '../utils/sendEmail.js';
// 🔐 Signup Controller
export async function signup(req, res) {
  const { firstName, lastName, username, email, password, role } = req.body;

  try {
    // Check if username or email already exists
    const existing = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Insert new user
    await pool.query(
      `INSERT INTO users (first_name, last_name, username, email, password, role)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [firstName, lastName, username, email, hashedPassword, role || 'user']
    );

    res.json({ success: true, message: 'Signup successful' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
}

// 🔓 Login Controller
export async function login(req, res) {
  const { identifier, password } = req.body;

  try {
    // Try to find user by username or email
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $1',
      [identifier]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    res.json({
      success: true,
      message: 'Login successful',
      role: user.role,
      username: user.username,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
}

// ✅ Forgot Password Controller
export async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      // Don't reveal whether email exists
      return res.json({ success: true, message: 'Reset link sent if email exists' });
    }

    // ✅ Generate secure token
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    // ✅ Store token and expiry in database
    await pool.query(
      `UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3`,
      [token, expires, email]
    );

    // ✅ Send email with reset link
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587, // ✅ Use 587 instead of default 465
      secure: false, // TLS starts after connection
      auth:
       {
          user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASS,
       },
    });

    const resetLink = `http://localhost:3000/reset-password/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>Hello ${user.first_name},</p>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Reset link sent if email exists' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, message: 'Server error during password reset' });
  }
}
// Dashboard Controller

export async function getDashboardStats(req, res) {
  try {
    const result = await pool.query('SELECT COUNT(*) AS total FROM assets');
    res.json({ total: result.rows[0].total });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
}
//Reset password controller

export async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await pool.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [token]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashed = await hash(password, 10);

    await pool.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = $2',
      [hashed, token]
    );

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error during password reset' });
  }
}

export const sendResetCode = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert into password_resets table
    await pool.query(
      `INSERT INTO password_resets (email, code, expiry)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET code = $2, expiry = $3`,
      [email, code, expiry]
    );

    await nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    }).sendMail({
      to: email,
      subject: 'Your Password Reset Code',
      text: `Your verification code is: ${code}`,
    });

    res.json({ message: 'Verification code sent' });
  } catch (err) {
    console.error('Send reset code error:', err);
    res.status(500).json({ message: 'Server error during code generation' });
  }
};

export const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM password_resets WHERE email = $1 AND code = $2 AND expiry > NOW()',
      [email, code]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    res.json({ message: 'Code verified' });
  } catch (err) {
    console.error('Verify code error:', err);
    res.status(500).json({ message: 'Server error during code verification' });
  }
};

// export const resetPassword = async (req, res) => {
//   const { email, newPassword } = req.body;
//   const hashed = crypto.createHash('sha256').update(newPassword).digest('hex');
//   await db.User.update({ password: hashed }, { where: { email } });
//   await db.PasswordReset.destroy({ where: { email } });
//   res.json({ message: 'Password reset successful' });
// };


export async function getAssets(req, res) {
  try {
    const result = await pool.query('SELECT * FROM assets ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch assets error:', err);
    res.status(500).json({ message: 'Server error fetching assets' });
  }
}

export async function updateAsset(req, res) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { id } = req.params;
  const fields = req.body;

  const query = `
    UPDATE assets SET
      structure_no = $1, mileage = $2, structure_type = $3, spans = $4,
      structure_name = $5, location = $6, carries = $7, material_type = $8,
      work_item = $9, possible_consequence = $10,
      current_likelihood = $11, current_severity = $12, current_rating = $13, current_date_logged = $14,
      mitigation_likelihood = $15, mitigation_severity = $16, mitigation_rating = $17, mitigation_completion = $18,
      status = $19, detailed_exam_years = $20, last_exam = $21, next_exam = $22,
      exam_report = $23, assessment = $24, records = $25
    WHERE id = $26
  `;

  const values = [
    fields.structure_no, fields.mileage, fields.structure_type, fields.spans,
    fields.structure_name, fields.location, fields.carries, fields.material_type,
    fields.work_item, fields.possible_consequence,
    fields.current_likelihood, fields.current_severity, fields.current_rating, fields.current_date_logged,
    fields.mitigation_likelihood, fields.mitigation_severity, fields.mitigation_rating, fields.mitigation_completion,
    fields.status, fields.detailed_exam_years, fields.last_exam, fields.next_exam,
    fields.exam_report, fields.assessment, fields.records,
    id
  ];

  try {
    await pool.query(query, values);
    res.json({ message: 'Asset updated successfully' });
  } catch (err) {
    console.error('Update asset error:', err);
    res.status(500).json({ message: 'Server error updating asset' });
  }
}