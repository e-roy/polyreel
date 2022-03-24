import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { EXPLORE_PUBLICATIONS } from "@/queries/explore/explore-publications";
import useInfiniteScroll from "react-infinite-scroll-hook";

import { FeedCard } from "@/components/cards";

export const ExplorePublications = () => {
  const { loading, error, data, fetchMore } = useQuery(EXPLORE_PUBLICATIONS, {
    variables: {
      request: {
        sortCriteria: "TOP_COMMENTED",
        limit: 10,
      },
    },
  });

  const loadMore = () => {
    fetchMore({
      variables: {
        request: {
          sortCriteria: "TOP_COMMENTED",
          limit: 10,
        },
      },
    });
  };

  const pageInfo = data?.explorePublications.pageInfo;

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: pageInfo?.next,
    onLoadMore: loadMore,
    // When there is an error, we stop infinite loading.
    // It can be reactivated by setting "error" state as undefined.
    disabled: !!error,
    // `rootMargin` is passed to `IntersectionObserver`.
    // We can use it to trigger 'onLoadMore' when the sentry comes near to become
    // visible, instead of becoming fully visible on the screen.
    rootMargin: "0px 0px 400px 0px",
  });
  if (!data) return null;
  // console.log(data);
  return (
    <div className="">
      <div className="p-2">
        {data.explorePublications &&
          data.explorePublications.items &&
          data.explorePublications.items.map((item: any, index: number) => (
            <div key={index} className="rounded">
              <FeedCard publication={item} />
            </div>
          ))}
        {pageInfo.next && (
          <div className="h-4 bg-slate-600" ref={sentryRef}></div>
        )}
      </div>
    </div>
  );
};