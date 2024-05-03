import { gql } from "@apollo/client";

export const UPDATE_PROFILE = gql`
  mutation ($request: OnchainSetProfileMetadataRequest!) {
    createOnchainSetProfileMetadataTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetProfileMetadataURI {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          metadataURI
        }
      }
    }
  }
`;
