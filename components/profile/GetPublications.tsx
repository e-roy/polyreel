import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { GET_PUBLICATIONS } from "@/graphql/publications/get-publications";
import useInfiniteScroll from "react-infinite-scroll-hook";

import { Post } from "@/components/post";

import { Loading, Error, LoadingMore } from "@/components/elements";

import { logger } from "@/utils/logger";
import { UserContext } from "@/context";

interface GetPublicationsProps {
  profileId: string;
  filter: "POST" | "COMMENT" | "MIRROR";
}

export const GetPublications: React.FC<GetPublicationsProps> = ({
  profileId,
  filter,
}) => {
  const { currentUser } = useContext(UserContext);

  const { loading, error, data, fetchMore } = useQuery(GET_PUBLICATIONS, {
    variables: {
      request: {
        profileId: profileId,
        publicationTypes: filter,
        limit: 10,
      },
      reactionRequest: {
        profileId: currentUser?.id || null,
      },
      profileId: currentUser?.id || null,
    },
    skip: !profileId,
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
        reactionRequest: {
          profileId: currentUser?.id || null,
        },
        profileId: currentUser?.id || null,
        skip: !profileId,
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
  logger("GetPublications.tsx", data);

  return (
    <div className="flex flex-col mt-2">
      {data.publications.items.map((publication: any, index: number) => (
        <div key={index} className="w-full md:mx-auto space-2 px-2">
          <div className="my-2 p-2 border-stone-400 border-b">
            <Post publication={publication} postType="profile" />
          </div>
        </div>
      ))}
      {pageInfo.next && (
        <div className="h-1" ref={sentryRef}>
          <LoadingMore />
        </div>
      )}
    </div>
  );
};
