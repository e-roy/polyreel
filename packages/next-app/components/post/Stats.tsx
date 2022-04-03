import { useState } from "react";
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
  const [showComment, setShowComment] = useState(false);
  const { stats } = publication;
  if (!publication.stats) return null;

  return (
    <>
      <div
        className="flex text-stone-700 mt-4 cursor-pointer"
        onClick={() => setShowComment(!showComment)}
      >
        {stats.totalAmountOfComments}
        <ChatAlt2Icon className="h-6 w-6 ml-2" aria-hidden="true" />
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
