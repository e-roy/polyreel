import React from "react";
import { useAccount, useSignMessage } from "wagmi";
import { generateChallenge, authenticate } from "@/lib/auth/login";
import { setAuthenticationToken } from "@/lib/auth/state";
import { Button } from "@/components/elements";

type AuthProps = {
  userLoggedIn: () => void;
};

export const Auth = ({ userLoggedIn }: AuthProps) => {
  const { data: accountData } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const handleLogin = async () => {
    const challenge = await generateChallenge(accountData?.address as string);
    if (!challenge) return;
    const signature = await signMessageAsync({
      message: challenge.data.challenge.text,
    });

    const accessTokens = await authenticate(
      accountData?.address as string,
      signature as string
    );

    setAuthenticationToken({ token: accessTokens.data.authenticate });
    userLoggedIn();
  };

  return (
    <div>
      <Button
        className="text-2xl font-bold py-2 px-4"
        onClick={() => handleLogin()}
      >
        Login
      </Button>
    </div>
  );
};
