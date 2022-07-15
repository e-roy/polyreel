import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import Link from "next/link";
import { UserContext } from "@/components/layout";
import { useRouter } from "next/router";
import { Transition, Dialog } from "@headlessui/react";
import { ChevronLeftIcon, PlusIcon, HomeIcon } from "@heroicons/react/solid";
import { Auth, Logout, SwitchNetwork } from "@/components/lens/auth";
import { getAuthenticationToken } from "@/lib/auth/state";

import { useAccount } from "wagmi";
import { useQuery } from "@apollo/client";

import { GET_PROFILES } from "@/queries/profile/get-profiles";
import { VERIFY } from "@/queries/auth/verify";

import { Avatar } from "@/components/elements";
import { UserIcon } from "@heroicons/react/outline";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useCheckNetwork } from "@/hooks/useCheckNetwork";

import { CURRENT_CHAIN_ID } from "@/lib/constants";

export type HeaderProps = {};

export const Header = ({}: HeaderProps) => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const router = useRouter();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [open, setOpen] = useState(false);
  let completeButtonRef = useRef(null);
  const { address, connector } = useAccount();

  // console.log("currentUser", currentUser);
  const correctNetwork = useCheckNetwork();

  useEffect(() => {
    if (connector?.ready) {
      setIsWalletConnected(true);
    }
  }, [connector]);

  const { data: profileData, loading: profileLoading } = useQuery(
    GET_PROFILES,
    {
      variables: {
        request: { ownedBy: address, limit: 10 },
      },
    }
  );
  // console.log(profileData);

  const { data: verifyData, loading: verifyLoading } = useQuery(VERIFY, {
    variables: {
      request: { accessToken: getAuthenticationToken() },
    },
  });
  // console.log(verifyData);
  let isVerified = false;
  // console.log(verifyData);
  if (verifyData?.verify) isVerified = true;

  const handleUserLoggedIn = () => {
    router.push("/home");
  };

  const handleProfileClick = (profile: any) => {
    console.log("profile select", profile);
    setCurrentUser(profile);
  };

  // return null;
  // console.log(router.pathname);

  const baseClass =
    "flex cursor-pointer py-2 px-2 sm:px-6 rounded-lg uppercase text-stone-700 font-semibold hover:bg-sky-200 transition ease-in-out duration-150";

  if (profileLoading || verifyLoading) {
    return (
      <header className="py-2 px-4 mx-4 bg-white h-16 flex justify-between sticky"></header>
    );
  }

  return (
    <header
      className={`p-2 sm:px-8 flex justify-between z-20 sticky top-0 bg-transparent`}
    >
      {router.pathname === "/home" ? (
        <div onClick={() => setOpen(!open)} className="cursor-pointer">
          {address && currentUser ? (
            <div className="flex">
              <Avatar profile={currentUser} size={"small"} />
              <div className="px-4 font-medium">
                <div>@{currentUser?.handle}</div>
                <div>{currentUser?.name}</div>
              </div>
            </div>
          ) : address ? (
            <div className="flex">
              <UserIcon
                className={`inline-block rounded-full h-10 w-10  text-stone-500 p-0.5 bg-white shadow-lg`}
              />
              <div className="px-4 py-2 font-medium">
                <div>Select Profile</div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      ) : (
        <>
          {router.pathname !== "/" ? (
            <>
              <div
                className="cursor-pointer mt-2 bg-stone-700/20 hover:bg-stone-700/40 h-8 w-8 rounded-full"
                onClick={() => router.back()}
              >
                <ChevronLeftIcon className="h-8 w-8 text-stone-100" />
              </div>
              <Link href={"/home"}>
                <div className="cursor-pointer mt-2 relative grid content-center justify-center bg-stone-700/20 hover:bg-stone-700/40 h-8 w-8 rounded-full">
                  <HomeIcon className="h-6 w-6 text-stone-100" />
                </div>
              </Link>
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
                  <div className="flex h-full flex-col overflow-y-hidden bg-white pb-6 shadow">
                    <div
                      className="hover:bg-sky-200 cursor-pointer border-b shadow"
                      onClick={() => {
                        if (currentUser)
                          router.push(`/profile/${currentUser?.handle}`);
                      }}
                    >
                      {currentUser?.coverPicture ? (
                        <div className=" h-40 sm:h-56">
                          {currentUser.coverPicture.__typename ===
                            "MediaSet" && (
                            <img
                              className=" max-h-56 w-full sm:border-2 border-transparent rounded-lg"
                              src={currentUser.coverPicture.original.url}
                              alt=""
                            />
                          )}
                          {currentUser.coverPicture.__typename ===
                            "NftImage" && (
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
                            <Avatar
                              profile={currentUser as any}
                              size={"small"}
                            />
                            <div className="px-4 font-medium">
                              <div>@{currentUser?.handle}</div>
                              <div>{currentUser?.name}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative mx-2 mt-2 flex-1 px-2 sm:px-4 overflow-y-scroll border rounded-xl shadow-xl">
                      <div className="relative grid gap-4 bg-white px-2 py-2 sm:gap-2 sm:p-2">
                        {profileData?.profiles.items.length > 1 && (
                          <div className="border-b border-stone-300 py-2 text-stone-700 text-sm font-medium">
                            Switch profiles
                          </div>
                        )}

                        <div>
                          {profileData?.profiles.items.map(
                            (profile: any, index: number) => (
                              <div key={index}>
                                {profile.id !== currentUser?.id ? (
                                  <div
                                    className={`${baseClass}`}
                                    onClick={() => {
                                      handleProfileClick(profile);
                                      !open;
                                    }}
                                  >
                                    <Avatar profile={profile} size={"small"} />
                                    <div className="px-4 font-medium">
                                      <div>@{profile.handle}</div>
                                      <div>{profile.name}</div>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            )
                          )}
                          <div className="border-b border-stone-300 py-2 text-stone-700 text-sm font-medium"></div>
                          {CURRENT_CHAIN_ID === 80001 && (
                            <div className={`${baseClass}`}>
                              <PlusIcon className="ml-1 mr-4 h-8 w-8" />

                              <div
                                className="mt-1"
                                onClick={() => router.push("/select-profile")}
                              >
                                create new profile
                              </div>
                            </div>
                          )}

                          <Logout className={`${baseClass}`} />
                          <button
                            className="hidden"
                            ref={completeButtonRef}
                          ></button>
                        </div>
                      </div>
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
            <>
              {!isVerified ? (
                <Auth userLoggedIn={handleUserLoggedIn} />
              ) : (
                <>
                  {router.pathname === "/" ? (
                    <div className="flex justify-end">
                      <button
                        className="py-2 px-4 rounded-lg text-md font-bold bg-sky-800 text-white"
                        onClick={() => router.push("./home")}
                      >
                        Home
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </>
          ) : (
            <SwitchNetwork />
          )}
        </>
      )}
    </header>
  );
};
