import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_TIMELINE } from "@/queries/timeline/user-timeline";
import useInfiniteScroll from "react-infinite-scroll-hook";

// import { FeedCard } from "@/components/cards"; old card

export type UserTimelineProps = {};

export const UserTimeline = ({}: UserTimelineProps) => {
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    setProfileId(sessionStorage.getItem("polyreel_profile_id"));
  }, []);

  const { loading, error, data, fetchMore } = useQuery(GET_TIMELINE, {
    variables: {
      request: {
        profileId,
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 10,
      },
    },
  });

  console.log(profileId);

  const loadMore = () => {
    fetchMore({
      variables: {
        request: {
          profileId,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
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
    // When there is an error, we stop infinite loading.
    // It can be reactivated by setting "error" state as undefined.
    disabled: !!error,
    // `rootMargin` is passed to `IntersectionObserver`.
    // We can use it to trigger 'onLoadMore' when the sentry comes near to become
    // visible, instead of becoming fully visible on the screen.
    rootMargin: "0px 0px 400px 0px",
  });
  if (!data) return null;
  console.log(data);
  return (
    <div className="">
      <div className="p-2">
        {data.explorePublications &&
          data.explorePublications.items &&
          data.explorePublications.items.map((item: any, index: number) => (
            <div key={index} className="rounded">
              {/* <FeedCard publication={item} /> */}
            </div>
          ))}
        {pageInfo.next && (
          <div className="h-4 bg-slate-600" ref={sentryRef}></div>
        )}
      </div>
    </div>
  );
};
