"use client";

import { Loading, Error, LoadingMore } from "@/components/elements";
import { FollowHeader } from "./FollowHeader";

import { useQuery } from "@apollo/client";
import { GET_PROFILE } from "@/graphql/profile/get-profile";
import { GET_FOLLOWING } from "@/graphql/follow/following";
import { ProfileItem } from "../connect";
import { Following } from "@/types/graphql/generated";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useCallback } from "react";

import { logger } from "@/utils/logger";

const endSuffix = process.env.NODE_ENV === "production" ? ".lens" : ".test";

interface IFollowingListProps {
  rawId: string;
}

export const FollowingList = ({ rawId }: IFollowingListProps) => {
  const id =
    typeof rawId === "string" && !rawId.endsWith(endSuffix)
      ? `${rawId}` + endSuffix
      : rawId;

  const {
    data: profileData,
    loading,
    error,
  } = useQuery(GET_PROFILE, {
    variables: {
      request: { handle: id },
    },
    skip: !id,
  });

  const { profile } = profileData || {};

  const { data: followingData, fetchMore } = useQuery(GET_FOLLOWING, {
    variables: {
      request: {
        address: profile?.ownedBy,
        limit: 10,
      },
    },
    skip: !profile?.ownedBy,
  });

  const { following } = followingData || {};
  const pageInfo = followingData?.following.pageInfo;

  const handleLoadMore = useCallback(
    () =>
      fetchMore({
        variables: {
          request: {
            address: profile?.ownedBy,
            limit: 10,
            cursor: pageInfo?.next,
          },
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchMore, pageInfo?.next]
  );

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: pageInfo?.next,
    onLoadMore: handleLoadMore,
    disabled: !!error,
    rootMargin: "0px 0px 400px 0px",
  });

  if (loading) return <Loading />;
  if (error) return <Error />;

  if (!profileData) return null;

  // TODO: need a screen for no profile found
  //   if (!profile) return <>profile not found</>;

  if (following) logger("FollowingList.tsx", following);

  // console.log("pageInfo?.next", pageInfo?.next);

  return (
    <div>
      <FollowHeader profile={profile} />
      {following?.items.map((item: Following) => (
        <ProfileItem profile={item.profile} key={item.profile.id} />
      ))}
      {pageInfo?.next && (
        <div className="h-36" ref={sentryRef}>
          <LoadingMore />
        </div>
      )}
    </div>
  );
};
