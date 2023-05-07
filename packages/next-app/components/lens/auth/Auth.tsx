import React from "react";
import { useAccount, useSignMessage } from "wagmi";
import { generateChallenge, authenticate } from "@/lib/auth/login";
import { setAuthenticationToken } from "@/lib/auth/state";

type AuthProps = {
  userLoggedIn?: () => void;
};

export const Auth = ({ userLoggedIn }: AuthProps) => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const handleLogin = async () => {
    const challenge = await generateChallenge(address as string);
    if (!challenge) return;
    const signature = await signMessageAsync({
      message: challenge.data.challenge.text,
    });
    const accessTokens = await authenticate(
      address as string,
      signature as string
    );

    setAuthenticationToken({ token: accessTokens.data.authenticate });
    userLoggedIn && userLoggedIn();
  };

  return (
    <button
      className="py-2 px-4 rounded-xl text-md font-bold bg-sky-800 text-white"
      onClick={() => handleLogin()}
      type={`button`}
    >
      Login with Lens
    </button>
  );
};
