import React from "react";
import { useQuery } from "@apollo/client";
import { EXPLORE_PUBLICATIONS } from "@/queries/explore/explore-publications";

import useInfiniteScroll from "react-infinite-scroll-hook";

import { Post } from "@/components/post";

export const ExplorePublications = () => {
  const { loading, error, data, fetchMore } = useQuery(EXPLORE_PUBLICATIONS, {
    variables: {
      request: {
        sortCriteria: "LATEST",
        // sortCriteria: "TOP_COMMENTED",
        limit: 10,
      },
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
  // console.log(data);
  return (
    <div className="">
      <div className="p-2">
        {data.explorePublications &&
          data.explorePublications.items &&
          data.explorePublications.items.map((item: any, index: number) => (
            <div key={index} className="">
              <div className="p-4 border-b border-stone-300">
                <Post publication={item} />
              </div>
            </div>
          ))}
        {pageInfo.next && <div className="h-4" ref={sentryRef}></div>}
      </div>
    </div>
  );
};
