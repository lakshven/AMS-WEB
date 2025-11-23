import React, { useState } from 'react';
import { HiUserCircle, HiEye, HiEyeOff } from 'react-icons/hi'; // 👈 Import the icon
import { useNavigate } from 'react-router-dom'; // 👈 Add navigation
import axios from '../utils/axiosInstance.jsx'
function Login({ onLogin }) {
  const [identifier, setIdentifier] = useState(''); // email or username
  // const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // 👈 Initialize navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/auth/login', {
                      identifier, password, rememberMe });
      const data =  response.data;
      if (data.success) {
        onLogin(data.role); // ✅ Pass role to parent
        navigate('/dashboard'); // 👈 Redirect after login
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Please try again.');
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

        <div className="bg-blue-100 p-6 rounded shadow-md w-[350px] mx-auto">
          <div className="flex justify-center mb-4 text-white-600">
            <HiUserCircle size={64} />
          </div>

          <h3 className="text-center text-sm text-gray-500 mb-6">USER LOGIN</h3>

          {error && <p className="text-red-600 mb-3 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Username / Email</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300 text-black"
                required
              />
            </div>
            <div>
                <label className="block mb-1 font-medium text-black-700">Password</label>
               <div className="relative">
                 <input
                   type={showPassword ? 'text' : 'password'}
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300 text-black pr-10"
                   required
                 />
                  <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
                   tabIndex={-1}
                   >
                   {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                 </button>
               </div>
             </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-sm text-center">
            <span>New user? </span>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-blue-600 hover:underline"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;