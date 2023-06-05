"use client";
// components/profile/NavSelect.tsx

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

type NavItemProps = {
  isSelected: boolean;
  onClick: () => void;
  Icon: React.ComponentType<React.SVGAttributes<SVGElement>>;
  count: number;
};

const NavItem: React.FC<NavItemProps> = ({
  isSelected,
  onClick,
  Icon,
  count,
}) => {
  const baseClasses =
    "flex justify-center py-2 px-4 text-sm font-medium w-1/2 border border-stone-400 shadow-lg";
  const selectedClasses = isSelected
    ? "bg-stone-700 text-stone-100"
    : "text-stone-600 dark:text-stone-400 hover:bg-stone-500 hover:text-stone-100 cursor-pointer";

  return (
    <div onClick={onClick} className={classNames(baseClasses, selectedClasses)}>
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span className="pl-1 font-semibold">{count}</span>
    </div>
  );
};

export const NavSelect = ({ select, profile, navSelect }: NavSelectProps) => {
  return (
    <div className="flex justify-center">
      <NavItem
        isSelected={navSelect === "POST"}
        onClick={() => select("POST")}
        Icon={MdDynamicFeed}
        count={profile.stats.totalPosts}
      />
      <NavItem
        isSelected={navSelect === "COMMENT"}
        onClick={() => select("COMMENT")}
        Icon={BiChat}
        count={profile.stats.totalComments}
      />
      <NavItem
        isSelected={navSelect === "MIRROR"}
        onClick={() => select("MIRROR")}
        Icon={FaRegCopy}
        count={profile.stats.totalMirrors}
      />
      <NavItem
        isSelected={navSelect === "NFTS"}
        onClick={() => select("NFTS")}
        Icon={BiPhotoAlbum}
        count={0} // Replace with the proper value for NFTs count
      />
    </div>
  );
};
