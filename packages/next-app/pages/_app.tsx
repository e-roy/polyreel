import "../styles/globals.css";
import type { AppProps } from "next/app";

// Imports
import { createClient, configureChains, WagmiConfig } from "wagmi";
import { mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
  Theme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";

import { UserProvider } from "@/context";

import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib";

import { ThemeProvider } from "next-themes";

import { AppLayout } from "@/components/layout";

import { ENV_PROD, ENV_DEV } from "@/lib/constants";

import { useIsMounted } from "@/hooks/useIsMounted";

// Get environment variables
// const infuraId = process.env.NEXT_PUBLIC_INFURA_ID as string;
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID as string;

const networks = [];
if (ENV_PROD) {
  networks.push(polygon);
}

if (ENV_DEV) {
  networks.push(polygonMumbai);
}

const { chains, provider } = configureChains(
  // [chain.polygon, chain.polygonMumbai],
  networks,
  [publicProvider()]
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
  const isMounted = useIsMounted();

  if (!isMounted) return null;
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={customTheme}>
        <ApolloProvider client={apolloClient()}>
          <UserProvider>
            {/* <ThemeProvider defaultTheme="light" attribute="class"> */}
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
            {/* </ThemeProvider> */}
          </UserProvider>
        </ApolloProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
