import { gql } from "@apollo/client";

export const GET_USERS_NFTS = gql`
  query ($request: NFTsRequest!) {
    nfts(request: $request) {
      items {
        name
        chainId
        collectionName
        contentURI
        contractAddress
        contractName
        description
        ercType
        originalContent {
          animatedUrl
          metaType
          uri
        }
        owners {
          address
          amount
        }
        symbol
        tokenId
      }
      pageInfo {
        prev
        next
      }
    }
  }
`;
