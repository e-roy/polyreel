import { useState } from "react";
import { CURRENT_CHAIN_ID, CURRENT_CHAIN_NAME } from "@/lib/constants";
import { useSwitchNetwork } from "wagmi";
import { Modal } from "@/components/elements";
import { FiChevronDown } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

import Image from "next/image";
import polygonLogo from "@/images/polygon.png";

export const SwitchNetwork = () => {
  const { switchNetwork } = useSwitchNetwork();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex my-auto py-2 px-4 rounded-xl text-md font-bold bg-red-500 text-white"
      >
        Wrong Network{" "}
        <FiChevronDown className="h-5 w-5 my-auto ml-2 font-extrabold" />
      </button>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="bg-white p-4 rounded-3xl">
            <div className="flex justify-between">
              <div className="text-stone-800 font-bold text-xl pl-3">
                Switch Networks
              </div>
              <button className="bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-full p-1">
                <IoClose
                  onClick={() => setIsModalOpen(false)}
                  className="h-5 w-5 my-auto"
                />
              </button>
            </div>
            <div className="my-4">
              <button
                onClick={() => switchNetwork?.(CURRENT_CHAIN_ID)}
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
          </div>
        </Modal>
      )}
    </>
  );
};
