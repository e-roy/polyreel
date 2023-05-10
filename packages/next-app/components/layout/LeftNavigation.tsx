import { FaHome, FaBell, FaUserAlt } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { GoGlobe } from "react-icons/go";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "@/context";

export const LeftNavigation = () => {
  const { currentUser, verified } = useContext(UserContext);
  const router = useRouter();
  // console.log(router);

  // console.log(currentUser);

  const userNav = [
    {
      id: 1,
      label: "Home",
      icon: <FaHome className="text-3xl h-7 w-7 mx-auto" />,
      active: router.pathname === "/home" ? true : false,
      href: "/home",
    },
    {
      id: 2,
      label: "Explore",
      icon: <GoGlobe className="text-3xl h-7 w-7 mx-auto" />,
      active: router.pathname === "/explore" ? true : false,
      href: "/explore",
    },
    {
      id: 3,
      label: "Notifications",
      icon: <FaBell className="text-3xl h-7 w-7 mx-auto" />,
      active: router.pathname === "/notifications" ? true : false,
      href: "/notifications",
    },
    {
      id: 4,
      label: "Profile",
      icon: <FaUserAlt className="text-3xl h-7 w-7 mx-auto" />,
      active:
        router.asPath === `/profile/${currentUser?.handle}` ? true : false,
      href: `/profile/${currentUser?.handle}`,
    },
    {
      id: 5,
      label: "Settings",
      icon: <FiSettings className="text-3xl h-7 w-7 mx-auto" />,
      active: router.pathname === "/settings" ? true : false,
      href: "/settings",
    },
  ];

  const guestNav = [
    {
      id: 2,
      label: "Explore",
      icon: <GoGlobe className="text-3xl h-7 w-7 mx-auto" />,
      active: router.pathname === "/explore" ? true : false,
      href: "/explore",
    },
    {
      id: 5,
      label: "Settings",
      icon: <FiSettings className="text-3xl h-7 w-7 mx-auto" />,
      active: router.pathname === "/settings" ? true : false,
      href: "/settings",
    },
  ];

  const sidebarNav = currentUser && verified ? userNav : guestNav;
  return (
    <>
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
      </ul>
    </>
  );
};
