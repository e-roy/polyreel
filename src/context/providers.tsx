"use client";
import { WagmiProvider, http } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { type Chain } from "viem";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Theme, lightTheme } from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";

import { UserProvider } from "@/context/UserContext/UserProvider";

import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apollo-client";

import { ThemeProvider } from "next-themes";

import {
  createReactClient,
  LivepeerConfig,
  studioProvider,
} from "@livepeer/react";

import { AppLayout } from "@/components/layout/AppLayout";

import { ENV_PROD, ENV_DEV, LOCAL_MAINNET_TESTING } from "@/lib/constants";

import { useIsMounted } from "@/hooks/useIsMounted";
import { useMemo } from "react";

export const amoy_testnet = {
  id: 80002,
  name: "Amoy Testnet",
  nativeCurrency: { name: "Amoy", symbol: "MATIC", decimals: 18 },
  rpcUrls: {
    default: { http: [" https://rpc-amoy.polygon.technology/"] },
  },
  blockExplorers: {
    default: { name: "Oklink", url: "https://www.oklink.com/amoy" },
  },
  testnet: true,
} as const satisfies Chain;

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

export const config = getDefaultConfig({
  appName: "Polyreel",
  projectId: "YOUR_PROJECT_ID",
  chains: [polygon, amoy_testnet],
  ssr: true,
  transports: {
    [polygon.id]: http(),
    [amoy_testnet.id]: http(),
  },
});

const customTheme: Theme = merge(lightTheme(), {
  colors: {
    accentColor: "#075985",
  },
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
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

  const queryClient = new QueryClient();

  if (!isMounted) return null;

  return (
    <>
      <ThemeProvider defaultTheme="light" attribute="class">
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider coolMode theme={customTheme}>
              <LivepeerConfig
                //   dehydratedState={pageProps?.dehydratedState}
                client={livepeerClient}
              >
                <ApolloProvider client={apolloClient()}>
                  <UserProvider>
                    <AppLayout>{children}</AppLayout>
                  </UserProvider>
                </ApolloProvider>
              </LivepeerConfig>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </>
  );
};
