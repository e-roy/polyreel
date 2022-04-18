import { gql } from "@apollo/client";

export const UPDATE_PROFILE = gql`
  mutation ($request: CreatePublicSetProfileMetadataURIRequest!) {
    createSetProfileMetadataTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetProfileMetadataURIWithSig {
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
          metadata
        }
      }
    }
  }
`;

// old update profile

// export const UPDATE_PROFILE = gql`
//   mutation ($request: UpdateProfileRequest!) {
//     updateProfile(request: $request) {
//       id
//       name
//       location
//       website
//       twitter
//       bio
//     }
//   }
// `;
