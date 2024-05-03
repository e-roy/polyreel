import { gql } from "@apollo/client/core";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { getAuthenticationToken } from "./state";
import { LENS_API_URL } from "@/lib/constants";

const apolloClient = new ApolloClient({
  uri: LENS_API_URL,
  cache: new InMemoryCache(),
});

export const GET_CHALLENGE = gql`
  query ($request: ChallengeRequest!) {
    challenge(request: $request) {
      id
      text
    }
  }
`;

export const generateChallenge = (address: string, id: string) => {
  return apolloClient.query({
    query: GET_CHALLENGE,
    variables: {
      request: {
        signedBy: address,
        for: id,
      },
    },
  });
};

export const AUTHENTICATION = gql`
  mutation ($request: SignedAuthChallenge!) {
    authenticate(request: $request) {
      accessToken
      identityToken
      refreshToken
    }
  }
`;

export const authenticate = (challengeId: string, signature: string) => {
  return apolloClient.mutate({
    mutation: AUTHENTICATION,
    variables: {
      request: {
        id: challengeId,
        signature,
      },
    },
  });
};

export const login = async (address: string) => {
  if (getAuthenticationToken()) {
    console.log("login: already logged in");
    return;
  }
};
