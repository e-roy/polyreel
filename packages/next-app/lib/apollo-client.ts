import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import {
  getAuthenticationToken,
  checkAuthenticationToken,
} from "@/lib/auth/state";

const httpLink = new HttpLink({ uri: "https://api-mumbai.lens.dev/" });

const APIURL = "https://api-mumbai.lens.dev/";

const authLink = new ApolloLink((operation, forward) => {
  // const token = getAuthenticationToken();
  // if (!token) return null;

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      "x-access-token": getAuthenticationToken()
        ? `Bearer ${getAuthenticationToken()}`
        : "",
    },
  });
  // Call the next link in the middleware chain.
  return forward(operation);
});

export const apolloClient = () => {
  const apolloClient = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
  });
  const apolloClientAuth = new ApolloClient({
    link: authLink.concat(httpLink),
    uri: APIURL,
    cache: new InMemoryCache(),
  });

  // try {
  //   const check = checkAuthenticationToken();
  //   // console.log(check);
  // } catch (error) {
  //   console.log(error);
  // }

  if (getAuthenticationToken()) {
    console.log("Authenticated");
    return apolloClientAuth;
  } else {
    console.log("Not Authenticated");
    return apolloClient;
  }
};
