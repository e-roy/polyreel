import { useState, useContext } from "react";
import Link from "next/link";
import { UserContext } from "@/components/layout";
import { Mirror, Collect, Like } from "@/components/post";

import { ChatAlt2Icon } from "@heroicons/react/outline";

import { CommentCard } from "@/components/comment";

import { Publication, PublicationStats } from "@/types/graphql/generated";

type StatsProps = {
  publication: Publication;
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
            <ChatAlt2Icon className="h-6 w-6 ml-2 " aria-hidden="true" />
          </span>
        </Link>
      </div>
    );

  return (
    <>
      <div className="flex justify-between text-xs sm:text-sm md:text-base font-medium text-stone-500 mt-4">
        <div className={`flex`}>
          <span className="hover:text-stone-700 flex cursor-pointer">
            {stats?.totalAmountOfComments}
            <ChatAlt2Icon
              onClick={() => setShowComment(!showComment)}
              className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ml-2 "
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
