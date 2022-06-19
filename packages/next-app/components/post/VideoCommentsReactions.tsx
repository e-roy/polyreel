import { useState } from "react";
import { ChatAlt2Icon } from "@heroicons/react/outline";
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
        <ChatAlt2Icon
          onClick={() => setShowComment(!showComment)}
          className="h-5 w-5 ml-2 hover:text-stone-700 cursor-pointer"
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
