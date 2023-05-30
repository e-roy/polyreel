import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import Link from "next/link";
import { UserContext } from "@/context";
import { useRouter } from "next/router";
import { Transition, Dialog } from "@headlessui/react";
import { FiChevronLeft } from "react-icons/fi";
import { FaHome, FaUserAlt } from "react-icons/fa";

import { Auth, Logout, SwitchNetwork } from "@/components/lens/auth";

import { useAccount } from "wagmi";

import { Avatar } from "@/components/elements";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useCheckNetwork } from "@/hooks/useCheckNetwork";

import { Profile } from "@/types/graphql/generated";

import { LeftNavigation } from "./LeftNavigation";

export type HeaderProps = {};

export const Header = ({}: HeaderProps) => {
  const { currentUser, setCurrentUser, profiles, verified, loading } =
    useContext(UserContext);
  const router = useRouter();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [open, setOpen] = useState(false);
  let completeButtonRef = useRef(null);
  const { address, connector } = useAccount();

  const correctNetwork = useCheckNetwork();

  useEffect(() => {
    if (connector?.ready) {
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
      className={`md:hidden p-2 sm:px-8 flex justify-between z-20 sticky top-0 bg-transparent`}
    >
      {router.pathname === "/home" ||
      router.pathname === "/" ||
      router.pathname === "/explore" ? (
        <div onClick={() => setOpen(!open)} className="cursor-pointer">
          {address && currentUser ? (
            <div className="flex">
              <Avatar profile={currentUser} size={"small"} />
            </div>
          ) : (
            <div className="flex text-black">
              <FaUserAlt
                className={`inline-block rounded-full h-10 w-10  text-stone-500 p-0.5 bg-white shadow-lg`}
              />
            </div>
          )}
        </div>
      ) : (
        <>
          {router.pathname !== "/" && router.pathname !== "/explore" ? (
            <>
              <div
                className="cursor-pointer mt-2 bg-stone-700/20 hover:bg-stone-700/40 h-8 w-8 rounded-full"
                onClick={() => router.back()}
              >
                <FiChevronLeft className="h-8 w-8 text-stone-100" />
              </div>
            </>
          ) : (
            <div></div>
          )}
        </>
      )}

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
                      {currentUser?.coverPicture ? (
                        <div className=" h-40 sm:h-56">
                          {currentUser.coverPicture.__typename ===
                            "MediaSet" && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              className=" max-h-56 w-full sm:border-2 border-transparent rounded-lg"
                              src={currentUser.coverPicture.original.url}
                              alt=""
                            />
                          )}
                          {currentUser.coverPicture.__typename ===
                            "NftImage" && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              className=" max-h-56 w-full sm:border-2 border-transparent rounded-lg"
                              src={currentUser.coverPicture.uri}
                              alt=""
                            />
                          )}
                        </div>
                      ) : (
                        <div className=" bg-gradient-to-r from-sky-600 via-purple-700 to-purple-500 h-40 sm:h-56 max-h-64"></div>
                      )}
                      {currentUser && (
                        <div className="mt-4 px-4 pb-4 sm:flex sm:items-end sm:px-6">
                          <div className="sm:flex-1 flex">
                            <Avatar profile={currentUser} size={"small"} />
                            <div className="px-4 font-medium">
                              <div>@{currentUser?.handle}</div>
                              <div>{currentUser?.name}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={`w-72 m-4`}>
                      <LeftNavigation />
                      {currentUser && verified && <Logout className={``} />}
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {!isWalletConnected ? (
        <ConnectButton />
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
