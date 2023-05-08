import Link from "next/link";
import { useQuery, gql } from "@apollo/client";
import { useContext } from "react";
import { UserContext } from "@/context";

import { PostPostFragment } from "@/queries/fragments/PostPostFragment";
import { PostCommentFragment } from "@/queries/fragments/PostCommentFragment";
import { PostMirrorFragment } from "@/queries/fragments/PostMirrorFragment";

export const GET_PUBLICATIONS = gql`
  query (
    $request: PublicationsQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
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

import useInfiniteScroll from "react-infinite-scroll-hook";
import { Loading, Error, LoadingMore } from "@/components/elements";

import { VideoCommentsReactions } from "./";

type VideoCommentsProps = {
  postId: string;
};

export const VideoComments = ({ postId }: VideoCommentsProps) => {
  const { currentUser } = useContext(UserContext);

  const { loading, error, data, fetchMore } = useQuery(GET_PUBLICATIONS, {
    variables: {
      request: {
        commentsOf: postId,
      },
      reactionRequest: {
        profileId: currentUser?.id || null,
      },
    },
  });

  const loadMore = () => {
    fetchMore({
      variables: {
        request: {
          commentsOf: postId,
          cursor: pageInfo?.next,
        },
        requestRequest: { profileId: currentUser?.id },
      },
    });
  };

  const pageInfo = data?.publications.pageInfo;

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: pageInfo?.next,
    onLoadMore: loadMore,
    disabled: !!error,
    rootMargin: "0px 0px 400px 0px",
  });

  if (loading) return <Loading />;
  if (error) return <Error />;
  //   console.log(data);
  return (
    <>
      {data.publications.items.map((publication: any, index: number) => (
        <CommentedBranch key={index} publication={publication} />
      ))}
      {pageInfo.next && (
        <div className="h-4" ref={sentryRef}>
          <LoadingMore />
        </div>
      )}
    </>
  );
};

const CommentedBranch = ({ publication }: any) => {
  return (
    <>
      <div className="w-full">
        <CommentBody publication={publication} />
      </div>
      {publication.stats.totalAmountOfComments > 0 ? (
        <div className="pl-4 w-full">
          <div className="w-0.5 h-8 ml-10 bg-gray-400 " />
          <div className="-mt-6">
            <Comment postId={publication.id} />
          </div>
        </div>
      ) : null}
    </>
  );
};

const Comment = ({ postId }: VideoCommentsProps) => {
  const { loading, error, data } = useQuery(GET_PUBLICATIONS, {
    variables: {
      request: {
        commentsOf: postId,
      },
    },
  });
  if (loading) return <Loading />;
  if (error) return <Error />;

  return (
    <>
      {data.publications.items.map((publication: any, index: number) => (
        <CommentedBranch key={index} publication={publication} />
      ))}
    </>
  );
};

import { Avatar } from "@/components/elements";

const CommentBody = ({ publication }: any) => {
  return (
    <div className="px-2 my-3 flex text-sm text-stone-700 font-medium w-full">
      <Link href={`/profile/${publication.profile.handle}`}>
        <div className={``}>
          <Avatar profile={publication.profile} size="xs" />
        </div>
      </Link>
      <div className="w-full">
        <div className="mx-2 py-1 px-2 border rounded-xl shadow-md">
          <div className="">@{publication.profile.handle}</div>
          <div className="text-xs">{publication.metadata.content}</div>
        </div>
        <div className="pl-2">
          <VideoCommentsReactions publication={publication} />
        </div>
      </div>
    </div>
  );
};
