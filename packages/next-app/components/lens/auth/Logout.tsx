import { useRouter } from "next/router";
import { LogoutIcon } from "@heroicons/react/outline";
import { useAccount, useDisconnect } from "wagmi";
import { removeAuthenticationToken } from "@/lib/auth/state";

type LogoutProps = {
  className?: string;
};

export const Logout = ({ className }: LogoutProps) => {
  const router = useRouter();

  const { data: accountData } = useAccount();
  const { disconnect } = useDisconnect();

  const handleLogout = async () => {
    if (accountData?.address) {
      disconnect();
      await removeAuthenticationToken();
      router.push("/");
    } else {
      await removeAuthenticationToken();
      router.push("/");
    }
  };
  return (
    <div className={`flex ${className}`} onClick={() => handleLogout()}>
      <LogoutIcon className="mr-4 ml-2 h-8 w-8" />
      <div className="mt-1">logout</div>
    </div>
  );
};
