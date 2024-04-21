import React, { useEffect, useState } from "react";
import useStore from './useStore';
import { Outlet } from "react-router-dom";
import { MenuContext } from '../context/menu/Menu.context'
import Sidebar from "../Shared/Sidebar";
// import Header from "./Header";
import ErrorBoundary from "../../ErrorBoundary ";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Sidebar from "../Sidebar/sidebar";

const refreshToken = async () => {
  const appConfig = window.globalConfig || { siteName: process.env.REACT_APP_SITENAME };
  const api = appConfig.APIHOST;
  try {
    let token = localStorage.getItem('token');
    if (token) {
      // Token tidak tersedia, tidak perlu melakukan refresh
      const response = await fetch(`${api}/api/Account/refreshToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Menggunakan token dari localStorage
        }
      });
  
      if (!response.ok) {
        let errorMessage = 'Failed to refresh token';
        if (response.status === 401) {
          // Unauthorized, token expired or invalid
          errorMessage = 'Your session has expired. Please log in again.';
          // Hapus semua data dari localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('UserId');
          localStorage.removeItem('username');
          localStorage.removeItem('DisplayName');
          localStorage.removeItem('DisplayName');
          localStorage.removeItem('Role');
  
          // Redirect ke halaman login setelah 2 detik
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
        // Menampilkan pesan error menggunakan React Toastify
        toast.error(errorMessage);
        return;
      }
  
      const data = await response.json();
      const newToken = data.Token;
  
      // Simpan token baru ke localStorage
      localStorage.setItem('token', newToken);
      return newToken;
    }

    

  } catch (error) {
    console.error('Error refreshing token:', error.message);
    throw error;
  }
};


export default function Layout() {
  const [open, setOpen] = useState(false)
  const user = useStore(state => state.user);
  useEffect(() => {
    refreshToken();
  }, []);

  return (
    <div className="bg-white h-screen w-screen overflow-hidden flex flex-row">
      <MenuContext.Provider value={{ open, setOpen }}>
        {/* <div className='bg-teal-200'>Sidebar</div> */}
        <ErrorBoundary>
          <Sidebar />
        </ErrorBoundary>

        <div className="flex flex-col flex-1">
          {/* <ErrorBoundary>
            <Header />
          </ErrorBoundary> */}

          <div className="flex-1 p-4 min-h-0 overflow-auto">
            <div>
              {/* Konten aplikasi Anda */}
              <ToastContainer position="bottom-center" />
            </div>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </div>
        {/* <div className='bg-sky-200'>Header</div> */}
        {/* <p>Footer</p> */}
      </MenuContext.Provider>
    </div>
  );
}
