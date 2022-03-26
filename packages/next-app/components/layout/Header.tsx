import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import { UserContext } from "@/components/layout";
import { useRouter } from "next/router";
import { Transition, Dialog } from "@headlessui/react";
import { ChevronLeftIcon, PlusIcon } from "@heroicons/react/solid";
import { Auth, ConnectWallet, Logout } from "@/components/lens/auth";
import { getAuthenticationToken } from "@/lib/auth/state";

import { useAccount } from "wagmi";
import { useQuery } from "@apollo/client";

import { GET_PROFILES } from "@/queries/profile/get-profiles";
import { VERIFY } from "@/queries/auth/verify";

export type HeaderProps = {};

export const Header = ({}: HeaderProps) => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profileHandle, setProfileHandle] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [open, setOpen] = useState(false);
  let completeButtonRef = useRef(null);
  const [{ data: accountData, loading: accountLoading }] = useAccount();

  // console.log("currentUser", currentUser);

  useEffect(() => {
    if (accountData) {
      setIsWalletConnected(true);
    }
  }, [accountData]);
  // console.log(accountData);

  const { data: profileData, loading: profileLoading } = useQuery(
    GET_PROFILES,
    {
      variables: {
        request: { ownedBy: accountData?.address, limit: 10 },
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

  useEffect(() => {
    setProfileHandle(sessionStorage.getItem("polyreel_profile_handle"));
    setProfilePicture(sessionStorage.getItem("polyreel_profile_picture"));
  }, []);

  const handleUserLoggedIn = () => {
    router.push("/home");
  };

  const handleProfileClick = (profile: any) => {
    setCurrentUser(profile);
  };

  // console.log(router.pathname);

  const baseClass =
    "flex cursor-pointer py-2 px-2 sm:px-6 rounded-lg uppercase text-stone-700 font-semibold hover:bg-sky-200 transition ease-in-out duration-150";

  if (accountLoading || profileLoading || verifyLoading) {
    return (
      <header className="py-2 px-4 mx-4 bg-white h-16 flex justify-between sticky"></header>
    );
  }

  return (
    <header className="py-2 px-4 mx-4 flex justify-between sticky top-0 z-30">
      {router.pathname === "/home" ? (
        <>
          {currentUser?.picture ? (
            <div
              className="h-12 w-12 relative rounded-full border-2 shadow-md cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <img
                src={currentUser?.picture.original.url}
                alt=""
                className="rounded-full"
              />
            </div>
          ) : (
            <div
              className="rounded-full h-12 w-12 bg-gray-300 border-2 shadow-md cursor-pointer"
              onClick={() => setOpen(!open)}
            ></div>
          )}
        </>
      ) : (
        <>
          {router.pathname !== "/" ? (
            <div
              className="cursor-pointer mt-2 bg-stone-700/20 hover:bg-stone-700/40 h-8 w-8 rounded-full"
              onClick={() => router.back()}
            >
              <ChevronLeftIcon className="h-8 w-8 text-stone-100" />
            </div>
          ) : (
            <div></div>
          )}
        </>
      )}

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          initialFocus={completeButtonRef}
          as="div"
          className="fixed inset-0 overflow-hidden dialog z-20"
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
                <div className="pointer-events-auto  max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white pb-6 shadow-xl">
                    <div
                      className="hover:bg-sky-200 cursor-pointer"
                      onClick={() => router.push(`/profile/${profileHandle}`)}
                    >
                      <div className="bg-gradient-to-r from-sky-600 via-purple-700 to-purple-500 h-64 max-h-64 rounded-t shadow-xl"></div>

                      <div className="mt-4 px-4 pb-4 sm:flex sm:items-end sm:px-6">
                        <div className="sm:flex-1 flex">
                          <div className="">
                            <>
                              {currentUser?.picture ? (
                                <div className="h-12 w-12 relative rounded-full border-2 shadow-md">
                                  <img
                                    src={currentUser?.picture.original.url}
                                    alt=""
                                    className="rounded-full"
                                  />
                                </div>
                              ) : (
                                <div className="rounded-full h-12 w-12 bg-gray-300 border-2 shadow-md"></div>
                              )}
                            </>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <h3 className="text-lg font-bold text-stone-900 sm:text-xl">
                                {currentUser?.name}
                              </h3>
                            </div>
                            <p className="text-sm text-stone-500">
                              @{currentUser?.handle}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative mt-4 flex-1 px-2 sm:px-4">
                      <div className="relative grid gap-4 bg-white px-2 py-2 sm:gap-2 sm:p-2">
                        <div className="border-b border-stone-300 py-2 text-stone-700 text-sm font-medium">
                          Switch profiles
                        </div>
                        {profileData?.profiles.items.map(
                          (profile: any, index: number) => (
                            <div
                              key={index}
                              className={`${baseClass}`}
                              onClick={() => {
                                handleProfileClick(profile);
                                !open;
                              }}
                            >
                              {profile.picture ? (
                                <div className="h-10 w-10 border-2 rounded-full">
                                  <img
                                    src={profile.picture.original.url}
                                    alt={profile.handle}
                                    className="rounded-full"
                                  />
                                </div>
                              ) : (
                                <div className="bg-slate-300 rounded-full h-10 w-10 border-2"></div>
                              )}
                              <div className="mt-2 px-4">{profile.handle}</div>
                            </div>
                          )
                        )}
                        <div className="border-b border-stone-300 py-2 text-stone-700 text-sm font-medium">
                          {/* Switch profiles */}
                        </div>
                        <div className={`${baseClass}`}>
                          <PlusIcon className="ml-1 mr-4 h-8 w-8" />

                          <div
                            className="mt-1"
                            onClick={() => router.push("/select-profile")}
                          >
                            create new profile
                          </div>
                        </div>

                        <Logout className={`${baseClass}`} />
                        <button
                          className="hidden"
                          ref={completeButtonRef}
                        ></button>
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
        <ConnectWallet />
      ) : (
        <>{!isVerified ? <Auth userLoggedIn={handleUserLoggedIn} /> : null}</>
      )}
    </header>
  );
};
