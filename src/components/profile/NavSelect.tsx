"use client";

import { BiPhotoAlbum, BiChat } from "react-icons/bi";
import { FaRegCopy } from "react-icons/fa";
import { MdDynamicFeed } from "react-icons/md";
import { Profile } from "@/types/graphql/generated";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type NavSelectProps = {
  select: (select: string) => void;
  profile: Profile;
  navSelect: string;
};

export const NavSelect = ({ select, profile, navSelect }: NavSelectProps) => {
  // console.log("profile", profile);
  return (
    <div className="flex justify-center">
      <div
        onClick={() => select("POST")}
        className={classNames(
          navSelect === "POST"
            ? "bg-stone-700 text-stone-100"
            : "text-gray-600 hover:bg-stone-500 hover:text-stone-100 cursor-pointer",
          "flex justify-center py-2 pl-6 pr-4 text-sm font-medium rounded-sm w-1/2 border rounded-l-2xl border-stone-400 shadow-lg"
        )}
      >
        <MdDynamicFeed className="h-5 w-5" aria-hidden="true" />
        <span className="pl-1 font-semibold">{profile.stats.totalPosts}</span>
      </div>
      <div
        onClick={() => select("COMMENT")}
        className={classNames(
          navSelect === "COMMENT"
            ? "bg-stone-700 text-stone-100"
            : "text-gray-600 hover:bg-stone-500 hover:text-stone-100 cursor-pointer",
          "flex justify-center py-2 px-4 text-sm font-medium rounded-sm w-1/2 border border-stone-400 shadow-lg"
        )}
      >
        <BiChat className="h-5 w-5" aria-hidden="true" />
        <span className="pl-1 font-semibold">
          {profile.stats.totalComments}
        </span>
      </div>
      {/* <div
        onClick={() => select("COLLECT")}
        className="flex py-2 px-4 border border-stone-400 text-stone-700 hover:bg-stone-400 cursor-pointer"
      >
        <CollectionIcon className="h-6 w-6" aria-hidden="true" />
        <span className="pl-1 font-semibold">
          {profile.stats.totalCollects}
        </span>
      </div> */}
      <div
        onClick={() => select("MIRROR")}
        className={classNames(
          navSelect === "MIRROR"
            ? "bg-stone-700 text-stone-100"
            : "text-gray-600 hover:bg-stone-500 hover:text-stone-100 cursor-pointer",
          "flex justify-center py-2 px-4 text-sm font-medium rounded-sm w-1/2 border border-stone-400 shadow-lg"
        )}
      >
        <FaRegCopy className="h-5 w-5" aria-hidden="true" />
        <span className="pl-1 font-semibold">{profile.stats.totalMirrors}</span>
      </div>
      <div
        onClick={() => select("NFTS")}
        className={classNames(
          navSelect === "NFTS"
            ? "bg-stone-700 text-stone-100"
            : "text-gray-600 hover:bg-stone-500 hover:text-stone-100 cursor-pointer",
          "flex justify-center py-2 pl-4 pr-6 text-sm font-medium rounded-sm w-1/2 border rounded-r-full border-stone-400 shadow-lg"
        )}
      >
        <BiPhotoAlbum className="h-5 w-5" aria-hidden="true" />
        <span className="pl-1 font-semibold">
          {/* {profile.stats.totalMirrors} */}
        </span>
      </div>
    </div>
  );
};
