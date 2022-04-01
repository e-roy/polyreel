import { gql } from "@apollo/client";

import { MediaFieldsFragment } from "../fragments/MediaFieldsFragment";

export const RECOMMENDED_PROFILES = gql`
  query {
    recommendedProfiles {
      id
      name
      bio
      location
      website
      twitterUrl
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            ...MediaFieldsFragment
          }
        }
        __typename
      }
      handle
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            ...MediaFieldsFragment
          }
        }
        __typename
      }
      ownedBy
      depatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
      }
      followModule {
        ... on FeeFollowModuleSettings {
          type
          amount {
            asset {
              symbol
              name
              decimals
              address
            }
            value
          }
          recipient
        }
        __typename
      }
    }
  }
  ${MediaFieldsFragment}
`;
