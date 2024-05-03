"use client";
// components/layout/Header.tsx

import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import { UserContext } from "@/context/UserContext/UserContext";
import { useRouter } from "next/navigation";
import { Transition, Dialog } from "@headlessui/react";

import { Auth } from "@/components/auth/Auth";
import { Logout } from "@/components/auth/Logout";
import { SwitchNetwork } from "@/components/auth/SwitchNetwork";

import { useAccount } from "wagmi";

import { Avatar } from "@/components/elements/Avatar";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useCheckNetwork } from "@/hooks/useCheckNetwork";

import { LeftNavigation } from "./LeftNavigation";
import { checkIpfsUrl } from "@/utils/check-ipfs-url";

export type HeaderProps = {};

export const Header = ({}: HeaderProps) => {
  const { currentUser, verified, loading } = useContext(UserContext);
  const router = useRouter();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [open, setOpen] = useState(false);
  let completeButtonRef = useRef(null);
  const { connector } = useAccount();

  const correctNetwork = useCheckNetwork();

  useEffect(() => {
    if (connector?.onConnect) {
      setIsWalletConnected(true);
    }
  }, [connector]);

  const handleUserLoggedIn = () => {
    router.push("/home");
  };

  if (loading) {
    return (
      <header className="py-2 px-4 mx-4 bg-white h-16 flex justify-between sticky"></header>
    );
  }

  return (
    <header
      className={`md:hidden sm:px-8 flex justify-between z-20 sticky top-0 bg-transparent`}
    >
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          initialFocus={completeButtonRef}
          as="div"
          className="fixed inset-0 overflow-hidden dialog z-50"
          onClose={setOpen}
        >
          <div className="absolute inset-0 overflow-hidden transistion">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full ">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <div className="pointer-events-auto max-w-md">
                  <div className="flex h-full flex-col overflow-y-hidden bg-white dark:bg-stone-900 pb-6 shadow">
                    <div className="border-b shadow">
                      {currentUser?.metadata?.coverPicture?.optimized &&
                      currentUser?.metadata?.coverPicture?.optimized.uri ? (
                        <div
                          className="h-52 sm:h-80"
                          style={{
                            backgroundImage: currentUser?.metadata?.coverPicture
                              ?.optimized?.uri
                              ? `url(${checkIpfsUrl(
                                  currentUser.metadata?.coverPicture.optimized
                                    .uri
                                )})`
                              : "none",
                            backgroundColor: "#94a3b8",
                            backgroundSize: currentUser?.metadata?.coverPicture
                              ?.optimized?.uri
                              ? "cover"
                              : "30%",
                            backgroundPosition: "center center",
                            backgroundRepeat: currentUser?.metadata
                              ?.coverPicture?.optimized?.uri
                              ? "no-repeat"
                              : "repeat",
                          }}
                        />
                      ) : (
                        <div
                          className={`bg-gradient-to-r from-sky-600 via-purple-700 to-purple-500 h-56 rounded-t shadow-xl`}
                        ></div>
                      )}

                      {currentUser && (
                        <div className="mt-4 px-4 pb-4 sm:flex sm:items-end sm:px-6">
                          <div className="sm:flex-1 flex">
                            <Avatar profile={currentUser} size={"small"} />
                            <div className="px-4 font-medium">
                              <div>@{currentUser?.handle?.localName}</div>
                              <div>{currentUser?.metadata?.displayName}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={`w-72 m-4`}>
                      <LeftNavigation />
                      {currentUser && verified && <Logout />}
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {!isWalletConnected ? (
        <ConnectButton showBalance={false} />
      ) : (
        <>
          {correctNetwork ? (
            <>{!verified && <Auth userLoggedIn={handleUserLoggedIn} />}</>
          ) : (
            <SwitchNetwork />
          )}
        </>
      )}
    </header>
  );
};
