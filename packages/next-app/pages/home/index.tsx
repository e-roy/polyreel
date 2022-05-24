import type { NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import {
  ExplorePublications,
  CreatePost,
  RecommendedProfiles,
  SearchProfiles,
  UserTimeline,
} from "@/components/home";
import { Notifications } from "@/components/user";

import {
  SearchIcon,
  HomeIcon,
  BellIcon,
  GlobeIcon,
} from "@heroicons/react/outline";

const sidebarNav = [
  {
    id: 1,
    label: "Home",
    icon: <HomeIcon className="text-3xl h-8 w-8 mx-auto" />,
  },
  {
    id: 2,
    label: "Explore",
    icon: <GlobeIcon className="text-3xl h-8 w-8 mx-auto" />,
  },
  {
    id: 3,
    label: "Notifications",
    icon: <BellIcon className="text-3xl h-8 w-8 mx-auto" />,
  },
];

const Home: NextPage = () => {
  const [search, setSearch] = useState("");
  const [sideNav, setSideNav] = useState("Explore");
  return (
    <div className="flex flex-col overflow-hidden">
      <Head>
        <title>polyreel</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <div className="flex-1 w-full overflow-y-hidden ">
          {/* 3 column wrapper */}
          <div className="flex xl:px-8 2xl:px-32 h-9/10">
            <div className="lg:w-16 xl:w-1/4 hidden sm:block">
              <aside className="flex flex-col ml-1 w-12 xl:w-64 text-gray-700 shadow h-full">
                <div className="h-16 flex items-center w-full"></div>

                <ul className="">
                  {sidebarNav.map((item: any, index: number) => (
                    <li
                      key={index}
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
                    </li>
                  ))}
                </ul>
              </aside>
              {/* Left Column */}
            </div>

            <div className="w-full mx-2 lg:w-2/3 xl:w-1/2  min-h-9/10">
              <div className="lg:px-8 h-9/10 overflow-y-scroll border border-stone-300 rounded-xl shadow-lg">
                <div className="pb-4 text-center text-stone-700 text-2xl font-bold sticky top-0 bg-white z-10">
                  {sideNav}
                </div>
                {sideNav === "Home" && <UserTimeline />}
                {sideNav === "Explore" && <ExplorePublications />}
                {sideNav === "Notifications" && <Notifications />}
              </div>
            </div>

            <div className="hidden md:block md:w-1/3 xl:w-1/4  xl:pr-0">
              <div className="flex border rounded-xl mx-4 shadow-lg">
                <SearchIcon className="text-3xl text-stone-500 h-6 w-6 my-auto ml-4" />
                <input
                  className="w-full p-2 rounded-xl outline-none"
                  placeholder="Search Profiles"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="overflow-y-scroll h-3/4 px-4 border border-stone-300 rounded-xl mt-4 mx-4 shadow-lg">
                {search ? (
                  <SearchProfiles search={search} />
                ) : (
                  <RecommendedProfiles />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full">
            <div className="hidden sm:block"></div>
            <div className="hidden sm:block"></div>
            <div className="hidden sm:block"></div>
            <div></div>
            <div className="-mt-12 w-32 ml-8 sm:ml-0 z-10">
              <CreatePost />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
