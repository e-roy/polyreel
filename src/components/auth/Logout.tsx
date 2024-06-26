"use client";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { useAccount, useDisconnect } from "wagmi";
import { removeAuthenticationToken } from "@/lib/auth/state";
import { useCallback, useContext } from "react";
import { UserContext } from "@/context/UserContext/UserContext";

export const Logout = () => {
  const { refetchVerify } = useContext(UserContext);

  const router = useRouter();

  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const handleLogout = useCallback(async () => {
    if (address) {
      disconnect();
      await removeAuthenticationToken();
      refetchVerify();
      router.push("/");
    } else {
      await removeAuthenticationToken();
      refetchVerify();
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, disconnect, router]);

  return (
    <button
      type={`button`}
      className={`flex w-full hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full text-stone-500 dark:text-stone-300 hover:text-stone-800 my-2 p-2`}
      onClick={handleLogout}
    >
      <FiLogOut className="text-3xl h-7 w-7" />
      <div className="pl-2 my-auto">Logout</div>
    </button>
  );
};
