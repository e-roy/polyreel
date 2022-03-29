import { gql } from "@apollo/client";

export const UPDATE_PROFILE = gql`
  mutation ($request: UpdateProfileRequest!) {
    updateProfile(request: $request) {
      id
      name
      location
      website
      twitterUrl
      bio
    }
  }
`;
