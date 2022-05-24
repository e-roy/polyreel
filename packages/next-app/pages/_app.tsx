import "../styles/globals.css";
import type { AppProps } from "next/app";

// Imports
import { chain, createClient, WagmiProvider } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";

import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
  Chain,
  Theme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";

import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib";

import { ThemeProvider } from "next-themes";

import { AppLayout } from "@/components/layout";

// Get environment variables
// const infuraId = process.env.NEXT_PUBLIC_INFURA_ID as string;
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID as string;

const { chains, provider } = configureChains(
  // [chain.polygon, chain.polygonMumbai],
  [chain.polygonMumbai],
  [apiProvider.alchemy(alchemyId), apiProvider.fallback()]
);

const { connectors } = getDefaultWallets({
  appName: "Polyreel",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const customTheme: Theme = merge(lightTheme(), {
  colors: {
    accentColor: "#075985",
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={customTheme}>
        <ApolloProvider client={apolloClient()}>
          {/* <ThemeProvider defaultTheme="light" attribute="class"> */}
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
          {/* </ThemeProvider> */}
        </ApolloProvider>
      </RainbowKitProvider>
    </WagmiProvider>
  );
}

export default MyApp;
