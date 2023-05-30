import { Profile } from "@/types/graphql/generated";

export const emptyProfile: Profile = {
  name: "",
  handle: "",
  isDefault: false,
  isFollowing: false,
  isFollowedByMe: false,
  ownedBy: "0x00000",
  stats: {
    totalFollowers: 0,
    totalFollowing: 0,
    id: "",
    commentsTotal: 0,
    mirrorsTotal: 0,
    postsTotal: 0,
    publicationsTotal: 0,
    totalCollects: 0,
    totalComments: 0,
    totalMirrors: 0,
    totalPosts: 0,
    totalPublications: 0,
  },
  id: undefined,
  onChainIdentity: {
    __typename: undefined,
    ens: undefined,
    proofOfHumanity: false,
    sybilDotOrg: {
      __typename: undefined,
      source: {
        __typename: undefined,
        twitter: {
          __typename: undefined,
          handle: undefined,
        },
      },
      verified: false,
    },
    worldcoin: {
      __typename: undefined,
      isHuman: false,
    },
  },
};
