import React, {useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlineInventory } from "react-icons/md";
import { DASHBOARD_SIDEBAR_LINKS, DASHBOARD_SIDEBAR_BOTTOM_LINKS } from '../../lib/constants';
import { HiOutlineLogout } from 'react-icons/hi';
import classNames from 'classnames';

const linkClass = 'flex items-center gap-2 font-light px-3 py-2 hover:bg-white hover:rounded-l-full ease-in-out hover:no-underline active:bg-white rounded-sm text-base hover:text-green-800';

export default function Sidebar() {
  const { pathname } = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isTopMenuSelected, setIsTopMenuSelected] = useState(false);
  const handleSubMenuToggle = (key) => {
    setOpenSubMenu(openSubMenu === key ? null : key);
    setIsTopMenuSelected(true);
  };

   
  return (
    <div className='flex flex-col bg-green-600 w-45 pl-1 rounded-l-lg sm:w-44'>
      <div className="flex items-center gap-2 px-1 py-3">
        <MdOutlineInventory fontSize={24} />
        <span className="text-neutral-200 text-lg">DEBUG TWQ</span>
      </div>
      <div className='flex-1 py-8 flex flex-col gap-0.5'>
        {DASHBOARD_SIDEBAR_LINKS.map((item) => (
          <SideBarLink key={item.key} item={item} />
        ))}
      </div>
      <div className="flex flex-col gap-0.5 pt-2 border-t border-slate-300">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
          <SideBarLink key={item.key} item={item} handleSubMenuToggle={handleSubMenuToggle} openSubMenu={openSubMenu} />
        ))}
      </div>
      <div className={classNames(linkClass, 'cursor-pointer text-red-500')}>
        <span className="text-xl">
          <HiOutlineLogout />
        </span>
        Logout
      </div>
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
        <div className={classNames(isCurrentPath && !hasSubMenu ? 'active ' : '', linkClass, 'text-white')}> {/* Add text-white class */}
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

