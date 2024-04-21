import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import useStore from '../Shared/useStore';

const LoginForm = ({ history }) => {
  const [error, setError] = useState(null);
  const setUser = useStore(state => state.setUser);

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('https://localhost:5001/api/Account/login', {
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

  return (
    <div className="flex justify-center items-center h-screen">
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
          <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-80">
            <h2 className="text-2xl mb-4 text-center font-semibold text-green-600">Login</h2>
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
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <Field
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                name="password"
                id="password"
                placeholder="************"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
