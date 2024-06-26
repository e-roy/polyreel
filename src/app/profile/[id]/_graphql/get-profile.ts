import { gql } from "@apollo/client";

import { ProfileFragmentFull } from "@/graphql/fragments/ProfileFragmentFull";

export const GET_PROFILE = gql`
  query ($request: ProfileRequest!) {
    profile(request: $request) {
      ...ProfileFragmentFull
    }
  }
  ${ProfileFragmentFull}
`;
