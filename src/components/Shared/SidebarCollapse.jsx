import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FiHome, FiSettings, FiFolder } from 'react-icons/fi';
import menuData from './menuData.json';

const SidebarCollapse = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (menuId) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  return (
    <div className={`bg-gray-800 text-gray-100 ${isOpen ? 'w-64' : 'w-16'} h-screen p-5 pt-8 relative duration-300`}>
      <button
        className={`absolute cursor-pointer rounded-full -right-3 top-9 w-7 border-2 border-gray-200 ${isOpen ? 'rotate-180' : ''}`}
        onClick={toggleMenu}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className="flex gap-x-4 items-center">
        <FiHome className={`text-xl cursor-pointer duration-500 ${isOpen ? 'rotate-[360deg]' : ''}`} />
        <h1 className={`text-xl duration-300 ${!isOpen && 'hidden'}`}>Logo</h1>
      </div>

      <ul className="pt-6">
        {menuData.map((menu) => (
          <React.Fragment key={menu.id}>
            <li
              className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-700 rounded-md ${
                activeMenu === menu.id ? 'bg-gray-700' : ''
              }`}
              onClick={() => handleMenuClick(menu.id)}
            >
              <menu.icon className="text-lg" />
              <span className={`${!isOpen && 'hidden'} origin-left duration-300`}>{menu.label}</span>
              {menu.subMenus && (
                <span className={`${!isOpen && 'hidden'} text-xs`}>{menu.subMenus.length}</span>
              )}
            </li>
            {menu.subMenus && (
              <ul
                className={`${
                  activeMenu === menu.id ? 'block' : 'hidden'
                } px-4 pt-2 pb-4 rounded-md bg-gray-700`}
              >
                {menu.subMenus.map((subMenu) => (
                  <li
                    key={subMenu.id}
                    className="text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-600 rounded-md"
                  >
                    <subMenu.icon className="text-lg" />
                    <span className={`${!isOpen && 'hidden'} origin-left duration-300`}>{subMenu.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default SidebarCollapse;