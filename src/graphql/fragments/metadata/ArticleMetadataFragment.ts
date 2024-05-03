// graphql/fragments/metadata/ArticleMetadataFragment.ts

import { gql } from "@apollo/client";

export const ArticleMetadataFragment = gql`
  fragment ArticleMetadataFragment on ArticleMetadataV3 {
    id
    title
    appId
    locale
    content

    marketplace {
      description
      externalURL
      name
      attributes {
        displayType
        traitType
        value
      }
      image {
        optimized {
          mimeType
          width
          height
          uri
        }
        raw {
          mimeType
          width
          height
          uri
        }
      }
      animationUrl
    }

    attachments {
      ... on PublicationMetadataMediaVideo {
        altTag
        attributes {
          type
          key
          value
        }
        cover {
          optimized {
            mimeType
            width
            height
            uri
          }
        }
        video {
          optimized {
            mimeType
            uri
          }
        }
      }
      ... on PublicationMetadataMediaImage {
        altTag
        attributes {
          type
          key
          value
        }
        image {
          optimized {
            height
            mimeType
            uri
            width
          }
        }
      }
      ... on PublicationMetadataMediaAudio {
        artist
        audio {
          optimized {
            mimeType
            uri
          }
          raw {
            mimeType
            uri
          }
        }
        cover {
          optimized {
            mimeType
            width
            height
            uri
          }
        }
        attributes {
          type
          key
          value
        }
      }
    }
  }
`;
