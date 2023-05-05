import { UserProvider } from "@/context";
import { useRouter } from "next/router";
import { Header } from "./Header";
import { useIsMounted } from "@/hooks/useIsMounted";

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const router = useRouter();

  const isMounted = useIsMounted();

  if (!isMounted) return null;
  return (
    <UserProvider>
      <div className="flex flex-col h-screen">
        {router.pathname !== "/select-profile" && <Header />}
        <main className="flex-grow">{children}</main>
      </div>
    </UserProvider>
  );
};
