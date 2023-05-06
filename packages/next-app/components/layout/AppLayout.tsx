import { useRouter } from "next/router";
import { Header } from "./Header";
import { LeftNavigation } from "./LeftNavigation";
import { CreatePost, WhoToFollow } from "@/components/home";

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen">
      {router.pathname !== "/select-profile" && <Header />}
      {/* <main className="flex-grow">{children}</main> */}

      <main className="flex-grow">
        <div className="flex-1 w-full overflow-y-hidden">
          {/* 3 column wrapper */}
          <div className="flex xl:px-8 2xl:px-32 h-9/10">
            {/* Left Column */}
            <div className="lg:w-16 xl:w-1/4 hidden md:block">
              <aside className="flex flex-col ml-1 w-12 xl:w-64 text-gray-700 h-full">
                <LeftNavigation />
              </aside>
            </div>

            {/* Main Column */}
            <div className="w-full sm:mx-2 lg:w-2/3 xl:w-1/2">
              <div className="h-8/10 md:h-9/10 overflow-y-scroll sm:border-r sm:border-l border-stone-300 shadow-lg">
                {children}
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
                {/* {sidebarNav.map((item: any, index: number) => (
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
                ))} */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
