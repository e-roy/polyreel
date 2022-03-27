import { useState } from "react";
import { GetFollowing, GetFollowers } from ".";
import { Modal } from "@/components/elements";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [active, setActive] = useState("followers");

  return (
    <>
      <div
        className="flex bg-transparent cursor-pointer"
        onClick={() => setIsModalOpen(!isModalOpen)}
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

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
        >
          <div className="p-4 bg-white h-3/4 max-h-3/4">
            <div className="grid grid-cols-2 text-center">
              <button
                onClick={() => setActive("following")}
                className={classNames(
                  active === "following"
                    ? "bg-stone-700 text-stone-100"
                    : "text-gray-600 hover:bg-stone-500 hover:text-stone-100 cursor-pointer",
                  "text-center px-3 py-2 text-sm font-medium rounded-md"
                )}
              >
                following : {following}
              </button>
              <button
                onClick={() => setActive("followers")}
                className={classNames(
                  active === "followers"
                    ? "bg-stone-700 text-stone-100"
                    : "text-gray-600 hover:bg-stone-500 hover:text-stone-100 cursor-pointer",
                  "text-center px-3 py-2 text-sm font-medium rounded-md"
                )}
              >
                followers : {followers}
              </button>
            </div>
            <div className="overflow-y-scroll">
              <div className="h-full ">
                {active === "followers" ? (
                  <GetFollowers profileId={profileId} />
                ) : (
                  <GetFollowing ownedBy={ownedBy} />
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
