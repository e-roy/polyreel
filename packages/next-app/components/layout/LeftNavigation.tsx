import { FaHome, FaBell, FaUserAlt } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { BsGlobeAmericas } from "react-icons/bs";
import { GoGlobe } from "react-icons/go";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "@/context";

export const LeftNavigation = () => {
  const { currentUser } = useContext(UserContext);
  const router = useRouter();
  console.log(router);
  const [sideNav, setSideNav] = useState("Explore");

  console.log(currentUser);

  const sidebarNav = [
    {
      id: 1,
      label: "Home",
      icon: <FaHome className="text-3xl h-8 w-8 mx-auto" />,
      active: router.pathname === "/home" ? true : false,
      href: "/home",
    },
    {
      id: 2,
      label: "Explore",
      icon: <GoGlobe className="text-3xl h-8 w-8 mx-auto" />,
      active: router.pathname === "/explore" ? true : false,
      href: "/explore",
    },
    {
      id: 3,
      label: "Notifications",
      icon: <FaBell className="text-3xl h-8 w-8 mx-auto" />,
      active: router.pathname === "/notifications" ? true : false,
      href: "/notifications",
    },
    {
      id: 4,
      label: "Profile",
      icon: <FaUserAlt className="text-3xl h-8 w-8 mx-auto" />,
      active:
        router.asPath === `/profile/${currentUser?.handle}` ? true : false,
      href: `/profile/${currentUser?.handle}`,
    },
    {
      id: 5,
      label: "Settings",
      icon: <FiSettings className="text-3xl h-8 w-8 mx-auto" />,
      active: router.pathname === "/settings" ? true : false,
      href: "/settings",
    },
  ];
  return (
    <>
      <ul className="mt-16">
        {sidebarNav.map((item: any, index: number) => (
          <li key={index}>
            <Link
              href={item.href}
              className={`flex hover:bg-stone-100 rounded-full text-stone-500 hover:text-stone-800 font-medium my-2 p-2 cursor-pointer ${
                item.active ? "text-stone-900 font-bold" : ""
              }`}
            >
              <span>{item.icon}</span>
              <span className="pl-2 my-auto hidden xl:block">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};
