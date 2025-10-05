import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true); // toggle between login/signup
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate('/');
    } catch (err) {
      setError(err?.response?.data || 'Something went wrong');
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/signUp`,
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      navigate('/profile');
    } catch (err) {
      setError(err?.response?.data || 'Something went wrong');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) handleLogin();
    else handleSignUp();
  };

  return (
    <div className="flex justify-center my-20">
      <fieldset className="fieldset bg-white/90 border border-gray-200 rounded-2xl shadow-2xl w-[350px] p-6 backdrop-blur">
        <legend className="fieldset-legend text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? 'Login' : 'Sign Up'}
        </legend>

        {!isLogin && (
          <>
            <label className="label font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 mb-2"
              placeholder="Enter first name"
            />
            <label className="label font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 mb-2"
              placeholder="Enter last name"
            />
          </>
        )}

        <label className="label font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
          className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 mb-2"
          placeholder="Enter your email"
        />

        <label className="label font-medium text-gray-700 mt-3">Password</label>
        <div className="relative w-full">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full focus:ring-2 focus:ring-pink-500 pr-12"
            placeholder="Enter your password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-2 rounded-lg text-sm font-semibold bg-red-100 text-red-700 border border-red-300 animate-pulse">
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="btn w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-purple-500 hover:to-pink-500 shadow-md"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          {isLogin ? "Don’t have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </fieldset>
    </div>
  );
};

export default AuthForm;
