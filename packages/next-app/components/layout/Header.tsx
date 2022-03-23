import React, { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/solid";
import { Auth, ConnectWallet, Logout } from "@/components/lens/auth";
import Link from "next/link";
import { getAuthenticationToken } from "@/lib/auth/state";

import { useAccount } from "wagmi";
import { useQuery } from "@apollo/client";

import { GET_PROFILES } from "@/queries/profile/get-profiles";
import { VERIFY } from "@/queries/auth/verify";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export type HeaderProps = {};

export const Header = ({}: HeaderProps) => {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profileHandle, setProfileHandle] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [{ data: accountData, loading: accountLoading }] = useAccount();

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

  const { data: verifyData, loading: verifyLoading } = useQuery(VERIFY, {
    variables: {
      request: { accessToken: getAuthenticationToken() },
    },
  });
  // console.log(verifyData);
  let isVerified = false;
  if (verifyData?.verify) isVerified = true;

  useEffect(() => {
    setProfileHandle(sessionStorage.getItem("polyreel_profile_handle"));
    setProfilePicture(sessionStorage.getItem("polyreel_profile_picture"));
  }, []);

  const handleUserLoggedIn = () => {
    router.push("/home");
  };

  const handleProfileClick = (profile: any) => {
    if (profile.picture)
      sessionStorage.setItem(
        "polyreel_profile_picture",
        profile.picture.original.url
      );
    else sessionStorage.setItem("polyreel_profile_picture", "");
    sessionStorage.setItem("polyreel_profile_handle", profile.handle);
    if (profile.picture) setProfilePicture(profile.picture.original.url);
    else setProfilePicture(null);
    setProfileHandle(profile.handle);
  };

  const baseClass =
    "flex cursor-pointer py-2 px-6 rounded-lg uppercase text-stone-700 font-semibold hover:bg-sky-200 transition ease-in-out duration-150";

  if (accountLoading || profileLoading || verifyLoading) {
    return (
      <header className="py-2 px-4 mx-4 bg-blue-200 h-16 flex justify-between sticky"></header>
    );
  }

  return (
    <header className="py-2 px-4 mx-4 bg-blue-200 h-16 flex justify-between sticky">
      <Link href={`/me/${profileHandle}`}>
        {profilePicture ? (
          <div className="h-12 w-12 relative rounded-full border-2 shadow-xl cursor-pointer">
            <img src={profilePicture} alt="" className="rounded-full" />
          </div>
        ) : (
          <div className="rounded-full h-12 w-12 bg-gray-300 border-2 cursor-pointer"></div>
        )}
      </Link>

      {!isWalletConnected ? (
        <ConnectWallet />
      ) : (
        <>
          {!isVerified ? (
            <Auth userLoggedIn={handleUserLoggedIn} />
          ) : (
            <Popover className="relative mt-2">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={classNames(
                      open ? "text-gray-900" : "text-gray-500",
                      "group rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none"
                    )}
                  >
                    <div className="flex">
                      <div className="px-4"> {profileHandle}</div>
                    </div>

                    <ChevronDownIcon
                      className={classNames(
                        open ? "text-gray-600" : "text-gray-400",
                        "ml-2 h-5 w-5 group-hover:text-gray-500"
                      )}
                      aria-hidden="true"
                    />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute z-10 -left-1/4 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-xs sm:px-0">
                      <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                        <div className="relative grid gap-6 bg-white px-2 py-4 sm:gap-2 sm:p-2">
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
                                <div className="mt-2 px-4">
                                  {profile.handle}
                                </div>
                              </div>
                            )
                          )}

                          <div className={`${baseClass}`}>
                            <PlusIcon className="ml-1 mr-4 h-8 w-8" />

                            <div
                              className="mt-1"
                              onClick={() => router.push("/create-profile")}
                            >
                              create new profile
                            </div>
                          </div>

                          <Logout className={`${baseClass}`} />
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          )}
        </>
      )}
    </header>
  );
};
