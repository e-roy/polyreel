"use client";

import "./globals.css";

import { createClient, configureChains, WagmiConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
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

import {
  createReactClient,
  LivepeerConfig,
  studioProvider,
} from "@livepeer/react";

import { AppLayout } from "@/components/layout";

import { ENV_PROD, ENV_DEV, LOCAL_MAINNET_TESTING } from "@/lib/constants";

import { useIsMounted } from "@/hooks/useIsMounted";
import { useMemo } from "react";

const liverpeerKey = process.env.NEXT_PUBLIC_LIVEPEER_API as string;
const networks = [];

if (ENV_PROD) {
  networks.push(polygon);
}

if (ENV_DEV && !LOCAL_MAINNET_TESTING) {
  networks.push(polygonMumbai);
} else if (ENV_DEV && LOCAL_MAINNET_TESTING) {
  networks.push(polygon);
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMounted = useIsMounted();
  const livepeerClient = useMemo(
    () =>
      createReactClient({
        provider: studioProvider({
          apiKey: liverpeerKey,
        }),
      }),
    []
  );

  return (
    <html lang="en">
      <body>
        {isMounted && (
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains} theme={customTheme}>
              <LivepeerConfig
                //   dehydratedState={pageProps?.dehydratedState}
                client={livepeerClient}
              >
                <ApolloProvider client={apolloClient()}>
                  <UserProvider>
                    <ThemeProvider defaultTheme="light" attribute="class">
                      <AppLayout>{children}</AppLayout>
                    </ThemeProvider>
                  </UserProvider>
                </ApolloProvider>
              </LivepeerConfig>
            </RainbowKitProvider>
          </WagmiConfig>
        )}
      </body>
    </html>
  );
}
