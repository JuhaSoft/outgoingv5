import {
	HiOutlineViewGrid,
	HiOutlineCube,
	HiOutlineShoppingCart,
	HiOutlineUsers,
	HiOutlineDocumentText,
	HiOutlineAnnotation,
	HiOutlineQuestionMarkCircle
} from 'react-icons/hi'
import { HiOutlineCog } from "react-icons/hi";
import { FaCheckDouble } from "react-icons/fa";
export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/',
		icon: <HiOutlineViewGrid />,
		hasSubMenu: false
	},
	{
		key: 'products',
		label: 'Check Product',
		path: '/products',
		icon: <FaCheckDouble />,
		hasSubMenu: false
	},
	{
		key: 'Orders',
		label: 'Work Order',
		path: '/orders',
		icon: <HiOutlineShoppingCart />,
		hasSubMenu: false
	},
	
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'settings',
		label: 'Settings',
		path: '',
		icon: <HiOutlineCog />,
		hasSubMenu: true,
		submenu: [
			{
				key: 'CollapsibleTables',
				label: 'Collapsible Table',
				path: '/CollapsibleTable',
				icon: <HiOutlineCog />
			  },
			{
				key: 'Parameters',
				label: 'Parameter',
				path: '/Parameters',
				icon: <HiOutlineCog />
			  },
			
			  {
				key: 'References',
				label: 'Reference',
				path: '/References',
				icon: <HiOutlineCog />
			  },
			  {
				key: 'LastStations',
				label: 'Last Station',
				path: '/LastStations',
				icon: <HiOutlineCog />
			  },
			  {
				key: 'Lines',
				label: 'Line',
				path: '/Lines',
				icon: <HiOutlineCog />
			  },
		  {
			key: 'user-registration',
			label: 'User',
			path: '/settings/user-registration',
			icon: <HiOutlineCog />
		  },
		  
		]
	  },
	{
		key: 'support',
		label: 'Help & Support',
		path: '/support',
		icon: <HiOutlineQuestionMarkCircle />,
		hasSubMenu: false
	}
]
