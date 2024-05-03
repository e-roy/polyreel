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

import { refreshAuth } from "@/graphql/auth/refresh";
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

      if (decoded && decoded.exp < Date.now() / 1000)
        console.log("EXPIRED TOKEN!!!!");

      if (decoded && decoded.exp < Date.now() / 1000) {
        try {
          const res = await refreshAuth(refreshToken);
          const newToken = res?.data?.refresh?.accessToken;

          if (newToken) {
            await setAuthenticationToken({ token: res.data.refresh });
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
    ssrMode: typeof window === "undefined",
    link: from([errorLink, tokenRefreshLink, authLink.concat(httpLink)]),
    uri: LENS_API_URL,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            feed: lensPagination([
              "request",
              ["profileId", "feedEventItemTypes"],
            ]),
            explorePublications: lensPagination([
              "request",
              ["sortCriteria", "metadata"],
            ]),
            publications: lensPagination([
              "request",
              [
                "profileId",
                "collectedBy",
                "commentsOf",
                "publicationTypes",
                "metadata",
                "commentsRankingFilter",
              ],
            ]),
            followers: lensPagination(["request", ["profileId"]]),
            following: lensPagination(["request", ["address"]]),
            profiles: lensPagination([
              "request",
              ["profileIds", "ownedBy", "handles", "whoMirroredPublicationId"],
            ]),
          },
        },
      },
    }),
  });
  return apolloClient;
};

import type { FieldPolicy, StoreValue } from "@apollo/client/core";
import { PaginatedResultInfo } from "@/types/graphql/generated";

interface CursorBasedPagination<T = StoreValue> {
  items: T[];
  pageInfo: PaginatedResultInfo;
}

type SafeReadonly<T> = T extends object ? Readonly<T> : T;

const lensPagination = <T extends CursorBasedPagination>(
  keyArgs: FieldPolicy["keyArgs"]
) => {
  return {
    keyArgs,

    read(existing: SafeReadonly<T> | undefined) {
      if (!existing) {
        return existing;
      }
      const { items, pageInfo } = existing;

      return {
        ...existing,
        items,
        pageInfo: {
          ...pageInfo,
        },
      };
    },

    merge(existing: Readonly<T> | undefined, incoming: SafeReadonly<T>) {
      if (!existing) {
        return incoming;
      }
      const existingItems = existing.items ?? [];
      const incomingItems = incoming.items ?? [];

      // console.log("existing", existing);
      // console.log("incoming", incoming);
      // console.log("existingItems", existingItems);
      // console.log("incomingItems", incomingItems);

      // const filteredIncomingItems = incomingItems.filter(
      //   (incomingItem: any) =>
      //     !existingItems.some(
      //       (existingItem: any) => existingItem.id === incomingItem.id
      //     )
      // );

      return {
        ...incoming,
        items: existingItems.concat(incomingItems),
        pageInfo: incoming.pageInfo,
      };
    },
  };
};
