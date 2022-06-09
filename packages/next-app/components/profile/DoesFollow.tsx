import { useState, useContext } from "react";
import { UserContext } from "@/components/layout";
import { useAccount } from "wagmi";
import { useQuery } from "@apollo/client";
import { DOES_FOLLOW } from "@/queries/follow/does-follow";
import { Profile } from "@/types/lenstypes";

import {
  FollowProfileButton,
  UnFollowProfileButton,
} from "@/components/profile";

type DoesFollowProps = {
  profile: Profile;
  profileId: string;
};

export const DoesFollow = ({ profile, profileId }: DoesFollowProps) => {
  const { currentUser } = useContext(UserContext);
  const { data: accountData } = useAccount();

  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const {
    data: doesFollowData,
    loading,
    refetch,
  } = useQuery(DOES_FOLLOW, {
    variables: {
      request: {
        followInfos: [
          {
            followerAddress: accountData?.address,
            profileId,
          },
        ],
      },
    },
    onCompleted: (data) => {
      const { doesFollow } = data;
      const { follows } = doesFollow[0];
      setIsFollowing(follows);
    },
  });

  // return null if no current user
  if (!currentUser) return null;
  // return null if loading
  if (loading) return null;
  // return null if no data
  if (!doesFollowData || !doesFollowData.doesFollow[0]) return null;
  // console.log(profile);

  const handleRefetch = async () => {
    await refetch();
  };

  if (
    profile.followModule === null ||
    // @ts-ignore
    profile.followModule?.__typename === "ProfileFollowModuleSettings"
  ) {
    if (isFollowing)
      return (
        <UnFollowProfileButton profileId={profileId} refetch={handleRefetch} />
      );
    else
      return (
        <FollowProfileButton
          profile={profile}
          profileId={profileId}
          refetch={handleRefetch}
        />
      );
  } else return null;
};
