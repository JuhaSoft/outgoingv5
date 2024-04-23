import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineInventory } from "react-icons/md";
import { HiOutlineLogout } from 'react-icons/hi';
import { DASHBOARD_SIDEBAR_LINKS, DASHBOARD_SIDEBAR_BOTTOM_LINKS } from '../../lib/constants';
import { FaRegCircleUser } from "react-icons/fa6";
import { HiOutlineCog } from "react-icons/hi";
import classNames from 'classnames';
import { motion } from 'framer-motion'; // Import motion from framer-motion

const linkClass = 'flex items-center gap-2 font-light px-3 py-2 hover:bg-white hover:rounded-l-full ease-in-out hover:no-underline active:bg-white rounded-sm text-base hover:text-green-800';

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userDisplayName = localStorage.getItem('DisplayName');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userRole = localStorage.getItem('Role');
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleSubMenuToggle = (key) => {
    setOpenSubMenu(openSubMenu === key ? null : key);
  };
  useEffect(() => {
     
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (isLoggedIn) {
      autoLogout(); // Call auto logout when user is logged in
    }
  }, [isLoggedIn]); // Update ketika isLoggedIn berubah
  
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
  
    window.addEventListener('storage', handleStorageChange);
  
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  const handleLogout = () => {
    setIsLoggingOut(true); // Start logout process
    localStorage.removeItem('token'); // Remove token from localStorage
    setTimeout(() => {
      setIsLoggedIn(false);
      setIsLoggingOut(false); // Finish logout process
      navigate('/LoadingPage'); // Redirect to login page
    }, 2000); // Logout animation time
  };

  const autoLogout = () => {
    
    const token = localStorage.getItem('token');
    if (token) {
      const { exp } = JSON.parse(atob(token.split('.')[1])); // Decode token to get expiration time
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const timeToLogout = exp - currentTime; // Time until token expiration
      if (timeToLogout > 0) {
        setTimeout(handleLogout, timeToLogout * 1000); // Logout after timeToLogout seconds
      } else {
        console.log('AutoLogut')
        handleLogout(); // Logout immediately if token is already expired
      }
    }
  };
  const hasAccess = (accessList) => {
    if (accessList.includes("All")) {
      return true; // Access for all
    }
    if (!userRole) {
      return false; // No role, don't show
    }
    return accessList.includes(userRole); // Check if user role is in access list
  };
  return (
    <div className='flex flex-col bg-green-600 w-45 pl-1 rounded-l-lg sm:w-44'>
      {/* Sidebar content... */}
      {/* Sidebar links */}
      <div className="flex-1 py-8 flex flex-col gap-0.5">
        {DASHBOARD_SIDEBAR_LINKS.map((item) => (
          hasAccess(item.Access) && ( // Only render if user has access
            <SideBarLink key={item.key} item={item} />
          )
        ))}
      </div>
      {/* Sidebar bottom links */}
      <div className="flex flex-col gap-0.5 pt-2 border-t border-slate-300 mb-3">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
          hasAccess(item.Access) && ( // Only render if user has access
            <SideBarLink key={item.key} item={item} handleSubMenuToggle={handleSubMenuToggle} openSubMenu={openSubMenu} />
          )
        ))}
      </div>
      {/* User profile or login link */}
      <div className="flex flex-col gap-0.5 pt-2 border-t border-slate-300 mb-6">
        {isLoggedIn ? (
          <SideBarLink
            key="user-profile"
            item={{
              key: 'user-profile',
              label: userDisplayName || 'User Profile',
              path: '/profile',
              icon: <FaRegCircleUser />,
              hasSubMenu: true,
              submenu: [
                {
                  key: 'profiles',
                  label: 'Profile',
                  path: 'Users/EditProfileForm',
                  icon: <HiOutlineCog />
                },
                {
                  key: 'Logout',
                  label: 'Logout',
                  path: '/LoadingPage',
                  icon: <HiOutlineLogout />
                }
              ]
            }}
            handleSubMenuToggle={handleSubMenuToggle}
            openSubMenu={openSubMenu}
          />
        ) : (
          <SideBarLink
            key="login"
            item={{
              key: 'login',
              label: 'Login',
              path: '/LoginUser',
              icon: <HiOutlineCog />,
              hasSubMenu: false
            }}
          />
        )}
      </div>
      {/* Loading Animation */}
      {isLoading && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-4 rounded-lg"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-lg font-semibold">Logging out...</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function SideBarLink({ item, handleSubMenuToggle, openSubMenu }) {
  const { pathname } = useLocation();
  const isCurrentPath = pathname === item.path;
  const hasSubMenu = item.hasSubMenu;
  const isOpen = openSubMenu === item.key;

  const handleClick = () => {
    if (hasSubMenu) {
      handleSubMenuToggle(isOpen ? null : item.key);
    } else {
      if (pathname !== item.path) {
        window.location.href = item.path;
      }
    }
  };

  return (
    <div>
      <div onClick={handleClick} style={{ cursor: hasSubMenu ? 'pointer' : 'default' }}>
        <div className={classNames(isCurrentPath && !hasSubMenu ? 'active ' : '', linkClass, 'text-white')}>
          <span className='text-xl'>{item.icon}</span>
          {item.label}
        </div>
      </div>
      {hasSubMenu && isOpen && (
        <div style={{ marginLeft: '20px' }}>
          {item.submenu.map((subItem) => (
            <Link key={subItem.key} to={subItem.path} className={classNames(pathname === subItem.path ? 'text-green-600 bg-white rounded-l-full' : 'text-white', linkClass)}>
              <span className='text-xl'>{subItem.icon}</span>
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
