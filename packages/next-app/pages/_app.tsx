import "../styles/globals.css";
import type { AppProps } from "next/app";

// Imports
import { chain, createClient, configureChains, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
  Theme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";

import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib";

import { ThemeProvider } from "next-themes";

import { AppLayout } from "@/components/layout";

import { ENV_PROD, ENV_DEV } from "@/lib/constants";

// Get environment variables
// const infuraId = process.env.NEXT_PUBLIC_INFURA_ID as string;
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID as string;

const networks = [];
if (ENV_PROD) {
  networks.push(chain.polygon);
}

if (ENV_DEV) {
  networks.push(chain.polygonMumbai);
}

const { chains, provider } = configureChains(
  // [chain.polygon, chain.polygonMumbai],
  networks,
  [alchemyProvider({ alchemyId }), publicProvider()]
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
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={customTheme}>
        <ApolloProvider client={apolloClient()}>
          {/* <ThemeProvider defaultTheme="light" attribute="class"> */}
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
          {/* </ThemeProvider> */}
        </ApolloProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
