import { gql } from "@apollo/client";

import { ProfileFragmentLite } from "./ProfileFragmentLite";
import { MediaFieldsFragment } from "./MediaFieldsFragment";

export const PostPostFragment = gql`
  fragment PostPostFragment on Post {
    id

    profile {
      ...ProfileFragmentLite
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
  ${ProfileFragmentLite}
  ${MediaFieldsFragment}
`;
