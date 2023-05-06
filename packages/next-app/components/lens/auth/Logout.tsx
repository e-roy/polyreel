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
      className={`flex ${className}`}
      onClick={handleLogout}
    >
      <FiLogOut className="mr-4 ml-2 h-8 w-8" />
      <div className="mt-1">logout</div>
    </button>
  );
};
