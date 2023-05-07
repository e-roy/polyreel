export const ENV_PROD = process.env.NODE_ENV === "production";
export const ENV_DEV = process.env.NODE_ENV === "development";

export const LOCAL_MAINNET_TESTING = false;

export const CURRENT_CHAIN_ID: number =
  ENV_PROD || LOCAL_MAINNET_TESTING ? 137 : 80001;
export const CURRENT_CHAIN_NAME =
  ENV_PROD || LOCAL_MAINNET_TESTING ? "Polygon" : "Polygon Mumbai";

export const LENS_API_URL =
  ENV_PROD || LOCAL_MAINNET_TESTING
    ? "https://api.lens.dev"
    : "https://api-mumbai.lens.dev/";

export const LENS_HUB_PROXY_ADDRESS =
  ENV_PROD || LOCAL_MAINNET_TESTING
    ? "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"
    : "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82";

export const LENS_PERIPHERY_CONTRACT =
  ENV_PROD || LOCAL_MAINNET_TESTING
    ? "0xeff187b4190E551FC25a7fA4dFC6cf7fDeF7194f"
    : "0xD5037d72877808cdE7F669563e9389930AF404E8";
