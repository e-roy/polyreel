import React, { useCallback, useContext } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { generateChallenge, authenticate } from "@/lib/auth/login";
import { setAuthenticationToken } from "@/lib/auth/state";
import { UserContext } from "@/context";

type AuthProps = {
  userLoggedIn?: () => void;
};

export const Auth = ({ userLoggedIn }: AuthProps) => {
  const { refetchVerify } = useContext(UserContext);
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const handleLogin = useCallback(async () => {
    const challenge = await generateChallenge(address as string);
    if (!challenge) return;
    const signature = await signMessageAsync({
      message: challenge.data.challenge.text,
    });
    const accessTokens = await authenticate(
      address as string,
      signature as string
    );

    await setAuthenticationToken({ token: accessTokens.data.authenticate });
    refetchVerify();
    userLoggedIn && userLoggedIn();
  }, [address, signMessageAsync, userLoggedIn]);

  return (
    <button
      className="py-2 px-4 rounded-xl text-md font-bold bg-sky-800 text-white"
      onClick={handleLogin}
      type={`button`}
    >
      Login with Lens
    </button>
  );
};
