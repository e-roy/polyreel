// graphql/fragments/metadata/AudioMetadataFragment.ts

import { gql } from "@apollo/client";
import { ImageSetFragment } from "../ImageSetFragment";

export const AudioMetadataFragment = gql`
  fragment AudioMetadataFragment on AudioMetadataV3 {
    id
    appId
    title
    content
    locale
    rawURI
    marketplace {
      animationUrl
      attributes {
        displayType
        traitType
        value
      }
      description
      externalURL
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
      name
    }
    asset {
      artist
      attributes {
        type
        key
        value
      }
      audio {
        raw {
          mimeType
          uri
        }
        optimized {
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
        raw {
          mimeType
          width
          height
          uri
        }
      }
      credits
      duration
      genre
      license
      lyrics
      recordLabel
    }
  }
  ${ImageSetFragment}
`;
