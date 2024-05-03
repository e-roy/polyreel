import { gql } from "@apollo/client";

import { PostFragment } from "@/graphql/fragments/PostFragment";
import { CommentFragment } from "@/graphql/fragments/CommentFragment";
import { QuoteFragment } from "@/graphql/fragments/QuoteFragment";
import { ProfileFragmentLite } from "@/graphql/fragments/ProfileFragmentLite";

export const MirrorFragment = gql`
  fragment MirrorFragment on Mirror {
    id
    publishedOn {
      id
    }
    createdAt
    by {
      ...ProfileFragmentLite
    }
    mirrorOn {
      ... on Post {
        ...PostFragment
      }
      ... on Comment {
        ...CommentFragment
      }
      ... on Quote {
        ...QuoteFragment
      }
    }
  }
  ${PostFragment}
  ${CommentFragment}
  ${QuoteFragment}
  ${ProfileFragmentLite}
`;
