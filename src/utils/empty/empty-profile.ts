import { Profile } from "@/types/graphql/generated";

// @ts-ignore
export const emptyProfile: Profile = {
  // name: "",
  // handle: "",
  // isDefault: false,
  // isFollowing: false,
  // isFollowedByMe: false,
  // ownedBy: "0x00000",
  id: "0x00",
  createdAt: "",
  interests: [],
  invitesLeft: 0,
  stats: {
    comments: 0,
    countOpenActions: 0,
    followers: 0,
    following: 0,
    id: "0x00",
    /** The profile classifier score of this profile relative to others on Lens. It is a % out of 100. */
    lensClassifierScore: 0,
    mirrors: 0,
    posts: 0,
    publications: 0,
    quotes: 0,
    /** How many times a profile has reacted on something */
    reacted: 0,
    /** How many times other profiles have reacted on something this profile did */
    reactions: 0,
    // totalFollowers: 0,
    // totalFollowing: 0,
    // id: "",
    // commentsTotal: 0,
    // mirrorsTotal: 0,
    // postsTotal: 0,
    // publicationsTotal: 0,
    // totalCollects: 0,
    // totalComments: 0,
    // totalMirrors: 0,
    // totalPosts: 0,
    // totalPublications: 0,
  },
  // id: undefined,
  // onChainIdentity: {
  //   __typename: undefined,
  //   ens: undefined,
  //   proofOfHumanity: false,
  //   sybilDotOrg: {
  //     __typename: undefined,
  //     source: {
  //       __typename: undefined,
  //       twitter: {
  //         __typename: undefined,
  //         handle: undefined,
  //       },
  //     },
  //     verified: false,
  //   },
  //   worldcoin: {
  //     __typename: undefined,
  //     isHuman: false,
  //   },
  // },
};
