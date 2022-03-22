export const addressShorten = (address: string) => {
  if (
    address.includes(".eth") ||
    address === "" ||
    address === "Not connected"
  ) {
    return address;
  } else {
    return `${address.substring(0, 4)}...${address.substring(
      address.length - 4
    )}`.toLowerCase();
  }
};
