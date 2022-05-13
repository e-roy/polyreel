import { gql } from "@apollo/client";

import { ProfileFragmentLite } from "./ProfileFragmentLite";
import { PostPostFragment } from "./PostPostFragment";
import { MediaFieldsFragment } from "./MediaFieldsFragment";

export const PostMirrorFragment = gql`
  fragment PostMirrorFragment on Mirror {
    id

    profile {
      ...ProfileFragmentLite
    }
    mirrorOf {
      ... on Post {
        ...PostPostFragment
        profile {
          ...ProfileFragmentLite
        }
      }
      ... on Comment {
        id
        mainPost {
          ... on Post {
            id
          }
        }
        profile {
          ...ProfileFragmentLite
        }
      }
    }

    metadata {
      name
      description
      content
      image
      media {
        original {
          ...MediaFieldsFragment
        }
      }
    }

    stats {
      totalAmountOfMirrors
      totalAmountOfCollects
      totalAmountOfComments
    }
    createdAt
  }
  ${ProfileFragmentLite}
  ${PostPostFragment}
  ${MediaFieldsFragment}
`;
