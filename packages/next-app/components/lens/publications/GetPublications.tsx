import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PUBLICATIONS } from "@/queries/publications/get-publications";
import useInfiniteScroll from "react-infinite-scroll-hook";

import { Post } from "@/components/post";

type GetPublicationsProps = {
  profileId: string;
};

export const GetPublications = ({ profileId }: GetPublicationsProps) => {
  if (!profileId) return null;

  const { loading, error, data, fetchMore } = useQuery(GET_PUBLICATIONS, {
    variables: {
      request: {
        profileId: profileId,
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 10,
      },
    },
  });

  const loadMore = () => {
    fetchMore({
      variables: {
        request: {
          profileId: profileId,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 10,
          cursor: pageInfo?.next,
        },
      },
    });
  };

  const pageInfo = data?.publications.pageInfo;

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  // console.log(data);
  return (
    <div className="mt-2">
      <div className="flex flex-wrap">
        {data.publications.items.map((publication: any, index: number) => (
          <div key={index} className="w-full sm:w-1/3 space-2">
            <div className="m-2 p-2  border border-stone-400 shadow-lg rounded">
              <Post publication={publication} />
            </div>
          </div>
        ))}
        {pageInfo.next && <div className="h-1" ref={sentryRef}></div>}
      </div>
    </div>
  );
};
