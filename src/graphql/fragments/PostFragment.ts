import { gql } from "@apollo/client";

import { ProfileFragmentLite } from "./ProfileFragmentLite";
import { VideoMetadataFragment } from "./metadata/VideoMetadataFragment";
import { ImageMetadataFragment } from "./metadata/ImageMetadataFragment";
import { TextOnlyMetadata } from "./metadata/TextOnlyMetadata";
import { AudioMetadataFragment } from "./metadata/AudioMetadataFragment";
import { ArticleMetadataFragment } from "./metadata/ArticleMetadataFragment";

export const PostFragment = gql`
  fragment PostFragment on Post {
    id

    by {
      ...ProfileFragmentLite
    }

    metadata {
      ... on VideoMetadataV3 {
        ...VideoMetadataFragment
      }
      ... on ImageMetadataV3 {
        ...ImageMetadataFragment
      }
      ... on AudioMetadataV3 {
        ...AudioMetadataFragment
      }
      ... on ArticleMetadataV3 {
        ...ArticleMetadataFragment
      }
      ... on EventMetadataV3 {
        id
        appId
        title
      }
      ... on LinkMetadataV3 {
        id
        appId
      }
      ... on EmbedMetadataV3 {
        id
        appId
      }
      ... on CheckingInMetadataV3 {
        id
        appId
      }
      ... on TextOnlyMetadataV3 {
        ...TextOnlyMetadata
      }
      ... on ThreeDMetadataV3 {
        id
        appId
      }
      ... on StoryMetadataV3 {
        id
        appId
      }
      ... on TransactionMetadataV3 {
        id
        appId
      }
      ... on MintMetadataV3 {
        id
        appId
      }
      ... on SpaceMetadataV3 {
        id
        appId
      }
      ... on LiveStreamMetadataV3 {
        id
        appId
      }
    }

    stats {
      id
      comments
      bookmarks
      mirrors
      quotes
      countOpenActions
      reactions
    }
    createdAt
    publishedOn {
      id
    }
  }
  ${ProfileFragmentLite}
  ${VideoMetadataFragment}
  ${ImageMetadataFragment}
  ${TextOnlyMetadata}
  ${AudioMetadataFragment}
  ${ArticleMetadataFragment}
`;
