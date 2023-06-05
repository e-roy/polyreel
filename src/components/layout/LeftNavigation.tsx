"use client";
// components/layout/LeftNavigation.tsx

import { FaHome, FaBell, FaUserAlt } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { GoGlobe } from "react-icons/go";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useMemo } from "react";
import { UserContext } from "@/context";
import { CreatePost } from "@/components/home";
import { Logout } from "@/components/lens/auth";

type NavLink = {
  id: number;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  href: string;
};

export const LeftNavigation = () => {
  const { currentUser, verified } = useContext(UserContext);
  const pathname = usePathname();

  const userNav: NavLink[] = useMemo(
    () => [
      {
        id: 1,
        label: "Home",
        icon: <FaHome className="text-3xl h-7 w-7 mx-auto" />,
        active: pathname === "/home",
        href: "/home",
      },
      {
        id: 2,
        label: "Explore",
        icon: <GoGlobe className="text-3xl h-7 w-7 mx-auto" />,
        active: pathname === "/explore",
        href: "/explore",
      },
      {
        id: 3,
        label: "Notifications",
        icon: <FaBell className="text-3xl h-7 w-7 mx-auto" />,
        active: pathname === "/notifications",
        href: "/notifications",
      },
      {
        id: 4,
        label: "Profile",
        icon: <FaUserAlt className="text-3xl h-7 w-7 mx-auto" />,
        active: pathname === `/profile/${currentUser?.handle}`,
        href: `/profile/${currentUser?.handle}`,
      },
      {
        id: 5,
        label: "Settings",
        icon: <FiSettings className="text-3xl h-7 w-7 mx-auto" />,
        active: pathname === "/settings",
        href: "/settings",
      },
    ],
    [pathname, currentUser]
  );

  const guestNav: NavLink[] = useMemo(
    () => [
      {
        id: 2,
        label: "Explore",
        icon: <GoGlobe className="text-3xl h-7 w-7 mx-auto" />,
        active: pathname === "/explore",
        href: "/explore",
      },
      {
        id: 5,
        label: "Settings",
        icon: <FiSettings className="text-3xl h-7 w-7 mx-auto" />,
        active: pathname === "/settings",
        href: "/settings",
      },
    ],
    [pathname]
  );

  const sidebarNav = currentUser && verified ? userNav : guestNav;
  return (
    <div className={`flex flex-col justify-between h-full`}>
      <ul className={``}>
        {sidebarNav.map((item: any, index: number) => (
          <li key={index}>
            <Link
              href={item.href}
              className={`flex hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full text-stone-500 dark:text-stone-300 hover:text-stone-800 my-2 p-2  ${
                item.active ? "text-stone-900 dark:text-white font-bold" : ""
              }`}
            >
              <span>{item.icon}</span>
              <span className="pl-2 my-auto block md:hidden xl:block">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
        {currentUser && verified && <Logout className={``} />}
      </ul>
      <div className={`mb-8 w-full`}>
        <CreatePost />
      </div>
    </div>
  );
};
