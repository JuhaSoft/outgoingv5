import React, { useState } from 'react';
import axios from 'axios';
import { FaEye } from "react-icons/fa";

function ChangePassword() {
  const appConfig = window.globalConfig || {
    siteName: process.env.REACT_APP_SITENAME,
  };
  const api = appConfig.APIHOST;
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem("token");

  const handleChangePassword = async (e) => {
    e.preventDefault(); // Prevent form submission

    try {
      const response = await axios.post(
        `${api}/api/account/changePassword`,
        {
          oldPassword: oldPassword,
          newPassword: newPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${token}` // Add Authorization header
          }
        }
      );

      setMessage(response.data); // Set success message
      setError(''); // Clear error message
      setOldPassword(''); // Clear input
      setNewPassword(''); // Clear input
    } catch (error) {
      setError('Failed to change password.'); // Set error message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Change Password</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleChangePassword}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="oldPassword" className="sr-only">Old Password</label>
              <div className="relative">
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showOldPassword ? (
                    <FaEye className="h-5 w-5 text-gray-500 cursor-pointer" onClick={() => setShowOldPassword(false)} />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-500 cursor-pointer" onClick={() => setShowOldPassword(true)} />
                  )}
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="newPassword" className="sr-only">New Password</label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showNewPassword ? (
                    <FaEye className="h-5 w-5 text-gray-500 cursor-pointer" onClick={() => setShowNewPassword(false)} />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-500 cursor-pointer" onClick={() => setShowNewPassword(true)} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Change Password
            </button>
          </div>
        </form>
        {message && <p className="mt-2 text-center text-sm text-green-500">{message}</p>}
        {error && <p className="mt-2 text-center text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default ChangePassword;
