"use client";

import React, { useCallback } from "react";
import { useQuery } from "@apollo/client";
import { EXPLORE_PUBLICATIONS } from "../_graphql/explore-publications";

import useInfiniteScroll from "react-infinite-scroll-hook";
import { LoadingMore } from "@/components/elements/LoadingMore";
import { Post } from "@/components/post/Post";
import {
  ExplorePublication,
  PaginatedExplorePublicationResult,
} from "@/types/graphql/generated";

import { logger } from "@/utils/logger";

import { FeedSkeleton } from "@/components/skeletons/FeedSkeleton";

type ExplorePublicationsResult = {
  explorePublications: PaginatedExplorePublicationResult;
};

const EXPLORE_PUBLICATIONS_VARIABLES = {
  request: {
    orderBy: "LATEST",
    limit: "TwentyFive",
  },
};

export const ExplorePublications = () => {
  const { loading, error, data, fetchMore } =
    useQuery<ExplorePublicationsResult>(EXPLORE_PUBLICATIONS, {
      variables: EXPLORE_PUBLICATIONS_VARIABLES,
    });

  const pageInfo = data?.explorePublications?.pageInfo;

  const handleLoadMore = useCallback(
    () =>
      fetchMore({
        variables: {
          request: {
            ...EXPLORE_PUBLICATIONS_VARIABLES.request,
            cursor: pageInfo?.next,
          },
        },
      }),
    [fetchMore, pageInfo?.next]
  );

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: !!pageInfo?.next,
    onLoadMore: handleLoadMore,
    disabled: !!error,
    rootMargin: "0px 0px 400px 0px",
  });

  if (data) logger("ExplorePublications.tsx", data.explorePublications.items);

  return (
    <div className="px-2 max-w-4xl mx-auto">
      <div className="py-6 px-4">
        <h1 className="text-2xl font-semibold text-stone-700 dark:text-stone-100">
          Explore
        </h1>
      </div>
      <ExplorePublicationsList publications={data?.explorePublications.items} />
      {loading && <FeedSkeleton />}

      {pageInfo && (
        <div className="h-36" ref={sentryRef}>
          <LoadingMore />
        </div>
      )}
    </div>
  );
};

interface ExplorePublicationsListProps {
  publications?: ExplorePublication[];
}

const ExplorePublicationsList: React.FC<ExplorePublicationsListProps> = ({
  publications,
}) => {
  return (
    <>
      {publications?.map((item, index) => (
        <div
          key={item.id ?? index}
          className="sm:p-4 border-b-2 border-stone-400/40"
        >
          <Post publication={item} />
        </div>
      ))}
    </>
  );
};
