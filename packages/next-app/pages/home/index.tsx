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

import { SearchIcon, HomeIcon, BellIcon } from "@heroicons/react/outline";

const Home: NextPage = () => {
  const [search, setSearch] = useState("");
  const [sideNav, setSideNav] = useState("home");
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
            <div className="lg:w-16 xl:w-1/4 ">
              <aside className="flex flex-col w-16 bg-white text-gray-700 shadow h-full">
                <div className="h-16 flex items-center w-full"></div>

                <ul className="">
                  <li
                    onClick={() => setSideNav("home")}
                    className="hover:bg-stone-500 text-stone-700 hover:text-stone-100  p-2 rounded cursor-pointer"
                  >
                    <HomeIcon className="text-3xl h-8 w-8 mx-auto" />
                  </li>

                  <li
                    onClick={() => setSideNav("notifications")}
                    className="hover:bg-stone-500 text-stone-700 hover:text-stone-100  p-2 rounded cursor-pointer"
                  >
                    <BellIcon className="text-3xl h-8 w-8 mx-auto" />
                  </li>
                </ul>
              </aside>
              {/* Left Column */}
            </div>

            <div className="w-full mx-2 lg:w-2/3 xl:w-1/2  min-h-9/10">
              <div className="lg:px-8 h-9/10 overflow-y-scroll border border-stone-300 rounded-xl shadow-lg">
                {sideNav === "home" && <ExplorePublications />}
                {sideNav === "notifications" && <Notifications />}
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
            <div className="-mt-12 w-32 ml-8 sm:ml-0">
              <CreatePost />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
