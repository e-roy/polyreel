"use client";

import { useQuery } from "@apollo/client";

import { Loading } from "@/components/elements/Loading";
import { ErrorComponent } from "@/components/elements/ErrorComponent";
import { Avatar } from "@/components/elements/Avatar";
import { Like } from "@/components/post/Like";
import { CommentLine } from "@/app/post/[id]/_components/CommentLine";

import { GET_VIDEO_COMMENTS } from "../_graphql/get-video-comments";
import { Comment, Post as PostType } from "@/types/graphql/generated";
import { logger } from "@/utils/logger";

type VideoCommentsProps = {
  publication: PostType;
};

export const VideoComments = ({ publication }: VideoCommentsProps) => {
  const { error, data, refetch } = useQuery(GET_VIDEO_COMMENTS, {
    variables: {
      request: {
        where: {
          commentOn: {
            id: publication?.id,
          },
        },
      },
      hasReactedRequest2: {
        type: "UPVOTE",
      },
    },
    skip: !publication?.id,
  });

  if (error) return <ErrorComponent />;
  if (!data) return null;

  logger("VideoComments.tsx", data);

  return (
    <div className="relative lg:h-95vh">
      <div className="lg:overflow-y-scroll lg:h-8/10 flex-grow">
        {data.publications?.items.map((comment: Comment) => (
          <div
            key={comment.id}
            className="px-2 py-2 my-3 flex text-sm text-stone-700 dark:text-stone-100 font-medium w-full border-b dark:border-stone-600"
          >
            <div>
              <Avatar
                profile={comment.by}
                size="xs"
                href={`/profile/${comment.by?.handle?.localName}`}
              />
            </div>
            <div className="w-full">
              <div className="mx-2 p-2">
                <div>{comment.by?.metadata?.displayName}</div>
                <div className="text-xs">{comment.metadata.content}</div>
              </div>
              <div className="flex my-1 w-full">
                <Like publication={comment as PostType} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:absolute bottom-0 w-full">
        {publication?.operations?.canComment === "YES" ? (
          <CommentLine publicationId={publication.id} refetch={refetch} />
        ) : (
          <div className="text-center py-8 font-medium text-stone-700 dark:text-stone-100">
            Publisher has disabled comments
          </div>
        )}
      </div>
    </div>
  );
};
