import { useRouter } from "next/router";
import { Header } from "./Header";
import { LeftNavigation } from "./LeftNavigation";
import { CreatePost, WhoToFollow } from "@/components/home";

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const router = useRouter();

  console.log(router.pathname);

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
    </div>
  );
};
