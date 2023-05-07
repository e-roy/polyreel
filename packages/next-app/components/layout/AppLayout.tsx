import { useRouter } from "next/router";
import { UserContext } from "@/context";
import { Header } from "./Header";
import { LeftNavigation } from "./LeftNavigation";
import { CreatePost, WhoToFollow } from "@/components/home";
import { FaHome, FaBell, FaUserAlt } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { GoGlobe } from "react-icons/go";
import { useContext } from "react";
import Link from "next/link";

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { currentUser, setCurrentUser, profiles, verified, loading } =
    useContext(UserContext);
  const router = useRouter();

  console.log(router.pathname);

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

  // if (router.pathname === "/post/[id]") return null;

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div
        className={`container mx-auto max-w-screen-2xl flex-grow md:px-2 lg:px-5`}
      >
        <div className="grid grid-cols-12 lg:gap-4 xl:gap-8 2xl:gap-12">
          {/* 3 column wrapper */}
          {/* Left Column */}
          <div className="md:col-span-1 xl:col-span-2 hidden md:block">
            <aside className="flex flex-col pt-16 ml-1 w-12 xl:w-64 text-gray-700 h-full">
              <LeftNavigation />
            </aside>
          </div>
          {router.pathname === "/post/[id]" ? (
            <div className="h-9/10 md:h-98 my-1 col-span-12 md:col-span-11 xl:col-span-10 sm:border-r sm:border-l border-stone-300">
              {children}
            </div>
          ) : (
            <>
              {/* Main Column */}
              <div className="w-full md:mx-2 col-span-12 md:col-span-11 lg:col-span-8 xl:col-span-7">
                <div className="h-9/10 md:h-98 my-1 overflow-y-scroll sm:border-r sm:border-l border-stone-300">
                  {children}
                </div>
              </div>

              {/* Right Column */}
              <div className="pt-16 hidden lg:block lg:col-span-3">
                <WhoToFollow />
              </div>
            </>
          )}
        </div>
      </div>
      {/* Mobile Nav */}
      <div className="w-full px-8 mx-auto md:hidden border-t bg-white/60 border-stone-500/50 block absolute h-1/10 inset-x-0 bottom-0 z-10">
        <div className="px-5">
          <div className="flex flex-row justify-between">
            {sidebarNav.map((item: any, index: number) => (
              <Link key={index} href={item.href} className="flex group">
                <div
                  // onClick={() => setSideNav(item.label)}
                  className={`flex hover:bg-stone-500 text-stone-700 hover:text-stone-100 my-1 p-2 rounded cursor-pointer `}
                >
                  <span className="flex flex-col items-center">
                    {item.icon}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
