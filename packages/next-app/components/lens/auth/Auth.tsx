import React from "react";
import { useAccount, useSignMessage } from "wagmi";
import { generateChallenge, authenticate } from "@/lib/auth/login";
import { setAuthenticationToken } from "@/lib/auth/state";
import { Button } from "@/components/elements";

export const Auth = () => {
  const [{ data: accountData }] = useAccount();
  const [{}, signMessage] = useSignMessage();

  const handleLogin = async () => {
    console.log("login component");

    const challenge = await generateChallenge(accountData?.address as string);
    // console.log(challenge.data);
    if (!challenge) return;
    const signature = await signMessage({
      message: challenge.data.challenge.text,
    });
    // console.log(accountData?.address);
    // console.log(signature.data);
    const accessTokens = await authenticate(
      accountData?.address as string,
      signature.data as string
    );
    // console.log(accessTokens);
    setAuthenticationToken({ token: accessTokens.data.authenticate });
  };

  return (
    <div>
      <Button className="" onClick={() => handleLogin()}>
        get token
      </Button>
    </div>
  );
};
