"use client";
// components/profile/DoesFollow.tsx

import { useState, useContext, useCallback } from "react";
import { UserContext } from "@/context";
import { useAccount } from "wagmi";
import { useQuery } from "@apollo/client";
import { DOES_FOLLOW } from "@/graphql/follow/does-follow";
import { Profile } from "@/types/graphql/generated";

import {
  FollowProfileButton,
  UnFollowProfileButton,
} from "@/components/profile";

type DoesFollowProps = {
  profile: Profile;
};

export const DoesFollow = ({ profile }: DoesFollowProps) => {
  const { currentUser, verified } = useContext(UserContext);
  const { address } = useAccount();

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
            followerAddress: address,
            profileId: profile.id,
          },
        ],
      },
    },
    skip: !address || !profile.id,
    onCompleted: (data) => {
      const { doesFollow } = data;
      const { follows } = doesFollow[0];
      setIsFollowing(follows);
    },
  });

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // return null if no current user
  if (!currentUser || !verified) return null;
  // return null if loading
  if (loading) return null;
  // return null if no data
  if (!doesFollowData || !doesFollowData.doesFollow[0]) return null;

  if (
    profile.followModule === null ||
    profile.followModule?.__typename === "ProfileFollowModuleSettings"
  ) {
    if (isFollowing)
      return (
        <UnFollowProfileButton profileId={profile.id} refetch={handleRefetch} />
      );
    else
      return (
        <FollowProfileButton
          profile={profile}
          profileId={profile.id}
          refetch={handleRefetch}
        />
      );
  } else return null;
};
