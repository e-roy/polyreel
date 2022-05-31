import { useQuery } from "@apollo/client";
import { GET_FOLLOWERS } from "@/queries/follow/followers";
import { FollowersCard } from "@/components/cards";
import useInfiniteScroll from "react-infinite-scroll-hook";

type GetFollowersProps = {
  profileId: string;
};

export const GetFollowers = ({ profileId }: GetFollowersProps) => {
  const {
    loading,
    error,
    data: followersData,
    fetchMore,
  } = useQuery(GET_FOLLOWERS, {
    variables: {
      request: {
        profileId: profileId,
        limit: 10,
      },
    },
  });

  const loadMore = () => {
    fetchMore({
      variables: {
        request: {
          profileId: profileId,
          limit: 10,
          cursor: pageInfo?.next,
        },
      },
    });
  };

  console.log("followers", followersData);
  const pageInfo = followersData?.followers.pageInfo;

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: pageInfo?.next,
    onLoadMore: loadMore,
    disabled: !!error,
    rootMargin: "0px 0px 400px 0px",
  });

  if (!followersData) return null;

  return (
    <div className="pb-80 pt-4">
      {followersData &&
        followersData.followers.items.map((follower: any, index: number) => (
          <FollowersCard key={index} profile={follower.wallet.defaultProfile} />
        ))}
      {pageInfo.next && <div className="h-4" ref={sentryRef}></div>}
    </div>
  );
};
