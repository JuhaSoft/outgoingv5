import { MdOutlinePassword } from "react-icons/md";
import { HiOutlineCog } from "react-icons/hi";
import { HiOutlineLogout } from "react-icons/hi";

export const submenuProfil =[
    {
      key: "profiles",
      label: "Profile",
      path: "Users/EditProfileForm",
      icon: <HiOutlineCog />,
    },
    {
      key: "changePassword",
      label: "Set Password",
      path: "Users/ChangePassword",
      icon: <MdOutlinePassword />,
    },
    {
      key: "Logout",
      label: "Logout",
      path: "/LoadingPage",
      icon: <HiOutlineLogout />,
    },
  ];