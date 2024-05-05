import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiHome, FiSettings, FiFolder } from "react-icons/fi";
import menuData from "./menuData.json";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlinePassword } from "react-icons/md";
import { HiOutlineViewGrid, HiOutlineCube, HiOutlineShoppingCart, HiOutlineUsers, HiOutlineDocumentText, HiOutlineAnnotation, HiOutlineQuestionMarkCircle } from "react-icons/hi";
import { GrUserSettings } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { HiOutlineCog } from "react-icons/hi";
import { FaCheckDouble } from "react-icons/fa";
import { BsClipboard2Data } from "react-icons/bs";
import useSidebarStore from "../SidebarStore.js";

// Import HiOutlineLogout icon
import { HiOutlineLogout } from "react-icons/hi";

// Import submenuProfil from another file
import { submenuProfil } from "./subMenuProfil.jsx";

const iconMap = {
  FiHome: FiHome,
  FiSettings: FiSettings,
  FiFolder: FiFolder,
  HiOutlineViewGrid: HiOutlineViewGrid,
  HiOutlineCube: HiOutlineCube,
  HiOutlineShoppingCart: HiOutlineShoppingCart,
  HiOutlineUsers: HiOutlineUsers,
  HiOutlineDocumentText: HiOutlineDocumentText,
  HiOutlineAnnotation: HiOutlineAnnotation,
  HiOutlineQuestionMarkCircle: HiOutlineQuestionMarkCircle,
  GrUserSettings: GrUserSettings,
  FaRegCircleUser: FaRegCircleUser,
  HiOutlineCog: HiOutlineCog,
  FaCheckDouble: FaCheckDouble,
  BsClipboard2Data: BsClipboard2Data,
};

