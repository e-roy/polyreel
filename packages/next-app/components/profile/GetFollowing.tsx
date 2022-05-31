import { useQuery } from "@apollo/client";
import { GET_FOLLOWING } from "@/queries/follow/following";
import { FollowersCard } from "@/components/cards";
import useInfiniteScroll from "react-infinite-scroll-hook";

type GetFollowingProps = {
  ownedBy: string | undefined;
};

export const GetFollowing = ({ ownedBy }: GetFollowingProps) => {
  const {
    loading,
    error,
    data: followingData,
    fetchMore,
  } = useQuery(GET_FOLLOWING, {
    variables: {
      request: {
        address: ownedBy,
        limit: 10,
      },
    },
  });

  const loadMore = () => {
    fetchMore({
      variables: {
        request: {
          address: ownedBy,
          limit: 10,
          cursor: pageInfo?.next,
        },
      },
    });
  };

  //   console.log("following", followingData);
  const pageInfo = followingData?.following.pageInfo;

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: pageInfo?.next,
    onLoadMore: loadMore,
    disabled: !!error,
    rootMargin: "0px 0px 400px 0px",
  });

  if (!followingData) return null;

  return (
    <div className="pb-80 pt-4">
      {followingData &&
        followingData.following.items.map((follower: any, index: number) => (
          <FollowersCard key={index} profile={follower.wallet} />
        ))}
      {pageInfo.next && <div className="h-4" ref={sentryRef}></div>}
    </div>
  );
};
