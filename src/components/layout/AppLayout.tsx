"use client";
// components/layout/AppLayout.tsx

import { usePathname } from "next/navigation";
import { UserContext } from "@/context";
import { Header } from "./Header";
import { LeftNavigation } from "./LeftNavigation";
import { WhoToFollow } from "@/components/home";
import { FaHome, FaBell, FaUserAlt } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { GoGlobe } from "react-icons/go";
import { useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCheckNetwork } from "@/hooks/useCheckNetwork";
import { Auth, SwitchNetwork } from "@/components/lens/auth";
import { useAccount } from "wagmi";

type NavLink = {
  id: number;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  href: string;
};

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { currentUser, verified, loading } = useContext(UserContext);
  const pathname = usePathname();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const correctNetwork = useCheckNetwork();
  const { connector } = useAccount();

  useEffect(() => {
    if (connector?.ready) {
      setIsWalletConnected(true);
    }
  }, [connector]);

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

  const bottomNav = currentUser && verified ? userNav : guestNav;

  return (
    <div className="flex flex-col h-screen overflow-hidden dark:bg-stone-950 dark:text-stone-200">
      <Header />
      <div className={`max-w-screen-2xl flex-grow md:px-2 lg:px-5`}>
        <div className="grid grid-cols-12 lg:gap-4 xl:gap-8 2xl:gap-12">
          {/* 3 column wrapper */}
          {/* Left Column */}
          <div className="md:col-span-1 xl:col-span-2 hidden md:block">
            <aside className="flex flex-col pt-16 ml-1 h-full">
              <LeftNavigation />
            </aside>
          </div>
          {pathname.startsWith("/post") ? (
            <div className="col-span-12 md:col-span-11 xl:col-span-10 overflow-y-scroll lg:overflow-y-hidden h-85vh md:h-screen">
              {children}
            </div>
          ) : (
            <>
              {/* Main Column */}
              <div className="w-full md:mx-2 col-span-12 md:col-span-11 lg:col-span-8 xl:col-span-7">
                <div className="h-9/10 md:h-98vh my-1 overflow-y-scroll sm:border-r sm:border-l border-stone-300">
                  {children}
                </div>
              </div>

              {/* Right Column */}
              <div className="pt-4 hidden lg:block lg:col-span-3">
                <div className={`h-12 flex justify-end`}>
                  {!isWalletConnected ? (
                    <ConnectButton />
                  ) : (
                    <>
                      {correctNetwork ? (
                        <>{!verified && <Auth />}</>
                      ) : (
                        <SwitchNetwork />
                      )}
                    </>
                  )}
                </div>

                <div className={`mt-4`}>
                  <WhoToFollow />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Mobile Nav */}
      <div className="w-full px-4 mx-auto md:hidden border-t bg-white/60 dark:bg-stone-900/60 border-stone-500/50 block absolute h-8vh inset-x-0 bottom-0 z-10">
        <div className="flex flex-row justify-center space-x-6">
          {bottomNav.map((item: any, index: number) => (
            <Link key={index} href={item.href} className="flex group">
              <span className="flex flex-col items-center hover:bg-stone-500 text-stone-700 dark:text-stone-200 hover:text-stone-100 mt-2 p-2 rounded">
                {item.icon}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
