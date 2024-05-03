import { gql } from "@apollo/client/core";

import { PostFragment } from "@/graphql/fragments/PostFragment";

export const GET_MEDIA_FEED = gql`
  query (
    $request: PublicationsRequest!
    $hasReactedRequest2: PublicationOperationsReactionArgs
  ) {
    publications(request: $request) {
      items {
        __typename
        ... on Post {
          ...PostFragment
          operations {
            hasReacted(request: $hasReactedRequest2)
          }
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${PostFragment}
`;
