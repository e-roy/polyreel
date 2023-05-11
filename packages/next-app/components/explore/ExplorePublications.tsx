import React, { useCallback, useContext } from "react";
import { useQuery } from "@apollo/client";
import { EXPLORE_PUBLICATIONS } from "@/queries/explore/explore-publications";
import { UserContext } from "@/context";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { LoadingMore } from "@/components/elements";
import { Post } from "@/components/post";
import { Publication } from "@/types/graphql/generated";

import { logger } from "@/utils/logger";

import { FeedSkeleton } from "../skeletons/FeedSkeleton";

import { Post as PostType } from "@/types/graphql/generated";
import { Comment as CommentType } from "@/types/graphql/generated";
import { Mirror as MirrorType } from "@/types/graphql/generated";

export const ExplorePublications = () => {
  const { currentUser } = useContext(UserContext);
  const { loading, error, data, fetchMore } = useQuery(EXPLORE_PUBLICATIONS, {
    variables: {
      request: {
        sortCriteria: "LATEST",
        // sortCriteria: "TOP_COMMENTED",
        limit: 20,
      },
      reactionRequest: {
        profileId: currentUser?.id || null,
      },
      profileId: currentUser?.id || null,
    },
  });

  const pageInfo = data?.explorePublications?.pageInfo;

  const handleLoadMore = useCallback(
    () =>
      fetchMore({
        variables: {
          request: {
            sortCriteria: "LATEST",
            // sortCriteria: "TOP_COMMENTED",
            limit: 20,
            cursor: pageInfo?.next,
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

  if (data) logger("ExplorePublications.tsx", data?.explorePublications.items);

  return (
    <div className={`px-2`}>
      <div className={`py-6 px-4`}>
        <h1
          className={`text-2xl font-semibold text-stone-700 dark:text-stone-100`}
        >
          Explore
        </h1>
      </div>
      <ExplorePublicationsList publications={data?.explorePublications.items} />
      {loading && <FeedSkeleton />}

      {data?.explorePublications.pageInfo && (
        <div className="h-36" ref={sentryRef}>
          <LoadingMore />
        </div>
      )}
    </div>
  );
};

const ExplorePublicationsList = ({ publications }: any) => {
  return (
    <>
      {publications &&
        publications.map((item: Publication, index: number) => (
          <div key={index}>
            {item &&
              item.__typename === "Comment" &&
              item?.commentOn?.id === item.mainPost.id && (
                <div className="sm:p-4 border-b-4 border-stone-400/40">
                  <Post publication={item} postType="feed" />
                </div>
              )}
            {item && item.__typename !== "Comment" && (
              <div className="sm:p-4 border-b-4 border-stone-400/40">
                <Post publication={item} postType="feed" />
              </div>
            )}
          </div>
        ))}
    </>
  );
};
