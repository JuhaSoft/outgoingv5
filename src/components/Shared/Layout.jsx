import React from "react";
import { useState } from 'react'

import { Outlet } from "react-router-dom";
import { MenuContext } from '../context/menu/Menu.context'
import Sidebar from "../Shared/Sidebar";
// import Header from "./Header";
import ErrorBoundary from "../ErrorBoundary ";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Sidebar from "../Sidebar/sidebar";

export default function Layout() {
  const [open, setOpen] = useState(false)
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
