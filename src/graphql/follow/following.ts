import { gql } from "@apollo/client/core";

import { ProfileFragmentLite } from "../fragments/ProfileFragmentLite";

export const GET_FOLLOWING = gql`
  query ($request: FollowingRequest!) {
    following(request: $request) {
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
