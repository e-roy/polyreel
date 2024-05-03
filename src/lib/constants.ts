export const ENV_PROD = process.env.NODE_ENV === "production";
export const ENV_DEV = process.env.NODE_ENV === "development";

export const LOCAL_MAINNET_TESTING = true;

export const CURRENT_CHAIN_ID: number =
  ENV_PROD || LOCAL_MAINNET_TESTING ? 137 : 80002;
export const CURRENT_CHAIN_NAME =
  ENV_PROD || LOCAL_MAINNET_TESTING ? "Polygon" : "Amoy Testnet";

export const LENS_API_URL =
  ENV_PROD || LOCAL_MAINNET_TESTING
    ? "https://api-v2.lens.dev"
    : "https://api-v2-amoy.lens.dev";

export const LENS_HUB_PROXY_ADDRESS =
  ENV_PROD || LOCAL_MAINNET_TESTING
    ? "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"
    : "0xA2574D9DdB6A325Ad2Be838Bd854228B80215148";
