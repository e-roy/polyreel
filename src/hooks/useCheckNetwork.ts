import { CURRENT_CHAIN_ID } from "@/lib/constants";
// import { useNetwork } from "wagmi";
import { useAccount } from "wagmi";

export const useCheckNetwork = () => {
  // const { chain } = useNetwork();
  const { chain } = useAccount();

  if (chain?.id === CURRENT_CHAIN_ID) return true;
  return false;
};
