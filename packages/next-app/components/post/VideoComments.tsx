import Link from "next/link";
import { useQuery, gql } from "@apollo/client";
import { useCallback, useContext } from "react";
import { UserContext } from "@/context";

import useInfiniteScroll from "react-infinite-scroll-hook";
import { Loading, Error, LoadingMore } from "@/components/elements";
import { Like } from "./";

import { PostPostFragment } from "@/queries/fragments/PostPostFragment";
import { PostCommentFragment } from "@/queries/fragments/PostCommentFragment";
import { PostMirrorFragment } from "@/queries/fragments/PostMirrorFragment";

export const GET_PUBLICATIONS = gql`
  query (
    $request: PublicationsQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    publications(request: $request) {
      items {
        __typename
        ... on Post {
          ...PostPostFragment
        }
        ... on Comment {
          ...PostCommentFragment
        }
        ... on Mirror {
          ...PostMirrorFragment
        }
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
  ${PostPostFragment}
  ${PostCommentFragment}
  ${PostMirrorFragment}
`;

type VideoCommentsProps = {
  publication: PostType;
};

export const VideoComments = ({ publication }: VideoCommentsProps) => {
  const { currentUser } = useContext(UserContext);

  const { loading, error, data, refetch, fetchMore } = useQuery(
    GET_PUBLICATIONS,
    {
      variables: {
        request: {
          commentsOf: publication?.id,
        },
        reactionRequest: {
          profileId: currentUser?.id || null,
        },
        profileId: currentUser?.id || null,
      },
      skip: !publication?.id,
    }
  );

  // const loadMore = () => {
  //   fetchMore({
  //     variables: {
  //       request: {
  //         commentsOf: publication?.id,
  //         cursor: pageInfo?.next,
  //       },
  //       reactionRequest: {
  //         profileId: currentUser?.id || null,
  //       },
  //       profileId: currentUser?.id || null,
  //     },
  //   });
  // };

  const pageInfo = data?.publications.pageInfo;

  // console.log("pageInfo", pageInfo);

  const handleLoadMore = useCallback(
    () =>
      fetchMore({
        variables: {
          variables: {
            request: {
              commentsOf: publication?.id,
              cursor: pageInfo?.next,
            },
            reactionRequest: {
              profileId: currentUser?.id || null,
            },
            profileId: currentUser?.id || null,
          },
        },
      }),
    [fetchMore, pageInfo?.next]
  );

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: pageInfo?.next,
    onLoadMore: handleLoadMore,
    disabled: !!error,
    rootMargin: "0px 0px 400px 0px",
  });

  // if (loading) return <Loading />;
  if (error) return <Error />;
  // console.log(data);
  if (!data) return null;

  logger("VideoComments.tsx", data);

  return (
    <div className={`relative lg:h-95vh`}>
      <div className={`lg:overflow-y-scroll lg:h-8/10 flex-grow`}>
        {data?.publications?.items.map((publication: PostType) => (
          <CommentedBranch key={publication.id} publication={publication} />
        ))}
        {/* Disabled due to causing issues with infinite scroll */}
        {/* {pageInfo.next && (
          <div className="h-4" ref={sentryRef}>
            <LoadingMore />
          </div>
        )} */}
      </div>

      <div className={`lg:absolute bottom-0 w-full`}>
        {publication?.canComment?.result ? (
          <CommentLine publicationId={publication.id} refetch={refetch} />
        ) : (
          <div
            className={`text-center py-8 font-medium text-stone-700 dark:text-stone-100`}
          >
            Publisher has disabled comments
          </div>
        )}
      </div>
    </div>
  );
};

const CommentedBranch = ({ publication }: { publication: PostType }) => {
  // console.log("CommentedBranch", publication);
  return (
    <>
      <div className="w-full">
        <CommentBody publication={publication} />
      </div>
      {/* Comments on Comments doesn't seem practical, also difficult to query from grahpql */}
      {/* {publication?.stats?.totalAmountOfComments > 0 ? (
        <div className="pl-4 w-full">
          <div className="w-0.5 h-8 ml-10 bg-gray-400 " />
          <div className="-mt-6">
            <Comment postId={publication.id} />
          </div>
        </div>
      ) : null} */}
    </>
  );
};

interface ICommentProps {
  postId: string;
}

const Comment = ({ postId }: ICommentProps) => {
  const { loading, error, data } = useQuery(GET_PUBLICATIONS, {
    variables: {
      request: {
        commentsOf: postId,
      },
    },
  });
  if (loading) return <Loading />;
  if (error) return <Error />;
  // console.log("DATA ======>", data);

  return (
    <>
      {data.publications.items.map((publication: PostType, index: number) => (
        <CommentedBranch key={index} publication={publication} />
      ))}
    </>
  );
};

import { Avatar } from "@/components/elements";
import { CommentLine } from "../comment";
import { Post as PostType } from "@/types/graphql/generated";
import { logger } from "@/utils/logger";

const CommentBody = ({ publication }: any) => {
  return (
    <div className="px-2 my-3 flex text-sm text-stone-700 dark:text-stone-100 font-medium w-full">
      <div className={``}>
        <Avatar
          profile={publication.profile}
          size="xs"
          href={`/profile/${publication.profile.handle}`}
        />
      </div>
      <div className="w-full">
        <div className="mx-2 p-2 border dark:border-stone-400 rounded-xl shadow-md">
          <div className="">{publication.profile.name}</div>
          <div className="text-xs">{publication.metadata.content}</div>
        </div>
        <div className="flex my-1 w-full">
          <Like publication={publication} />
        </div>
      </div>
    </div>
  );
};
