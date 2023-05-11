import { useRouter } from "next/router";
import { Loading, Error, LoadingMore } from "@/components/elements";

import { useQuery } from "@apollo/client";
import { GET_PROFILE } from "@/queries/profile/get-profile";
import { GET_FOLLOWING } from "@/queries/follow/following";
import { GET_FOLLOWERS } from "@/queries/follow/followers";

import { ProfileItem } from "../connect";
import { Follower, Profile } from "@/types/graphql/generated";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useCallback } from "react";

import { logger } from "@/utils/logger";

const endSuffix = process.env.NODE_ENV === "production" ? ".lens" : ".test";

interface IFollowersListProps {}
export const FollowersList = ({}: IFollowersListProps) => {
  const router = useRouter();
  const { id: rawId } = router.query;
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

  const { data: followersData, fetchMore } = useQuery(GET_FOLLOWERS, {
    variables: {
      request: {
        profileId: profile?.id,
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
            profileId: profile?.id,
            cursor: pageInfo?.next,
            // limit: 10,
          },
        },
      }),
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

  // console.log("pageInfo?.next", pageInfo?.next);

  return (
    <div>
      {followers?.items.map((item: Follower, index: number) => (
        <ProfileItem
          profile={item.wallet.defaultProfile as Profile}
          //   key={item?.wallet?.defaultProfile?.id}
          key={index}
        />
      ))}
      {pageInfo?.next && (
        <div className="h-36" ref={sentryRef}>
          <LoadingMore />
        </div>
      )}
    </div>
  );
};
