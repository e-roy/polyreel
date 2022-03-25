import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { GetFollowing, GetFollowers } from ".";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type FollowersButtonProps = {
  ownedBy?: string;
  profileId: string;
  followers?: number;
  following?: number;
};

export const FollowersButton = ({
  ownedBy,
  profileId,
  followers,
  following,
}: FollowersButtonProps) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("followers");

  return (
    <>
      <div
        className="flex bg-transparent cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div
          className="font-semibold py-2"
          onClick={() => setActive("following")}
        >
          following : {following}
        </div>
        <div
          className="font-semibold py-2 ml-4"
          onClick={() => setActive("followers")}
        >
          followers : {followers}
        </div>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 " onClose={setOpen}>
          <div className="absolute inset-0">
            <Dialog.Overlay className="absolute inset-0" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 flex w-screen">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <div className="pointer-events-auto w-screen">
                  <div className="flex h-3/4 flex-col bg-stone-200 py-2 shadow-xl overflow-y-hidden">
                    <div className="px-4 sm:px-6 lg:mx-24 xl:mx-40 2xl:mx-56 border">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium  w-full grid grid-cols-2 text-center"></Dialog.Title>

                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 text-center">
                        <span
                          onClick={() => setActive("following")}
                          className={classNames(
                            active === "following"
                              ? "bg-stone-700 text-stone-100"
                              : "text-gray-600 hover:bg-stone-500 hover:text-stone-100 cursor-pointer",
                            "text-center px-3 py-2 text-sm font-medium rounded-md"
                          )}
                        >
                          following : {following}
                        </span>
                        <span
                          onClick={() => setActive("followers")}
                          className={classNames(
                            active === "followers"
                              ? "bg-stone-700 text-stone-100"
                              : "text-gray-600 hover:bg-stone-500 hover:text-stone-100 cursor-pointer",
                            "text-center px-3 py-2 text-sm font-medium rounded-md"
                          )}
                        >
                          followers : {followers}
                        </span>
                      </div>
                      <div className="h-3/6 sm:h-2/5 overflow-y-scroll">
                        {active === "followers" ? (
                          <GetFollowers profileId={profileId} />
                        ) : (
                          <GetFollowing ownedBy={ownedBy} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
