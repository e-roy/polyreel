import { useState, useContext } from "react";
import Link from "next/link";
import { UserContext } from "@/components/layout";
import { Mirror, Collect } from "@/components/post";

import { ChatAlt2Icon } from "@heroicons/react/outline";

import { CommentCard } from "@/components/comment";

type StatsProps = {
  publication: any;
  stats?: {
    totalAmountOfCollects: number;
    totalAmountOfComments: number;
    totalAmountOfMirrors: number;
  };
};

export const Stats = ({ publication }: StatsProps) => {
  const { currentUser } = useContext(UserContext);
  const [showComment, setShowComment] = useState(false);
  const { stats } = publication;

  if (!publication.stats) return null;

  // console.log(publication);

  if (!currentUser)
    return (
      <div className="flex font-medium text-stone-500 mt-4">
        <Link href={`/post/${publication.id}`}>
          <span className="hover:text-stone-700 flex cursor-pointer">
            {stats.totalAmountOfComments}
            <ChatAlt2Icon className="h-6 w-6 ml-2 " aria-hidden="true" />
          </span>
        </Link>
      </div>
    );

  return (
    <>
      <div className="flex font-medium text-stone-500 mt-4">
        <span className="hover:text-stone-700 flex cursor-pointer">
          {stats.totalAmountOfComments}
          <ChatAlt2Icon
            onClick={() => setShowComment(!showComment)}
            className="h-6 w-6 ml-2 "
            aria-hidden="true"
          />
        </span>

        <Mirror publication={publication} />
        {/* <Collect publication={publication} /> */}
      </div>
      {showComment && (
        <CommentCard
          publicationId={publication.id}
          onClose={() => setShowComment(!showComment)}
        />
      )}
    </>
  );
};
