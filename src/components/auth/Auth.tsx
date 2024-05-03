"use client";
import React, { useCallback, useContext } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { generateChallenge, authenticate } from "@/lib/auth/login";
import { setAuthenticationToken } from "@/lib/auth/state";
import { UserContext } from "@/context/UserContext/UserContext";

type AuthProps = {
  userLoggedIn?: () => void;
};

type ChallengeData = {
  challenge: {
    text: string;
    id: string;
  };
};

export const Auth = ({ userLoggedIn }: AuthProps) => {
  const { refetchVerify, currentUser } = useContext(UserContext);
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const handleLogin = useCallback(async () => {
    if (!address || !currentUser?.id) return;

    const challenge = await generateChallenge(address, currentUser.id);
    const challengeData = challenge?.data as ChallengeData | undefined;

    if (!challengeData?.challenge?.text || !challengeData?.challenge?.id) {
      console.error("Invalid challenge data");
      return;
    }

    const signature = await signMessageAsync({
      message: challengeData.challenge.text,
    });

    const accessTokens = await authenticate(
      challengeData.challenge.id,
      signature
    );
    const token = accessTokens.data.authenticate;

    await setAuthenticationToken({ token });
    refetchVerify();
    userLoggedIn?.();
  }, [address, currentUser?.id, signMessageAsync, refetchVerify, userLoggedIn]);

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
