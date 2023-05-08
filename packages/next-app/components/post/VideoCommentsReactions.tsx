import { useState } from "react";
import { BsChat } from "react-icons/bs";

import { Mirror, Collect, Like } from "@/components/post";
import { CommentCard } from "@/components/comment";

interface VideoCommentsReactionsProps {
  publication: any;
}

export const VideoCommentsReactions = ({
  publication,
}: VideoCommentsReactionsProps) => {
  const { stats } = publication;
  const [showComment, setShowComment] = useState(false);

  // console.log(publication);
  if (!publication) return null;
  return (
    <>
      <div className="flex mt-1 text-stone-500 w-full">
        {stats.totalAmountOfComments}
        <BsChat
          onClick={() => setShowComment(!showComment)}
          className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-2 hover:text-stone-700 cursor-pointer"
          aria-hidden="true"
        />
        <Like publication={publication} />
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
