import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { EXPLORE_PUBLICATIONS } from "@/queries/explore/explore-publications";
import { UserContext } from "@/context";

import useInfiniteScroll from "react-infinite-scroll-hook";
import { LoadingMore } from "@/components/elements";

import { Post } from "@/components/post";

import { Publication } from "@/types/graphql/generated";

import { logger } from "@/utils/logger";

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
        limit: 10,
      },
      reactionRequest: {
        profileId: currentUser?.id || null,
      },
      profileId: currentUser?.id || null,
    },
  });

  const loadMore = () => {
    fetchMore({
      variables: {
        request: {
          sortCriteria: "LATEST",
          // sortCriteria: "TOP_COMMENTED",
          limit: 10,
          cursor: pageInfo?.next,
        },
        reactionRequest: {
          profileId: currentUser?.id || null,
        },
        profileId: currentUser?.id || null,
      },
    });
  };

  const pageInfo = data?.explorePublications.pageInfo;

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: pageInfo?.next,
    onLoadMore: loadMore,
    disabled: !!error,
    rootMargin: "0px 0px 400px 0px",
  });
  if (!data) return null;

  const { items } = data?.explorePublications;
  logger("ExplorePublications.tsx", items);

  return (
    <div className={`px-2`}>
      <div className={`py-6 px-4`}>
        <h1
          className={`text-2xl font-semibold text-stone-700 dark:text-stone-100`}
        >
          Explore
        </h1>
      </div>
      {items &&
        items.map((item: Publication, index: number) => (
          <div key={index}>
            {/* <div className="h-60 bg-red-500">empty box</div> */}
            {item &&
              item.__typename === "Comment" &&
              item?.commentOn?.id === item.mainPost.id && (
                <div
                  key={index}
                  className="sm:p-4 border-b-4 border-stone-400/40"
                >
                  <Post publication={item} postType="feed" />
                </div>
              )}
            {item && item.__typename !== "Comment" && (
              <div
                key={index}
                className="sm:p-4 border-b-4 border-stone-400/40"
              >
                <Post publication={item} postType="feed" />
              </div>
            )}
          </div>
        ))}
      {pageInfo.next && (
        <div className="h-4" ref={sentryRef}>
          <LoadingMore />
        </div>
      )}
    </div>
  );
};
