import { gql } from "@apollo/client";

import { ProfileFragment } from "./ProfileFragment";
import { MediaFieldsFragment } from "./MediaFieldsFragment";

export const PostPostFragment = gql`
  fragment PostPostFragment on Post {
    id

    profile {
      ...ProfileFragment
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
  ${ProfileFragment}
  ${MediaFieldsFragment}
`;
