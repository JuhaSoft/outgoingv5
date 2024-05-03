import {
	HiOutlineViewGrid,
	HiOutlineCube,
	HiOutlineShoppingCart,
	HiOutlineUsers,
	HiOutlineDocumentText,
	HiOutlineAnnotation,
	HiOutlineQuestionMarkCircle
} from 'react-icons/hi'
import { GrUserSettings } from "react-icons/gr";
import { BsClipboard2Data } from "react-icons/bs";
import { FaRegCircleUser } from "react-icons/fa6";
import { HiOutlineCog } from "react-icons/hi";
import { FaCheckDouble } from "react-icons/fa";
export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/',
		icon: <HiOutlineViewGrid />,
		Access:["All"],
		hasSubMenu: false
	},
	{
		key: 'products',
		label: 'Check Product',
		path: '/products',
		icon: <FaCheckDouble />,
		Access:["All"],
		hasSubMenu: false
	},
	{
		key: 'Orders',
		label: 'Work Order',
		path: '/orders',
		icon: <HiOutlineShoppingCart />,
		Access:["All"],
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
		Access:["Admin","Staf","LI","Teknisi"],
		submenu: [
						{
				key: 'Parameters',
				label: 'Parameter',
				path: '/Parameters',
				Access:["Admin","Staf","LI","Teknisi"],
				icon: <BsClipboard2Data />
			  },
			
			  {
				key: 'References',
				label: 'Reference',
				path: '/References',
				Access:["Admin","Staf","LI","Teknisi"],
				icon: <BsClipboard2Data />
			  },
			  {
				key: 'LastStations',
				label: 'Last Station',
				path: '/LastStations',
				Access:["Admin","Staf","LI","Teknisi"],
				icon: <BsClipboard2Data />
			  },
			  {
				key: 'Lines',
				label: 'Line',
				path: '/Lines',
				Access:["Admin","Staf","LI","Teknisi"],
				icon: <BsClipboard2Data />
			  },
		  {
			key: 'Users',
			label: 'Users',
			path: '/Users',
			Access:["Admin","Staf"],
			icon: <GrUserSettings />
		  },
		  
		]
	  },
	
	
]
