import { useRouter } from "next/router";
import { FiLogOut } from "react-icons/fi";
import { useAccount, useDisconnect } from "wagmi";
import { removeAuthenticationToken } from "@/lib/auth/state";
import { useCallback } from "react";

type LogoutProps = {
  className?: string;
};

export const Logout = ({ className }: LogoutProps) => {
  const router = useRouter();

  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const handleLogout = useCallback(async () => {
    if (address) {
      disconnect();
      await removeAuthenticationToken();
      router.push("/");
    } else {
      await removeAuthenticationToken();
      router.push("/");
    }
  }, [address, disconnect, router]);

  return (
    <button
      type={`button`}
      className={`flex hover:bg-stone-100 rounded-full text-stone-500 hover:text-stone-800 my-2 p-2 pr-48`}
      onClick={handleLogout}
    >
      <FiLogOut className="text-3xl h-8 w-8 mx-auto" />
      <div className="pl-2 my-auto block md:hidden xl:block">Logout</div>
    </button>
  );
};
