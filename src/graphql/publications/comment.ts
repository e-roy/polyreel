import { gql } from "@apollo/client/core";

// export const CREATE_COMMENT_TYPED_DATA = gql`
//   mutation ($request: CreatePublicCommentRequest!) {
//     createCommentTypedData(request: $request) {
//       id
//       expiresAt
//       typedData {
//         types {
//           CommentWithSig {
//             name
//             type
//           }
//         }
//         domain {
//           name
//           chainId
//           version
//           verifyingContract
//         }
//         value {
//           nonce
//           deadline
//           profileId
//           profileIdPointed
//           pubIdPointed
//           contentURI
//           referenceModuleData
//           collectModule
//           collectModuleInitData
//           referenceModule
//           referenceModuleInitData
//         }
//       }
//     }
//   }
// `;

export const CREATE_COMMENT_TYPED_DATA = gql`
  mutation ($request: OnchainCommentRequest!) {
    createOnchainCommentTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          Comment {
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
          contentURI
          pointedProfileId
          pointedPubId
          referrerProfileIds
          referrerPubIds
          referenceModuleData
          actionModules
          actionModulesInitDatas
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
`;
