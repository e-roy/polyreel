import { gql } from "@apollo/client";

import { PostPostFragment } from "../fragments/PostPostFragment";
import { PostCommentFragment } from "../fragments/PostCommentFragment";
import { PostMirrorFragment } from "../fragments/PostMirrorFragment";

export const EXPLORE_PUBLICATIONS = gql`
  query (
    $request: ExplorePublicationRequest!
    $reactionRequest: ReactionFieldResolverRequest
  ) {
    explorePublications(request: $request) {
      items {
        __typename
        ... on Post {
          ...PostPostFragment
        }
        ... on Comment {
          ...PostCommentFragment
        }
        ... on Mirror {
          ...PostMirrorFragment
        }
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
  ${PostPostFragment}
  ${PostCommentFragment}
  ${PostMirrorFragment}
`;
