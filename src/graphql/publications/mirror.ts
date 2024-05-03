import { gql } from "@apollo/client/core";

export const CREATE_MIRROR_TYPED_DATA = gql`
  mutation ($request: OnchainMirrorRequest!) {
    createOnchainMirrorTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          Mirror {
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
          pointedProfileId
          pointedPubId
          referrerProfileIds
          referrerPubIds
          referenceModuleData
        }
      }
    }
  }
`;
