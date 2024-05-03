import { CURRENT_CHAIN_ID } from "@/lib/constants";
import { useAccount } from "wagmi";

export const useCheckNetwork = () => {
  const { chain } = useAccount();

  if (chain?.id === CURRENT_CHAIN_ID) return true;
  return false;
};
