import { gql } from "@apollo/client/core";

import { ProfileFragmentLite } from "../fragments/ProfileFragmentLite";

export const GET_FOLLOWERS = gql`
  query ($request: FollowersRequest!) {
    followers(request: $request) {
      items {
        wallet {
          address
          defaultProfile {
            ...ProfileFragmentLite
            stats {
              totalFollowers
              totalFollowing
            }
          }
        }
        totalAmountOfTimesFollowed
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
  ${ProfileFragmentLite}
`;
