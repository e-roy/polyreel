import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import {
  getAuthenticationToken,
  getRefreshToken,
  setAuthenticationToken,
} from "@/lib/auth/state";
import jwt_decode from "jwt-decode";

import { refreshAuth } from "@/queries/auth/refresh";

type decodedType = {
  exp: number;
  iat: number;
  id: string;
  role: string;
};
let decoded: decodedType;

const APIURL = "https://api-mumbai.lens.dev/";
const httpLink = new HttpLink({ uri: APIURL });

const authLink = new ApolloLink((operation, forward) => {
  const token = getAuthenticationToken() as string;
  const refreshToken = getRefreshToken() as string;
  if (token) decoded = jwt_decode(token as string);
  // console.log(decoded);
  // if (!token) return null;

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      "x-access-token": token ? `Bearer ${token}` : "",
    },
  });
  // console.log(decoded.exp);
  // console.log(Date.now() / 1000);

  if (token && decoded.exp < Date.now() / 1000) {
    // console.log("token is expired");
    refreshAuth(refreshToken).then((res) => {
      // console.log("refreshAuth");
      // console.log(res.data.refresh);
      operation.setContext({
        headers: {
          "x-access-token": token
            ? `Bearer ${res.data.refresh.accessToken}`
            : "",
        },
      });
      setAuthenticationToken({ token: res.data.refresh });
    });
  }

  // Call the next link in the middleware chain.
  return forward(operation);
});

export const apolloClient = () => {
  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    uri: APIURL,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            explorePublications: {
              keyArgs: [],
              merge(existing, incoming) {
                if (!existing) return incoming;
                return {
                  items: existing.items.concat(incoming.items),
                  pageInfo: incoming.pageInfo,
                };
              },
            },
            followers: {
              keyArgs: [],
              merge(existing, incoming) {
                if (!existing) return incoming;
                return {
                  items: existing.items.concat(incoming.items),
                  pageInfo: incoming.pageInfo,
                };
              },
            },
            following: {
              keyArgs: [],
              merge(existing, incoming) {
                if (!existing) return incoming;
                return {
                  items: existing.items.concat(incoming.items),
                  pageInfo: incoming.pageInfo,
                };
              },
            },
          },
        },
      },
    }),
  });
  return apolloClient;
};
