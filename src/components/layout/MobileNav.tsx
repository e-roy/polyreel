"use client";
import { useContext, useMemo } from "react";
import { UserContext } from "@/context/UserContext/UserContext";
import { usePathname } from "next/navigation";

import { FaHome, FaBell, FaUserAlt } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { GoGlobe } from "react-icons/go";

import Link from "next/link";

type NavLink = {
  id: number;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  href: string;
};

const iconClassName = "text-3xl h-7 w-7 mx-auto";

const navLinks: Omit<NavLink, "active">[] = [
  {
    id: 1,
    label: "Home",
    icon: <FaHome className={iconClassName} />,
    href: "/home",
  },
  {
    id: 2,
    label: "Explore",
    icon: <GoGlobe className={iconClassName} />,
    href: "/explore",
  },
  {
    id: 3,
    label: "Notifications",
    icon: <FaBell className={iconClassName} />,
    href: "/notifications",
  },
  {
    id: 4,
    label: "Profile",
    icon: <FaUserAlt className={iconClassName} />,
    href: "/profile/",
  },
  {
    id: 5,
    label: "Settings",
    icon: <FiSettings className={iconClassName} />,
    href: "/settings",
  },
];

export const MobileNav = () => {
  const { currentUser, verified } = useContext(UserContext);
  const pathname = usePathname();

  const userNav: NavLink[] = useMemo(
    () =>
      navLinks.map((link) => ({
        ...link,
        active: pathname === link.href,
        href:
          link.id === 4
            ? `/profile/${currentUser?.handle?.localName}`
            : link.href,
      })),
    [pathname, currentUser]
  );

  const guestNav: NavLink[] = useMemo(
    () =>
      navLinks
        .filter((link) => link.id === 2 || link.id === 5)
        .map((link) => ({
          ...link,
          active: pathname === link.href,
        })),
    [pathname]
  );

  const bottomNav = currentUser && verified ? userNav : guestNav;

  return (
    <div className="w-full px-4 mx-auto md:hidden border-t bg-white/60 dark:bg-stone-900/60 border-stone-500/50 block absolute h-8vh inset-x-0 bottom-0 z-10">
      <div className="flex flex-row justify-center space-x-6">
        {bottomNav.map((item) => (
          <Link key={item.id} href={item.href} className="flex group">
            <span className="flex flex-col items-center hover:bg-stone-500 text-stone-700 dark:text-stone-200 hover:text-stone-100 mt-2 p-2 rounded">
              {item.icon}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
