import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';
import { AuthedUserContext } from '../../App';

const ChangePasswordForm = () => {
  const user = useContext(AuthedUserContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '', 
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    setMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShow = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('❌ New password and confirm password do not match.');
      return;
    }
    try {
      await authService.changepassword(formData);
      setMessage('✅ Password updated successfully! Please sign in again.');
      setTimeout(() => navigate('/signin'), 1800);
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  const { username, currentPassword, newPassword, confirmPassword } = formData;

  // Dynamic password checks
  const checkPassword = {
    length: newPassword.length >= 12,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    digit: /\d/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };

  const isFormInvalid = () => {
    return !(
      newPassword &&
      confirmPassword &&
      newPassword === confirmPassword &&
      currentPassword &&
      username
    );
  };

  return (
    <div className="flex bg-cream min-h-screen justify-center items-center font-albert">
      <div className="bg-white rounded-xl px-8 pt-10 pb-10 mt-56 mb-36 max-w-md w-full shadow-lg">
        {/* Message */}
        {message && (
          <div className={`mb-5 text-center text-sm font-semibold ${message.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </div>
        )}
        <h2 className="text-2xl font-bold text-center mb-6 text-[#4B7A5A]">Change Password</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Username */}
          <div className="mb-5">
            <label className="block mb-1 font-semibold text-md" htmlFor="username">
              Username
            </label>
            <input
              className="w-full h-10 px-4 border border-[#4B7A5A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B7A5A]/50 transition"
              type="text"
              id="username"
              value={username}
              name="username"
              onChange={handleChange}
              required
              autoFocus
              placeholder="Enter your username"
            />
          </div>

          {/* Current Password */}
          <div className="mb-5 relative">
            <label className="block mb-1 font-semibold text-md" htmlFor="currentPassword">
              Current Password
            </label>
            <input
              className="w-full h-10 px-4 border border-[#4B7A5A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B7A5A]/50 transition"
              type={show.current ? "text" : "password"}
              id="currentPassword"
              value={currentPassword}
              name="currentPassword"
              onChange={handleChange}
              required
              placeholder="Enter current password"
            />
            <button type="button"
              className="absolute right-3 top-8 text-xs font-bold text-[#4B7A5A] hover:text-[#33593c] transition cursor-pointer"
              onClick={() => handleShow("current")}
              tabIndex={-1}
            >
              {show.current ? "Hide" : "Show"}
            </button>
          </div>

          {/* New Password */}
          <div className="mb-2 relative">
            <label className="block mb-1 font-semibold text-md" htmlFor="newPassword">
              New Password
            </label>
            <input
              className="w-full h-10 px-4 border border-[#4B7A5A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B7A5A]/50 transition"
              type={show.new ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              name="newPassword"
              onChange={handleChange}
              required
              placeholder="Enter new password"
            />
            <button type="button"
              className="absolute right-3 top-8 text-xs font-bold text-[#4B7A5A] hover:text-[#33593c] transition cursor-pointer"
              onClick={() => handleShow("new")}
              tabIndex={-1}
            >
              {show.new ? "Hide" : "Show"}
            </button>
          </div>
          {/* Dynamic Password Requirements */}
          <ul className="mb-3 text-xs ml-1 space-y-0.5">
            <li className={checkPassword.length ? "text-green-600" : "text-gray-400"}>
              At least 12 characters
            </li>
            <li className={checkPassword.upper ? "text-green-600" : "text-gray-400"}>
              One uppercase letter
            </li>
            <li className={checkPassword.lower ? "text-green-600" : "text-gray-400"}>
              One lowercase letter
            </li>
            <li className={checkPassword.digit ? "text-green-600" : "text-gray-400"}>
              One digit
            </li>
            <li className={checkPassword.special ? "text-green-600" : "text-gray-400"}>
              One special character
            </li>
          </ul>

          {/* Confirm New Password */}
          <div className="mb-7 relative">
            <label className="block mb-1 font-semibold text-md" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              className="w-full h-10 px-4 border border-[#4B7A5A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B7A5A]/50 transition"
              type={show.confirm ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              name="confirmPassword"
              onChange={handleChange}
              required
              placeholder="Re-enter new password"
            />
            <button type="button"
              className="absolute right-3 top-8 text-xs font-bold text-[#4B7A5A] hover:text-[#33593c] transition cursor-pointer"
              onClick={() => handleShow("confirm")}
              tabIndex={-1}
            >
              {show.confirm ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex gap-4 justify-between mt-4">
            <button
              type="submit"
              disabled={isFormInvalid()}
              className={`flex-1 py-2 rounded-full font-semibold 
                ${isFormInvalid()
                ? "bg-[#4B7A5A]/30 cursor-not-allowed"
                : "bg-[#4B7A5A] hover:bg-[#33593c] transition text-white"}`}
            >
              Change Password
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 py-2 rounded-full font-semibold bg-gray-300 text-gray-700 hover:bg-red-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
