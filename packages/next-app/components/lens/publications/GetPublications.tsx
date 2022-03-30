import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PUBLICATIONS } from "@/queries/publications/get-publications";
import useInfiniteScroll from "react-infinite-scroll-hook";

import { Post } from "@/components/post";

interface GetPublicationsProps {
  profileId: string;
  filter: "POST" | "COMMENT" | "MIRROR";
}

export const GetPublications: React.FC<GetPublicationsProps> = ({
  profileId,
  filter,
}) => {
  if (!profileId) return null;

  const { loading, error, data, fetchMore } = useQuery(GET_PUBLICATIONS, {
    variables: {
      request: {
        profileId: profileId,
        publicationTypes: filter,
        limit: 10,
      },
    },
  });

  const loadMore = () => {
    fetchMore({
      variables: {
        request: {
          profileId: profileId,
          publicationTypes: filter,
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
    disabled: !!error,
    rootMargin: "0px 0px 400px 0px",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="mt-2">
      <div className="flex flex-wrap">
        {data.publications.items.map((publication: any, index: number) => (
          <div key={index} className="w-full sm:w-1/3 space-2">
            <div className="m-2 p-2 border border-stone-400 shadow-lg rounded">
              <div className="">
                <Post publication={publication} />
              </div>
            </div>
          </div>
        ))}
        {pageInfo.next && <div className="h-1" ref={sentryRef}></div>}
      </div>
    </div>
  );
};
