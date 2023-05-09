import { useQuery, gql } from "@apollo/client";
import { ProfileFragmentLite } from "@/queries/fragments/ProfileFragmentLite";
import { Error } from "@/components/elements";
import { Profile } from "@/types/graphql/generated";
import { ProfileItem } from "@/components/connect";
import { ConnectSkeleton } from "@/components/skeletons";

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
export const SuggestedList = () => {
  const { loading, error, data } = useQuery(RECOMMENDED_PROFILES, {
    variables: {
      options: {
        shuffle: true,
        // disableML: true,
      },
    },
  });

  if (error) return <Error />;

  if (data) logger("SuggestedList.tsx", data.recommendedProfiles);

  return (
    <div className={``}>
      <div
        className={`text-xl font-bold text-stone-800 dark:text-stone-100 px-6 py-3`}
      >
        Suggested for you
      </div>
      <div className={``}>
        {data?.recommendedProfiles.map((profile: Profile) => (
          <ProfileItem profile={profile} key={profile.id} />
        ))}
        {loading && <ConnectSkeleton />}
      </div>
    </div>
  );
};
