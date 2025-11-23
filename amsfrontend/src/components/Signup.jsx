import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      alert('Signup successful! Please login.');
      navigate('/');
    } else {
      setError(data.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div
        className="relative p-6 rounded shadow-md w-[700px] mx-auto bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/amsimage.png')" }}
      >
        <img src="/images/CompanyLogo.jpg" alt="Logo" className="h-12 w-auto ml-auto mb-4" />

        <div className="text-left mb-6">
          <h4 className="text-lg font-medium text-White-700">WELCOME</h4>
          <h2 className="text-2xl font-bold text-White-800">
            ASSET MANAGEMENT PRIORITISATION SYSTEM
          </h2>
        </div>

        <div className="bg-blue-100 p-6 rounded shadow-md w-[400px] mx-auto">
          <h3 className="text-center text-sm text-gray-500 mb-6">USER SIGNUP</h3>

          {error && <p className="text-red-600 mb-3 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded text-black"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded text-black"
            />
            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded text-black"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded text-black"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded text-black"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-4 text-sm text-center">
            <span>Already have an account? </span>
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:underline"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;