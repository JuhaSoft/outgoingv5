import React from 'react'
import { MdDashboard, MdOutlineMessage, MdLogout } from "react-icons/md";
import { SiSimpleanalytics } from "react-icons/si";
import { LiaToolsSolid } from "react-icons/lia";
import { IoSettingsSharp } from "react-icons/io5";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { motion } from "framer-motion"
import { IconBase } from "react-icons";
import { useEffect, useState } from "react";

const variants = {
  expanded: { width: "20%" },
  nonExpanded: { width: "5%" }
}
const navItems = [
  {
    name: "Dashboard",
    icon: MdDashboard
  },
  {
    name: "Analityc",
    icon: SiSimpleanalytics
  },
  {
    name: "Message",
    icon: MdOutlineMessage
  },
  {
    name: "Tools",
    icon: LiaToolsSolid
  },
  {
    name: "Setting",
    icon: IoSettingsSharp
  },
  {
    name: "Dashboard",
    icon: MdDashboard
  },
  {
    name: "Dashboard",
    icon: MdDashboard
  },
]
const Sidebar = () => {
  const [activeNavIndex,setActiveNavIdex] = useState(0)
  const [isExpanded,setIsExpanded] = useState(false)
  useEffect(()=>{
    const handleResize = () => 
    {
      const width = window.innerWidth;
      if ( width <= 768){
        setIsExpanded(false)
      } else {
        setIsExpanded(true)
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize)
 return () => {
  window.removeEventListener('resize',handleResize)
 };
  },[])
  return (
    <motion.section animate = {isExpanded ? "expanded": "nonExpanded"}
    variants={variants}
    className={'w-1/5 bg-gray-950 h-screen flex flex-col justify-between items-center gap-10 relative ' + (isExpanded? 'py-8 px-6' : 'px-8 py-6')}
    >
      <div className=" flex flex-col justify-center items-center gap-8 ">
        {
          isExpanded ? (
            <div id='logo-box'>
              <h1 className="text-red-600 font-bold text-4xl">DEBUG <span className="italic text-yellow-500">{'{TQW}'}</span></h1>

            </div>
          ):(
            <div className=" flex justify-center items-center "><h1 className="text-red-600 font-bold text-3xl">D
            <span className="italic text-yellow-500 text-3xl">T
            </span></h1>

            </div>
          )

        }
      </div>
      <div id='navlinks-box' className='flex flex-col justify-center items-center gap-5 w-full mt-5'   >
      {navItems.map((item,index)=>(
          <div key={item.name} id='link-box' className={'flex justify-start items-center gap-4 w-full cursor-pointer rounded-xl' 
          + (activeNavIndex=== index ? 'bg-yellow-400 text-black' : 'text-white' + (isExpanded ? 'px-6 py-2' : 'p-2') ) } 
          onClick={() =>setActiveNavIdex(index)}>
            <div className='bg-yellow-300 text-black p-2 rounded-full'>
              <item.icon className='md:w-6 w-4 h-4 md:h-6'/> 

            </div>
		  </div>
        ))

        }


      </div>
    </motion.section>
  )
}

export default Sidebar