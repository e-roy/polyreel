import { gql } from "@apollo/client/core";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { getAuthenticationToken } from "./state";
import { LENS_API_URL } from "@/lib/constants";

// const APIURL = process.env.LENS_API_URL;

const apolloClient = new ApolloClient({
  uri: LENS_API_URL,
  cache: new InMemoryCache(),
});

const GET_CHALLENGE = `
  query($request: ChallengeRequest!) {
    challenge(request: $request) { text }
  }
`;

export const generateChallenge = (address: string) => {
  // console.log(address);
  return apolloClient.query({
    query: gql(GET_CHALLENGE),
    variables: {
      request: {
        address,
      },
    },
  });
};

const AUTHENTICATION = `
  mutation($request: SignedAuthChallenge!) { 
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
 }
`;

export const authenticate = (address: string, signature: string) => {
  return apolloClient.mutate({
    mutation: gql(AUTHENTICATION),
    variables: {
      request: {
        address,
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
