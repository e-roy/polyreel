import { gql } from "@apollo/client/core";

export const HAS_MIRRORED = gql`
  query ($request: HasMirroredRequest!) {
    hasMirrored(request: $request) {
      profileId
      results {
        mirrored
        publicationId
      }
    }
  }
`;
