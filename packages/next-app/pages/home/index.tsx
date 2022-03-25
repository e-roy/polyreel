import type { NextPage } from "next";
import Head from "next/head";
import { Header } from "@/components/layout";
import {
  ExplorePublications,
  CreatePost,
  RecommendedProfiles,
  UserTimeline,
} from "@/components/home";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Head>
        <title>polyreel</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex-1 w-full overflow-y-hidden ">
        {/* 3 column wrapper */}
        <div className="flex xl:px-8 2xl:px-32 h-9/10">
          <div className="w-0 xl:w-1/4 xl:border-r xl:border-gray-200">
            {/* Left Column */}
          </div>

          <div className="w-full lg:w-2/3 xl:w-1/2  min-h-9/10">
            <div className="lg:px-8 h-9/10 overflow-y-scroll">
              <ExplorePublications />
              {/* <UserTimeline /> */}
            </div>
          </div>

          <div className="hidden md:block md:w-1/3 xl:w-1/4  lg:border-l lg:border-gray-200 xl:pr-0">
            <div className="overflow-y-scroll h-3/4 px-4">
              <RecommendedProfiles />
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
      </main>
    </div>
  );
};

export default Home;
