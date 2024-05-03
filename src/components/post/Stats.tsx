"use client";
// components/post/Stats.tsx

import { useContext } from "react";
import Link from "next/link";
import { UserContext } from "@/context/UserContext/UserContext";
import { Mirror } from "@/components/post/Mirror";
import { Like } from "@/components/post/Like";

import { BsChat } from "react-icons/bs";

import { CommentModal } from "@/components/post/CommentModal";

import { Post } from "@/types/graphql/generated";

interface IStatsProps {
  publication?: Post;
}

const StatsContent = ({ publication }: IStatsProps) => {
  if (!publication) return null;
  const { stats } = publication;

  return (
    <div className="flex font-medium text-stone-500 mt-4 mx-2 sm:mx-4">
      <Link href={`/post/${publication?.id}`}>
        <span className="flex ml-4 my-auto font-medium text-stone-600 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
          {stats?.comments}
          <BsChat
            className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-2 cursor-pointer"
            aria-hidden="true"
          />
        </span>
      </Link>
    </div>
  );
};

export const Stats = ({ publication }: IStatsProps) => {
  const { currentUser } = useContext(UserContext);

  if (!publication) return null;

  if (!currentUser) return <StatsContent publication={publication} />;

  return (
    <div className="flex justify-between text-xs sm:text-sm md:text-base font-medium text-stone-500 mt-4 mx-2 sm:mx-4">
      <div className="flex space-x-4">
        <CommentModal publication={publication} />
        <Mirror publication={publication} />
        <Like publication={publication} />
      </div>
      {publication.metadata?.appId && (
        <div className="text-xs text-stone-500">
          posted on: {publication.metadata?.appId}
        </div>
      )}
    </div>
  );
};
