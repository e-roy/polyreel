import { useAccount } from "wagmi";
import { useQuery } from "@apollo/client";
import { DOES_FOLLOW } from "@/queries/follow/does-follow";

import {
  FollowProfileButton,
  UnFollowProfileButton,
} from "@/components/profile";

type DoesFollowProps = {
  profileId: string;
};

export const DoesFollow = ({ profileId }: DoesFollowProps) => {
  const [{ data: accountData }] = useAccount();

  const { data: doesFollowData, loading } = useQuery(DOES_FOLLOW, {
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
  });
  if (loading) return <div>loading</div>;

  return (
    <div>
      {doesFollowData?.doesFollow[0].follows ? (
        <UnFollowProfileButton profileId={profileId} />
      ) : (
        <FollowProfileButton profileId={profileId} />
      )}
    </div>
  );
};
