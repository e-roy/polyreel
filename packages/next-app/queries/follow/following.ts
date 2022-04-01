import { gql } from "@apollo/client/core";

import { MediaFieldsFragment } from "../fragments/MediaFieldsFragment";

export const GET_FOLLOWING = gql`
  query ($request: FollowingRequest!) {
    following(request: $request) {
      items {
        profile {
          id
          name
          bio
          location
          website
          twitterUrl
          handle
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
          }
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
          }
          ownedBy
          depatcher {
            address
            canUseRelay
          }
          stats {
            totalFollowers
            totalFollowing
            totalPosts
            totalComments
            totalMirrors
            totalPublications
            totalCollects
          }
          followModule {
            ... on FeeFollowModuleSettings {
              type
              amount {
                asset {
                  name
                  symbol
                  decimals
                  address
                }
                value
              }
              recipient
            }
          }
        }
        totalAmountOfTimesFollowing
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
  ${MediaFieldsFragment}
`;
