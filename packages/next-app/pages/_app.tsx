import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider, chain, defaultChains, createClient, allChains } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";

import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib";

import { ThemeProvider } from "next-themes";

import { AppLayout } from "@/components/layout";

// Get environment variables
const infuraId = process.env.NEXT_PUBLIC_INFURA_ID as string;
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID as string;

// Pick chains
const chains = defaultChains;
const defaultChain = chain.mainnet;

// Set up connectors
const client = createClient({
  autoConnect: true,
  connectors({ chainId }) {
    const chain = chains.find((x) => x.id === chainId) ?? defaultChain;
    const rpcUrl = chain.rpcUrls.alchemy
      ? `${chain.rpcUrls.alchemy}/${alchemyId}`
      : typeof chain.rpcUrls.default === "string"
      ? chain.rpcUrls.default
      : chain.rpcUrls.default[0];
    return [
      new InjectedConnector(),
      // new CoinbaseWalletConnector({
      //   options: {
      //     appName: 'polyreel.xyz',
      //     chainId: chain.id,
      //     jsonRpcUrl: rpcUrl,
      //   },
      // }),
      // new WalletConnectConnector({
      //   options: {
      //     qrcode: true,
      //     rpc: {
      //       [chain.id]: rpcUrl,
      //     },
      //   },
      // }),
    ];
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider client={client}>
      <ApolloProvider client={apolloClient()}>
        <ThemeProvider defaultTheme="light" attribute="class">
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </ThemeProvider>
      </ApolloProvider>
    </Provider>
  );
}

export default MyApp;
