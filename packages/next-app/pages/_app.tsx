import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Connector, Provider, chain, defaultChains } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { WalletLinkConnector } from "wagmi/connectors/walletLink";
import { providers } from "ethers";

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
type ConnectorsConfig = { chainId?: number };
const connectors = ({ chainId }: ConnectorsConfig) => {
  const rpcUrl =
    chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    defaultChain.rpcUrls[0];
  return [
    new InjectedConnector({ chains }),
    // new WalletConnectConnector({
    //   chains,
    //   options: {
    //     infuraId,
    //     qrcode: true,
    //   },
    // }),
    // new WalletLinkConnector({
    //   chains,
    //   options: {
    //     appName: 'create-web3-frontend',
    //     jsonRpcUrl: `${rpcUrl}/${infuraId}`,
    //   },
    // }),
  ];
};

// Set up providers
type ProviderConfig = { chainId?: number; connector?: Connector };
const isChainSupported = (chainId?: number) =>
  chains.some((x) => x.id === chainId);

const provider = ({ chainId }: ProviderConfig) =>
  providers.getDefaultProvider(
    isChainSupported(chainId) ? chainId : defaultChain.id,
    {
      alchemyId,
      infuraId,
    }
  );
const webSocketProvider = ({ chainId }: ProviderConfig) =>
  isChainSupported(chainId)
    ? new providers.AlchemyWebSocketProvider(chainId, infuraId)
    : undefined;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider
      autoConnect
      connectors={connectors}
      provider={provider}
      webSocketProvider={webSocketProvider}
    >
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
