import { useRouter } from "next/router";
import { Header } from "./Header";

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen">
      {router.pathname !== "/select-profile" && <Header />}
      <main className="flex-grow">{children}</main>
    </div>
  );
};
