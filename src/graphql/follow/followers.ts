import { gql } from "@apollo/client/core";

import { ProfileFragmentLite } from "../fragments/ProfileFragmentLite";

export const GET_FOLLOWERS = gql`
  query ($request: FollowersRequest!) {
    followers(request: $request) {
      items {
        ...ProfileFragmentLite
      }
      pageInfo {
        prev
        next
      }
    }
  }
  ${ProfileFragmentLite}
`;
