"use client";
// components/layout/LeftNavigation.tsx

import { FaHome, FaBell, FaUserAlt } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { GoGlobe } from "react-icons/go";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useMemo } from "react";
import { UserContext } from "@/context/UserContext/UserContext";
import { CreatePost } from "@/components/layout/CreatePost";
import { Auth } from "@/components/auth/Auth";
import { SwitchNetwork } from "@/components/auth/SwitchNetwork";

import { useAccount } from "wagmi";
import { useCheckNetwork } from "@/hooks/useCheckNetwork";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { cn } from "@/lib/utils";

import { UserMenu } from "./UserMenu";

type NavLink = {
  id: number;
  label: string;
  icon: React.ReactNode;
  href: string;
};

export const LeftNavigation = () => {
  const { currentUser, verified } = useContext(UserContext);
  const correctNetwork = useCheckNetwork();
  const { connector } = useAccount();
  const pathname = usePathname();

  const isWalletConnected = useMemo(() => !!connector?.onConnect, [connector]);

  const userNav: NavLink[] = useMemo(
    () => [
      {
        id: 1,
        label: "Home",
        icon: <FaHome className="text-3xl h-7 w-7 mx-auto" />,
        href: "/home",
      },
      {
        id: 2,
        label: "Explore",
        icon: <GoGlobe className="text-3xl h-7 w-7 mx-auto" />,
        href: "/explore",
      },
      {
        id: 3,
        label: "Notifications",
        icon: <FaBell className="text-3xl h-7 w-7 mx-auto" />,
        href: "/notifications",
      },
      {
        id: 4,
        label: "Profile",
        icon: <FaUserAlt className="text-3xl h-7 w-7 mx-auto" />,
        href: `/profile/${currentUser?.handle?.localName}`,
      },
      {
        id: 5,
        label: "Settings",
        icon: <FiSettings className="text-3xl h-7 w-7 mx-auto" />,
        href: "/settings",
      },
    ],
    [currentUser]
  );

  const guestNav: NavLink[] = useMemo(
    () => [
      {
        id: 2,
        label: "Explore",
        icon: <GoGlobe className="text-3xl h-7 w-7 mx-auto" />,
        href: "/explore",
      },
      {
        id: 5,
        label: "Settings",
        icon: <FiSettings className="text-3xl h-7 w-7 mx-auto" />,
        href: "/settings",
      },
    ],
    []
  );

  const sidebarNav = currentUser && verified ? userNav : guestNav;
  return (
    <div className={`flex flex-col justify-between h-full mx-auto`}>
      <ul>
        {sidebarNav.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className={cn(
                `flex hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 my-2 p-2 xl:pr-6 ${
                  pathname === item.href
                    ? "text-stone-900 dark:text-white font-bold"
                    : ""
                }`
              )}
            >
              <span>{item.icon}</span>
              <span className="pl-2 my-auto block md:hidden xl:block">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className={`mb-8 w-full space-y-8`}>
        {isWalletConnected ? (
          correctNetwork ? (
            !verified && <Auth />
          ) : (
            <SwitchNetwork />
          )
        ) : (
          <ConnectButton showBalance={false} />
        )}
        {currentUser && verified && <CreatePost />}
        {currentUser && verified && <UserMenu />}
      </div>
    </div>
  );
};
