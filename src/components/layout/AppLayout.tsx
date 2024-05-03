// components/layout/AppLayout.tsx

import { Header } from "./Header";
import { LeftNavigation } from "./LeftNavigation";
import { MobileNav } from "./MobileNav";

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden max-w-screen-2xl mx-auto ">
      <Header />
      <div className="">
        <div className="grid grid-cols-12 gap-0">
          {/* 2 column wrapper */}
          {/* Left Column */}
          <div className="hidden md:col-span-1 xl:col-span-2 md:block">
            <aside className="flex flex-col pt-16 pb-6 ml-1 h-full">
              <LeftNavigation />
            </aside>
          </div>
          {/* Main Column */}
          <div className="w-full col-span-12 md:col-span-11 xl:col-span-10 md:border-l border-stone-300">
            <div className="h-[92dvh] md:h-[100dvh] overflow-y-scroll w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
};
