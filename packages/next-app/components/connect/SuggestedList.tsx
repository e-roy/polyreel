import { useQuery, gql } from "@apollo/client";
import { ProfileFragmentLite } from "@/queries/fragments/ProfileFragmentLite";
import { Loading, Error } from "@/components/elements";
import { Profile } from "@/types/graphql/generated";
import { ProfileItem } from "@/components/connect";

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

  if (loading) return <Loading />;
  if (error) return <Error />;

  const { recommendedProfiles } = data;

  logger("SuggestedList.tsx", recommendedProfiles);

  return (
    <div className={``}>
      <div className={`text-xl font-bold text-stone-800 py-3`}>
        Suggested for you
      </div>
      <div className={``}>
        {recommendedProfiles.map((profile: Profile, index: number) => (
          <ProfileItem profile={profile} key={index} />
        ))}
      </div>
    </div>
  );
};
