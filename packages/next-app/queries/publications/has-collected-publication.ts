import { gql } from "@apollo/client/core";

export const HAS_COLLECTED = gql`
  query ($request: HasCollectedRequest!) {
    hasCollected(request: $request) {
      walletAddress
      results {
        collected
        publicationId
        collectedTimes
      }
    }
  }
`;
