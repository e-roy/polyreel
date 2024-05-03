import { gql } from "@apollo/client/core";

export const CREATE_SET_FOLLOW_MODULE_TYPED_DATA = gql`
  mutation ($request: SetFollowModuleRequest!) {
    createSetFollowModuleTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetFollowModule {
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
          followModule
          followModuleInitData
        }
      }
    }
  }
`;
