import { CURRENT_CHAIN_ID } from "@/lib/constants";
import { useNetwork } from "wagmi";

export const useCheckNetwork = () => {
  const { chain } = useNetwork();

  if (chain?.id === CURRENT_CHAIN_ID) return true;
  return false;
};
