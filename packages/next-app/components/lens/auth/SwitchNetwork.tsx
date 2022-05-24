import { useState } from "react";
import { CURRENT_CHAIN_ID, CURRENT_CHAIN_NAME } from "@/lib/constants";
import { useNetwork } from "wagmi";
import { Modal } from "@/components/elements";
import { XIcon, ChevronDownIcon } from "@heroicons/react/outline";

export const SwitchNetwork = () => {
  const { switchNetwork } = useNetwork();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex my-auto py-2 px-4 rounded-xl text-md font-bold bg-red-500 text-white"
      >
        Wrong Network{" "}
        <ChevronDownIcon className="h-5 w-5 my-auto ml-2 font-extrabold" />
      </button>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="bg-white p-4">
            <div className="flex justify-between">
              <div className="text-stone-800 font-bold text-xl">
                Switch Networks
              </div>
              <button className="bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-full p-1">
                <XIcon
                  onClick={() => setIsModalOpen(false)}
                  className="h-5 w-5 my-auto"
                />
              </button>
            </div>
            <div className="my-4">
              <button
                onClick={() => switchNetwork?.(CURRENT_CHAIN_ID)}
                className="font-bold text-stone-700 hover:bg-stone-200 w-full p-2 rounded-xl"
              >
                {CURRENT_CHAIN_NAME}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
