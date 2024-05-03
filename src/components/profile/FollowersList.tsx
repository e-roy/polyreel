"use client";

import { Loading } from "@/components/elements/Loading";
import { Error } from "@/components/elements/Error";
import { LoadingMore } from "@/components/elements/LoadingMore";

import { FollowHeader } from "./FollowHeader";

import { useQuery } from "@apollo/client";
import { GET_PROFILE } from "@/graphql/profile/get-profile";
import { GET_FOLLOWERS } from "@/graphql/follow/followers";

import { ProfileItem } from "./ProfileItem";
import { Profile } from "@/types/graphql/generated";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useCallback } from "react";

import { logger } from "@/utils/logger";

interface IFollowersListProps {
  rawId: string;
}
export const FollowersList = ({ rawId }: IFollowersListProps) => {
  const id = `lens/` + rawId;

  const {
    data: profileData,
    loading,
    error,
  } = useQuery(GET_PROFILE, {
    variables: {
      request: { forHandle: id },
    },
    skip: !rawId,
  });

  const { profile } = profileData || {};

  const { data: followersData, fetchMore } = useQuery(GET_FOLLOWERS, {
    variables: {
      request: {
        of: profile?.id,
        // limit: 20,
      },
    },
    skip: !profile?.id,
  });

  const pageInfo = followersData?.followers?.pageInfo;
  // console.log("pageInfo", pageInfo);

  const handleLoadMore = useCallback(
    () =>
      fetchMore({
        variables: {
          request: {
            of: profile?.id,
          },
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchMore, pageInfo?.next]
  );

  const { followers } = followersData || {};

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage:
      pageInfo?.next &&
      followersData?.followers?.items.length < pageInfo.totalCount,
    onLoadMore: handleLoadMore,
    rootMargin: "0px 0px 400px 0px",
  });

  if (loading) return <Loading />;
  if (error) return <Error />;

  // TODO: need a screen for no profile found
  //   if (!profile) return <>profile not found</>;

  logger("FollowersList.tsx", followers);

  return (
    <div>
      <FollowHeader profile={profile} />
      {followers?.items.map((item: Profile) => (
        <ProfileItem profile={item} key={item.id} />
      ))}
      {/* {pageInfo?.next && (
        <div className="h-36" ref={sentryRef}>
          <LoadingMore />
        </div>
      )} */}
    </div>
  );
};
