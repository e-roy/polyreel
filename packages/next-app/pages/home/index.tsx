import type { NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import { useAccount } from "wagmi";
import {
  ExplorePublications,
  CreatePost,
  UserTimeline,
  WhoToFollow,
} from "@/components/home";
import { Notifications } from "@/components/user";

import { HomeIcon, BellIcon, GlobeIcon } from "@heroicons/react/outline";

const Home: NextPage = () => {
  const { address } = useAccount();
  const [sideNav, setSideNav] = useState("Explore");

  const sidebarNav = [
    {
      id: 1,
      label: "Home",
      icon: <HomeIcon className="text-3xl h-8 w-8 mx-auto" />,
      active: address ? true : false,
    },
    {
      id: 2,
      label: "Explore",
      icon: <GlobeIcon className="text-3xl h-8 w-8 mx-auto" />,
      active: true,
    },
    {
      id: 3,
      label: "Notifications",
      icon: <BellIcon className="text-3xl h-8 w-8 mx-auto" />,
      active: address ? true : false,
    },
  ];

  return (
    <div className="">
      <Head>
        <title>polyreel</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex-1 w-full overflow-y-hidden">
        {/* 3 column wrapper */}
        <div className="flex xl:px-8 2xl:px-32 h-9/10">
          {/* Left Column */}
          <div className="lg:w-16 xl:w-1/4 hidden md:block">
            <aside className="flex flex-col ml-1 w-12 xl:w-64 text-gray-700 h-full">
              <ul className="mt-16">
                {sidebarNav.map((item: any, index: number) => (
                  <li key={index}>
                    {item.active && (
                      <div
                        onClick={() => setSideNav(item.label)}
                        className={`flex hover:bg-stone-500 text-stone-700 hover:text-stone-100 my-1 p-2 rounded cursor-pointer ${
                          sideNav === item.label
                            ? "bg-stone-500 text-stone-100"
                            : ""
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span className="pl-2 my-auto font-semibold hidden xl:block">
                          {item.label}
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          {/* Main Column */}
          <div className="w-full sm:mx-2 lg:w-2/3 xl:w-1/2">
            <div className="lg:px-8 h-8/10 md:h-9/10 overflow-y-scroll sm:border border-stone-300 rounded-xl shadow-lg">
              {sideNav === "Home" && <UserTimeline />}
              {sideNav === "Explore" && <ExplorePublications />}
              {sideNav === "Notifications" && <Notifications />}
            </div>
          </div>

          {/* Right Column */}
          <div className="hidden md:block md:w-1/3 xl:w-1/4 ">
            <WhoToFollow />
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 w-full">
          <div className="hidden sm:block"></div>
          <div className="hidden sm:block"></div>
          <div className=""></div>
          <div></div>
          <div className="-mt-28 md:-mt-12 mr-4 w-28 z-10">
            <CreatePost />
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="w-full px-8 mx-auto md:hidden border-t border-stone-500/50 block absolute h-1/10 inset-x-0 bottom-0 z-10">
          <div className="px-5">
            <div className="flex flex-row justify-between">
              {sidebarNav.map((item: any, index: number) => (
                <div key={index} className="flex group">
                  <div
                    onClick={() => setSideNav(item.label)}
                    className={`flex hover:bg-stone-500 text-stone-700 hover:text-stone-100 my-1 p-2 rounded cursor-pointer ${
                      sideNav === item.label
                        ? "bg-stone-500 text-stone-100"
                        : ""
                    }`}
                  >
                    <span className="flex flex-col items-center">
                      {item.icon}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
