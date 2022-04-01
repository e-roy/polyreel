import { gql } from "@apollo/client";

import { PostProfileFragment } from "./PostProfileFragment";
import { MediaFieldsFragment } from "./MediaFieldsFragment";

export const PostPostFragment = gql`
  fragment PostPostFragment on Post {
    id

    profile {
      ...PostProfileFragment
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
    appId
  }
  ${PostProfileFragment}
  ${MediaFieldsFragment}
`;
