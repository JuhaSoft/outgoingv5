import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import useStore from '../Shared/useStore';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = ({ history }) => {
  const appConfig = window.globalConfig || {
    siteName: process.env.REACT_APP_SITENAME,
  };
  const api = appConfig.APIHOST;
  const [error, setError] = useState(null);
  const setUser = useStore(state => state.setUser);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`${api}/api/Account/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      setUser(data);
      localStorage.setItem('token', data.Token); // Simpan token ke local storage
      localStorage.setItem('UserId', data.Id); // Simpan token ke local storage
      localStorage.setItem('username', data.UserName); // Simpan token ke local storage
      localStorage.setItem('DisplayName', data.DisplayName); // Simpan token ke local storage
      localStorage.setItem('Role', data.Role); // Simpan token ke local storage
      localStorage.setItem('Image', data.Image); // Simpan token ke local storage

      // Redirect ke halaman sebelumnya jika ada, jika tidak ke halaman utama
      if (history) {
        history.goBack();
      } else {
        window.location.href = "/"; // Redirect ke halaman utama jika history tidak tersedia
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(prevState => !prevState);
  };
  return (
    <div className="flex justify-center items-center h-screen ">
      <Formik
        initialValues={{ username: '', password: '' }}
        validate={values => {
          const errors = {};
          if (!values.username) {
            errors.username = 'Required';
          }
          if (!values.password) {
            errors.password = 'Required';
          }
          return errors;
        }}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form className=" shadow-md rounded px-8 pt-6 pb-8 mb-4 bg-green-500 w-1/4 text-white">
            <h2 className="text-2xl mb-4 text-center font-semibold text-black">Login</h2>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <Field
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="username"
                id="username"
                placeholder="Username"
              />
              <ErrorMessage name="username" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div className="mb-6 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <Field
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="************"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer mt-4"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-500" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-500" />
                )}
              </div>
              <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
