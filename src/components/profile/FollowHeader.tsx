"use client";

import { Profile } from "@/types/graphql/generated";
import { usePathname } from "next/navigation";
import { FiChevronLeft } from "react-icons/fi";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface IFollowHeaderProps {
  profile?: Profile;
}

export const FollowHeader = ({ profile }: IFollowHeaderProps) => {
  const pathname = usePathname();

  const pathParts = pathname.split("/");
  const path = pathParts[pathParts.length - 1];

  const activeClass = `font-semibold border-b-4 border-stone-100 border-sky-500`;
  return (
    <div>
      <div className={`px-4 py-4 flex`}>
        <Link href={`/profile/${profile?.handle?.localName}`}>
          <button
            type={`button`}
            className="hover:bg-stone-200 dark:hover:bg-stone-700 h-9 w-9 rounded-full my-auto"
          >
            <FiChevronLeft className="h-8 w-8 dark:text-stone-100" />
          </button>
        </Link>
        <div className={`pl-4`}>
          {/* <div className={`text-lg font-semibold`}>{profile?.name}</div>
          <div className={`text-sm`}>@{profile?.handle}</div> */}
        </div>
      </div>
      <div className={`flex h-12 text-lg w-full`}>
        <Link
          href={`/profile/${profile?.handle?.localName}/followers`}
          className={`w-1/2 hover:bg-stone-100 dark:hover:bg-stone-700 text-center pt-2`}
        >
          <span
            className={cn(`py-2`, {
              [activeClass]: path === "followers",
            })}
          >
            Followers
          </span>
        </Link>
        <Link
          href={`/profile/${profile?.handle?.localName}/following`}
          className={`w-1/2 hover:bg-stone-100 dark:hover:bg-stone-700 text-center pt-2`}
        >
          <span
            className={cn(`py-2`, {
              [activeClass]: path === "following",
            })}
          >
            Following
          </span>
        </Link>
      </div>
    </div>
  );
};
