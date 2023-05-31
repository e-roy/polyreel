"use client";

import { useContext } from "react";
import Link from "next/link";
import { UserContext } from "@/context";
import { Mirror, Collect, Like } from "@/components/post";

import { BsChat } from "react-icons/bs";

import { CommentModal } from "@/components/post/CommentModal";

import { Post, PublicationStats } from "@/types/graphql/generated";

type StatsProps = {
  publication: Post;
  stats?: PublicationStats;
};

export const Stats = ({ publication }: StatsProps) => {
  const { currentUser } = useContext(UserContext);

  if (!publication) return null;

  const { stats } = publication;

  // if (!publication.stats) return null;

  // console.log(publication);

  if (!currentUser)
    return (
      <div className="flex font-medium text-stone-500 mt-4 mx-2 sm:mx-4">
        <Link href={`/post/${publication?.id}`}>
          <span className="flex ml-4 my-auto font-medium text-stone-600 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
            {stats?.totalAmountOfComments}
            <BsChat
              className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-2 cursor-pointer"
              aria-hidden="true"
            />
          </span>
        </Link>
      </div>
    );

  return (
    <>
      <div className="flex justify-between text-xs sm:text-sm md:text-base font-medium text-stone-500 mt-4 mx-2 sm:mx-4">
        <div className={`flex space-x-4`}>
          <CommentModal publication={publication} />
          <Mirror publication={publication} />
          <Like publication={publication} />
          <Collect publication={publication} />
        </div>
        {publication?.appId && (
          <div className={`text-xs text-stone-500`}>
            posted on: {publication?.appId}
          </div>
        )}
      </div>
    </>
  );
};
