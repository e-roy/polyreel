import { gql } from "@apollo/client";

import { PostFragment } from "@/graphql/fragments/PostFragment";
import { QuoteFragment } from "@/graphql/fragments/QuoteFragment";

export const EXPLORE_PUBLICATIONS = gql`
  query (
    $request: ExplorePublicationRequest!
    $hasReactedRequest2: PublicationOperationsReactionArgs
  ) {
    explorePublications(request: $request) {
      items {
        __typename
        ... on Post {
          ...PostFragment
          operations {
            hasReacted(request: $hasReactedRequest2)
          }
        }
        ... on Quote {
          ...QuoteFragment
          operations {
            hasReacted(request: $hasReactedRequest2)
          }
        }
      }
      pageInfo {
        next
        prev
      }
    }
  }
  ${PostFragment}
  ${QuoteFragment}
`;
