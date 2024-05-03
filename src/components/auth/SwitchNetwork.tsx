"use client";
import { CURRENT_CHAIN_ID, CURRENT_CHAIN_NAME } from "@/lib/constants";
import { useSwitchChain } from "wagmi";
import { Network } from "lucide-react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import Image from "next/image";
import polygonLogo from "@/images/polygon.png";
import { Button } from "../ui/button";

export const SwitchNetwork = () => {
  const { switchChain } = useSwitchChain();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type={`button`}
          variant={`ghost`}
          className="flex my-auto py-2 px-4 rounded-xl text-md font-bold bg-red-500 text-white"
        >
          <Network />
          <span className={`hidden xl:block pl-4`}>Wrong Network</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white p-4 rounded-3xl">
        <div className="flex justify-between">
          <div className="text-stone-800 font-bold text-xl pl-3">
            Switch Networks
          </div>
        </div>
        <div className="my-4">
          <button
            onClick={() => switchChain({ chainId: CURRENT_CHAIN_ID })}
            className="font-bold text-stone-700 hover:bg-stone-200 w-full p-2 rounded-xl flex"
          >
            <Image
              src={polygonLogo}
              alt="Polygon"
              className=""
              width={28}
              height={28}
            />
            <span className="pl-4">{CURRENT_CHAIN_NAME}</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
