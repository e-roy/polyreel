import React, { useEffect, useState } from "react";
import { Modal, Button } from "@/components/elements";
import { useConnect, useAccount } from "wagmi";

import metamaskLogo from "@/images/metamask-logo.png";
import walletConnectLogo from "@/images/walletconnect-logo.png";

export const ConnectWallet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [
    {
      data: { connector, connectors },
      loading,
    },
    connect,
  ] = useConnect();

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>Connect Wallet</Button>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
        >
          <div className="bg-white">
            {connectors.map((x) => (
              <button
                className={"hover:bg-gray-100 text-gray-700 p-4 w-full rounded"}
                disabled={!x.ready}
                key={x.name}
                onClick={() => {
                  connect(x);
                  setIsModalOpen(false);
                }}
              >
                <div>
                  {x.name === "MetaMask" && (
                    <img
                      src={metamaskLogo.src}
                      width={50}
                      height={50}
                      alt="MetaMask"
                      className="mx-auto"
                    />
                  )}
                  {x.name === "WalletConnect" && (
                    <img
                      src={walletConnectLogo.src}
                      width={50}
                      height={50}
                      alt="Wallet Connect"
                      className="mx-auto"
                    />
                  )}
                </div>
                <div className={"text-gray-900 text-3xl font-bold my-4"}>
                  {x.name}
                </div>
                <div className={"text-gray-400 font-regular text-xl my-4"}>
                  {x.name === "MetaMask" && "Connect to your MetaMask Wallet"}
                  {x.name === "WalletConnect" &&
                    "Scan with WalletConnect to connect"}
                </div>
                <div>
                  {!x.ready && " (unsupported)"}
                  {loading && x.name === connector?.name && "…"}
                </div>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};