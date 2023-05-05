import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
  Observable,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import {
  getAuthenticationToken,
  getRefreshToken,
  setAuthenticationToken,
} from "@/lib/auth/state";
import jwt_decode from "jwt-decode";

import { refreshAuth } from "@/queries/auth/refresh";
import { LENS_API_URL } from "@/lib/constants";

type DecodedType = {
  exp: number;
  iat: number;
  id: string;
  role: string;
};

const httpLink = new HttpLink({ uri: LENS_API_URL });

const tokenRefreshLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    (async () => {
      const token = getAuthenticationToken() as string;
      const refreshToken = getRefreshToken() as string;
      const decoded: DecodedType | null = token
        ? (jwt_decode(token) as DecodedType)
        : null;

      if (decoded && decoded.exp < Date.now() / 1000) {
        try {
          const res = await refreshAuth(refreshToken);
          const newToken = res?.data?.refresh?.accessToken;

          if (newToken) {
            setAuthenticationToken({ token: res.data.refresh });
            operation.setContext(({ headers = {} }) => ({
              headers: {
                ...headers,
                "x-access-token": `Bearer ${newToken}`,
              },
            }));
          }
        } catch (error) {
          console.error("%c Error refreshing token:", `color: red;`, error);
        }
      }

      forward(operation).subscribe({
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      });
    })();
  });
});

const authLink = new ApolloLink((operation, forward) => {
  const token = getAuthenticationToken() as string;

  if (token) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        "x-access-token": `Bearer ${token}`,
      },
    }));
  }

  return forward(operation);
});

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, path }) =>
      console.log(
        `%c[GraphQL ERROR]: Message: ${message}. Path: ${path}. `,
        `color: red; background: yellow;`
      )
    );
  }
});

export const apolloClient = () => {
  const apolloClient = new ApolloClient({
    link: from([errorLink, tokenRefreshLink, authLink.concat(httpLink)]),
    uri: LENS_API_URL,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            explorePublications: lensPagination(["request", ["sortCriteria"]]),
            publications: lensPagination([
              "request",
              ["profileId", "publicationTypes", "commentsOf"],
            ]),
            followers: lensPagination(["request", ["profileId"]]),
            following: lensPagination(["request", ["address"]]),
          },
        },
      },
    }),
  });
  return apolloClient;
};

const lensPagination = (keyArgs: any) => {
  return {
    keyArgs: [keyArgs],
    merge(existing: any, incoming: any) {
      if (!existing) {
        return incoming;
      }
      const existingItems = existing.items;
      const incomingItems = incoming.items;

      return {
        items: existingItems.concat(incomingItems),
        pageInfo: incoming.pageInfo,
      };
    },
  };
};