const SidebarCollapse = () => {
  const appConfig = window.globalConfig || {
    siteName: process.env.REACT_APP_SITENAME,
  };
  const api = appConfig.APIHOST;
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const { isOpen: zustandIsOpen, toggleSidebar } = useSidebarStore();
  const [isOpen, setIsOpen] = useState(zustandIsOpen);
  const userRole = localStorage.getItem("Role");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userDisplayName = localStorage.getItem("DisplayName");
  const userAvatar = `${api}${localStorage.getItem("Image")}`; // Get user avatar

  // State untuk mengelola visibilitas floating menu
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsOpen(zustandIsOpen);
  }, [zustandIsOpen]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (isLoggedIn) {
      autoLogout();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem("token");
    localStorage.removeItem("UserId");
    localStorage.removeItem("username");
    localStorage.removeItem("DisplayName");
    localStorage.removeItem("DisplayName");
    localStorage.removeItem("Role");
    setTimeout(() => {
      setIsLoggedIn(false);
      setIsLoggingOut(false);
      navigate("/LoadingPage");
    }, 2000);
  };

  const autoLogout = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const timeToLogout = exp - currentTime;
      if (timeToLogout > 0) {
        setTimeout(handleLogout, timeToLogout * 1000);
      } else {
        console.log("AutoLogut");
        handleLogout();
      }
    }
  };

  const hasAccess = (accessList) => {
    if (accessList.includes("All")) {
      return true;
    }
    if (!userRole) {
      return false;
    }
    return accessList.includes(userRole);
  };

  // Fungsi untuk menangani klik pada menu profil
  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Tambah event listener untuk menutup submenu profil saat klik diluar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu) {
        const profileMenu = document.getElementById("profileMenu");
        if (profileMenu && !profileMenu.contains(event.target)) {
          setShowProfileMenu(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <div
      className={`bg-green-600 text-gray-100 ${
        isOpen ? "w-40" : "w-auto pr-5"
      } h-screen py-5 pl-5 pt-8 relative duration-300`}
    >
      <button
        className="absolute z-50 flex items-center justify-center w-8 h-8 bg-white rounded-full text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out -right-4 top-4"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className="flex gap-x-4 items-center">
        {React.createElement(iconMap["FiHome"], {
          className: "text-3xl",
          style: { fontSize: isOpen ? "" : "1.5rem" },
        })}
        <h1
          className={`text-xl duration-300 ${!isOpen && "hidden"} ${
            isOpen ? "" : "text-lg"
          }`}
        >
          Logo
        </h1>
      </div>

      <ul className="pt-6">
        {menuData.map((menu) => (
          <React.Fragment key={menu.id}>
            <li
              className={`text-sm flex items-center gap-x-4 cursor-pointer p-2 rounded-l-full ${
                activeMenu === menu.id
                  ? "bg-white text-green-600 hover:bg-white hover:text-green-600"
                  : "text-white hover:bg-white hover:text-slate-600"
              } ${!isOpen && "rounded-full "}`}
              onClick={() => setActiveMenu(activeMenu === menu.id ? null : menu.id)}
              title={menu.label}
            >
              <Link to={menu.path} className="flex items-center gap-x-2">
                {React.createElement(iconMap[menu.icon], {
                  className: "text-3xl",
                  style: { fontSize: isOpen ? "" : "1.5rem" },
                })}
                <span
                  className={`${!isOpen && "hidden"} origin-left duration-300 ${
                    isOpen ? "" : "text-base"
                  }`}
                >
                  {menu.label}
                </span>
                {menu.subMenus && (
                  <span className={`${!isOpen && "hidden"} text-xs`}>
                    {menu.subMenus.length}
                  </span>
                )}
              </Link>
            </li>
            {menu.subMenus && (
              <ul
                className={`${activeMenu === menu.id ? "block" : "hidden"}  `}
              >
                {menu.subMenus.map((subMenu) => (
                  <li
                    key={subMenu.id}
                    className={`text-sm flex items-center gap-x-4 cursor-pointer ml-5  p-2 ${
                      !isOpen ? "rounded-full" : ""
                    } ${
                      activeSubMenu === subMenu.id
                        ? "bg-white text-green-600"
                        : "text-white hover:bg-white hover:rounded-full hover:text-green-600 "
                    }`}
                    onClick={() => setActiveSubMenu(subMenu.id)}
                    title={subMenu.label}
                  >
                    <Link
                      to={subMenu.path}
                      className="flex items-center gap-x-2"
                    >
                      {React.createElement(iconMap[subMenu.icon], {
                        className: "text-3xl",
                        style: { fontSize: isOpen ? "" : "1.5rem" },
                      })}
                      <span
                        className={`${
                          !isOpen && "hidden"
                        } origin-left duration-300 ${
                          isOpen ? "" : "text-base"
                        }`}
                      >
                        {subMenu.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </React.Fragment>
        ))}
      </ul>

      {/* Floating Menu untuk Profile */}
      {showProfileMenu && (
        <div id="profileMenu" className="absolute bottom-0 left-0 z-50 bg-green-600 text-white shadow-r-lg rounded-r-lg p-2"
             style={{ left: "5rem", maxWidth: "12rem" }}>
          <ul>
            {submenuProfil.map((subMenu) => (
              <li
                key={subMenu.key}
                className="cursor-pointer py-1 px-2 hover:bg-white hover:text-green-600 rounded"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate(subMenu.path);
                }}
              >
                <Link to={subMenu.path} className="flex items-center gap-x-2">
                  {subMenu.icon}
                  <span>{subMenu.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Menu untuk Login dan Profil Pengguna */}
      <div
        className={`absolute bottom-0 left-0 ${
          isOpen ? "" : "flex justify-center w-full"
        }`}
      >
        <ul>
          <li
            className={`text-sm flex items-center gap-x-4 cursor-pointer p-2 ${
              isOpen ? "rounded-l-full" : "rounded-full"
            } ${isOpen ? "ml-6" : ""}`}
          >
            {!isLoggedIn ? (
  // Opsi untuk Login
  <button
    onClick={() => {
      navigate("/LoginUser");
      toggleSidebar();
    }}
    className="flex items-center gap-x-2"
  >
    <FaRegCircleUser className="text-3xl" />
    <span>Login</span>
  </button>
) : (
  // Opsi untuk Profil Pengguna saat login
  <div>

  <button
                onClick={handleProfileClick}
                className="flex items-center gap-x-2"
              >
                <div
    className="relative"
    
    onMouseEnter={() => {
      const enlargedPhoto = document.getElementById("enlargedPhoto");
      if (enlargedPhoto) {
        enlargedPhoto.classList.remove("hidden");
        enlargedPhoto.classList.add("fixed");
      }
    }}
    onMouseLeave={() => {
      const enlargedPhoto = document.getElementById("enlargedPhoto");
      if (enlargedPhoto) {
        enlargedPhoto.classList.add("hidden");
        enlargedPhoto.classList.remove("fixed", "clicked");
      }
    }}
  >
    <img
      src={userAvatar}
      alt="User Avatar"
      className="w-12 h-12 rounded-full cursor-pointer"
    />
    {/* Enlarged Photo on Hover or Click */}
    <div
      id="enlargedPhoto"
      className="hidden top-1/2 right-3/4 transform translate-y-1/2 z-50"
    >
      <img
        src={userAvatar}
        alt="User Avatar"
        className="w-60 h-60 rounded-full shadow-lg border-4 border-green-600 cursor-pointer transition-transform duration-300 transform hover:scale-100"
      />
    </div>
   
  </div>
                <span>{userDisplayName}</span>
              </button>
  </div>
  
  
)}

          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarCollapse;
