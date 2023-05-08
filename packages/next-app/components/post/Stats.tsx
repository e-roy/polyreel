import { useState, useContext } from "react";
import Link from "next/link";
import { UserContext } from "@/context";
import { Mirror, Collect, Like } from "@/components/post";

import { BsChat } from "react-icons/bs";

import { CommentCard } from "@/components/comment";

import { Post, PublicationStats } from "@/types/graphql/generated";

type StatsProps = {
  publication: Post;
  stats?: PublicationStats;
};

export const Stats = ({ publication }: StatsProps) => {
  const { currentUser } = useContext(UserContext);
  const [showComment, setShowComment] = useState(false);

  if (!publication) return null;

  const { stats } = publication;

  // if (!publication.stats) return null;

  // console.log(publication);

  if (!currentUser)
    return (
      <div className="flex font-medium text-stone-500 mt-4">
        <Link href={`/post/${publication?.id}`}>
          <span className="hover:text-stone-700 flex cursor-pointer">
            {stats?.totalAmountOfComments}
            <BsChat
              className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-2 "
              aria-hidden="true"
            />
          </span>
        </Link>
      </div>
    );

  return (
    <>
      <div className="flex justify-between text-xs sm:text-sm md:text-base font-medium text-stone-500 mt-4">
        <div className={`flex space-x-4`}>
          <span className="hover:text-stone-700 flex cursor-pointer">
            {stats?.totalAmountOfComments}
            <BsChat
              onClick={() => setShowComment(!showComment)}
              className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-2"
              aria-hidden="true"
            />
          </span>

          <Mirror publication={publication} />
          <Like publication={publication} />
          <Collect publication={publication} />
        </div>
        {publication?.appId && (
          <div className={`text-xs text-stone-500`}>
            posted from: {publication?.appId}
          </div>
        )}
      </div>
      {showComment && (
        <CommentCard
          publicationId={publication?.id}
          onClose={() => setShowComment(!showComment)}
        />
      )}
    </>
  );
};
