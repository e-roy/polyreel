import { gql } from "@apollo/client";

import { ProfileFragmentFull } from "../fragments/ProfileFragmentFull";

export const GET_PROFILE = gql`
  query ($request: SingleProfileQueryRequest!) {
    profile(request: $request) {
      ...ProfileFragmentFull
    }
  }
  ${ProfileFragmentFull}
`;
