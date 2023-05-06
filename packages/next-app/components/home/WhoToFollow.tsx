import { useQuery, gql } from "@apollo/client";
import { ProfileFragmentLite } from "@/queries/fragments/ProfileFragmentLite";
import { Loading, Error, Avatar } from "@/components/elements";
import Link from "next/link";
import { Profile } from "@/types/graphql/generated";

import { logger } from "@/utils/logger";

const RECOMMENDED_PROFILES = gql`
  query ($options: RecommendedProfileOptions) {
    recommendedProfiles(options: $options) {
      ...ProfileFragmentLite
      stats {
        totalFollowers
        totalFollowing
      }
    }
  }
  ${ProfileFragmentLite}
`;

interface IWhoToFollowProps {}

export const WhoToFollow = ({}: IWhoToFollowProps) => {
  const { loading, error, data } = useQuery(RECOMMENDED_PROFILES, {
    variables: {
      options: {
        shuffle: true,
        disableML: true,
      },
    },
  });

  if (loading) return <Loading />;
  if (error) return <Error />;

  const { recommendedProfiles } = data;

  const profiles = recommendedProfiles.slice(0, 3);

  logger("WhoToFollow.tsx", recommendedProfiles);

  return (
    <div className={`rounded-lg bg-stone-50`}>
      <div className={`text-xl font-bold text-stone-800 px-4 py-3`}>
        Who To Follow
      </div>
      <div>
        {profiles.map((profile: Profile, index: number) => (
          <Link
            key={index}
            href={`/profile/${profile.handle}`}
            className={`flex items-center justify-between px-4 py-3 hover:bg-stone-100`}
          >
            <div className={`flex items-center`}>
              <Avatar profile={profile} size={`small`} />
              <div className={`ml-4`}>
                <div className={`font-bold text-stone-800`}>{profile.name}</div>
                <div className={`text-stone-500`}>@{profile.handle}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link href={`/connect`}>
        <div
          className={`hover:bg-stone-100 px-4 py-3 rounded-b-lg text-blue-400`}
        >
          Show more
        </div>
      </Link>
    </div>
  );
};
