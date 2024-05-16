import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfileForm = () => {
  const appConfig = window.globalConfig || {
    siteName: process.env.REACT_APP_SITENAME,
  };
  const api = appConfig.APIHOST;
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  let token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${api}/api/Account/`;
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        const response = await axios.get(apiUrl, config);
        const { DisplayName, UserName, Image,Email } = response.data;
        setDisplayName(DisplayName);
        setEmail(Email);
        setUserName(UserName);
        if (Image) {
          // Combine server URL with Image path
          const fullImageUrl = `${api}${Image}`;
          setPreviewImage(fullImageUrl);
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error.response.data);
        setErrorMessage(error.response.data.message);
      }
    };
    fetchData();
  }, []);
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
    setImage(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*', multiple: false });
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setErrorMessage("Email tidak valid");
      return;
    }
    try {
      const apiUrl = `${api}/api/Account/updateProfile`;
      const formData = new FormData();
      formData.append('DisplayName', displayName);
      formData.append('UserName', userName);
      formData.append('Email', email);
      if (image) {
        formData.append('Image', image);
      }
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };
      const response = await axios.put(apiUrl, formData, config);
      
      // Reset form fields
      setErrorMessage('');
toast.success("Updated profile succes")
    } catch (error) {
      toast.error('Failed to update profile:', error.response.data);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <div className="mb-4">
          <label htmlFor="userName" className="block text-gray-700 text-sm font-bold mb-2">User Name</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={userName}
            placeholder="User Name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="displayName" className="block text-gray-700 text-sm font-bold mb-2">Display Name</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display Name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="displayName" className="block text-gray-700 text-sm font-bold mb-2">Display Name</label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            title="Masukkan email yang valid (contoh: gugai.way@gugai.com)"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Profile Picture</label>
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            {previewImage ? (
              <div className="bg-gray-100 p-4 rounded-lg">
                <img src={previewImage} alt="Preview" className="rounded-full w-32 h-32 mx-auto mb-4" />
              </div>
            ) : (
              <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center">
                <p className="text-gray-500 mb-2">Drop an image here or click to upload</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
