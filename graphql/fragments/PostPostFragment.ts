import { gql } from "@apollo/client";

import { ProfileFragmentLite } from "./ProfileFragmentLite";
import { MediaFieldsFragment } from "./MediaFieldsFragment";
import { CollectFragmentLite } from "./CollectFragmentLite";

export const PostPostFragment = gql`
  fragment PostPostFragment on Post {
    id

    profile {
      ...ProfileFragmentLite
    }
    reaction(request: $reactionRequest)

    mirrors(by: $profileId)
    canComment(profileId: $profileId) {
      result
    }
    canMirror(profileId: $profileId) {
      result
    }
    canDecrypt(profileId: $profileId) {
      result
      reasons
    }

    metadata {
      name
      description
      content
      image
      attributes {
        displayType
        traitType
        value
      }
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
      totalDownvotes
      totalUpvotes
    }
    collectModule {
      ...CollectFragmentLite
    }
    hasCollectedByMe
    createdAt
    hidden
    appId
  }
  ${ProfileFragmentLite}
  ${MediaFieldsFragment}
  ${CollectFragmentLite}
`;
