import { useState } from 'react';
import axios from '../utils/axiosInstance'; // Make sure this file exists

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // ✅ Step 1: Send Reset Code
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await axios.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setMessage('If this email exists, a reset code has been sent.');
        setCodeSent(true);
      } else {
        setError(res.data.message || 'Request failed');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Server error. Please try again.');
    }
  };

  // ✅ Step 2: Verify Code
  const verifyCode = async () => {
    setMessage('');
    setError('');
    try {
      const res = await axios.post('/auth/verify-code', { email, code });
      if (res.data.success) {
        setMessage('Code verified. You may now reset your password.');
        setVerified(true);
      } else {
        setError(res.data.message || 'Invalid or expired code');
      }
    } catch (err) {
      console.error('Code verification error:', err);
      setError('Server error during code verification.');
    }
  };

  // ✅ Step 3: Reset Password
  const resetPassword = async () => {
    setMessage('');
    setError('');
    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const res = await axios.post('/auth/reset-password', { email, newPassword });
      if (res.data.success) {
        setMessage('Password reset successful. You may now log in.');
        setVerified(false);
        setCodeSent(false);
        setEmail('');
        setCode('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(res.data.message || 'Reset failed');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Server error during password reset.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>
      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {!codeSent ? (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-2 border rounded mb-4"
          />
          <button onClick={handleSubmit} className="w-full bg-green-600 text-white p-2 rounded">
            Send Reset Link
          </button>
        </>
      ) : !verified ? (
        <>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter verification code"
            className="w-full p-2 border rounded mb-4"
          />
          <button onClick={verifyCode} className="w-full bg-blue-600 text-white p-2 rounded">
            Verify Code
          </button>
        </>
      ) : (
        <>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full p-2 border rounded mb-4"
          />
          <button onClick={resetPassword} className="w-full bg-purple-600 text-white p-2 rounded">
            Reset Password
          </button>
        </>
      )}
    </div>
  );
}