// _components/feeds/ReplyFeed.tsx
"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { GET_REPLY_FEED } from "../../_graphql/get-reply-feed";
import useInfiniteScroll from "react-infinite-scroll-hook";

import { Post } from "@/components/post/Post";

import { Loading } from "@/components/elements/Loading";
import { ErrorComponent } from "@/components/elements/ErrorComponent";
import { LoadingMore } from "@/components/elements/LoadingMore";

import { logger } from "@/utils/logger";
import { PrimaryPublication } from "@/types/graphql/generated";

interface ReplyFeedProps {
  profileId: string;
}

export const ReplyFeed: React.FC<ReplyFeedProps> = ({ profileId }) => {
  const { loading, error, data, fetchMore } = useQuery(GET_REPLY_FEED, {
    variables: {
      request: {
        where: {
          from: profileId,
          publicationTypes: "COMMENT",
        },
        limit: "TwentyFive",
      },
    },
    skip: !profileId,
    fetchPolicy: "no-cache",
  });

  const loadMore = () => {
    fetchMore({
      variables: {
        request: {
          where: {
            from: profileId,
            publicationTypes: "COMMENT",
          },
          limit: "Ten",
          cursor: pageInfo?.next,
        },
        skip: !profileId,
        fetchPolicy: "no-cache",
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
  if (error) return <ErrorComponent />;
  logger("ReplyFeed.tsx", data);

  return (
    <div className="flex flex-col mt-2">
      {data.publications.items.map((publication: PrimaryPublication) => (
        <div key={publication.id} className="w-full md:mx-auto space-2 px-2">
          <div className="my-2 p-2 border-stone-400 border-b">
            <Post publication={publication} />
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
