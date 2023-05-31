"use client";

import { useState } from "react";
import { Button } from "@/components/elements";
import { ethers } from "ethers";

import { useSignTypedData, useSigner } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import { useMutation } from "@apollo/client";
import { CREATE_UNFOLLOW_TYPED_DATA } from "@/graphql/follow/unfollow";

import LENS_FOLLOW_NFT_ABI from "@/abis/Lens-follow";

type UnFollowProfileButtonProps = {
  profileId: string;
  refetch: () => void;
};

export const UnFollowProfileButton = ({
  profileId,
  refetch,
}: UnFollowProfileButtonProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const { signTypedDataAsync } = useSignTypedData();
  const { data: signerData } = useSigner();

  const [createUnfollowTypedData, {}] = useMutation(
    CREATE_UNFOLLOW_TYPED_DATA,
    {
      onCompleted({ createUnfollowTypedData }: any) {
        if (!createUnfollowTypedData) console.log("createUnFollow is null");

        const { typedData } = createUnfollowTypedData;
        const { tokenId } = typedData?.value;
        const { verifyingContract } = typedData?.domain;

        signTypedDataAsync({
          domain: omit(typedData?.domain, "__typename"),
          types: omit(typedData?.types, "__typename"),
          value: omit(typedData?.value, "__typename"),
        }).then((res) => {
          const { v, r, s } = splitSignature(res);
          const followContract = new ethers.Contract(
            verifyingContract,
            LENS_FOLLOW_NFT_ABI,
            signerData as ethers.Signer
          );
          const sig = {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          };
          const excuteContract = async () => {
            const tx = await followContract.burnWithSig(tokenId, sig);
            tx.wait(1)
              .then(() => {
                refetch();
                setIsUpdating(false);
              })
              .catch((error: any) => {
                console.log(error);
                setIsUpdating(false);
              });
          };
          return excuteContract();
        });
      },
    }
  );

  const handleUnFollow = async () => {
    setIsUpdating(true);
    createUnfollowTypedData({
      variables: {
        request: {
          profile: profileId,
        },
      },
    });
  };

  if (isUpdating) {
    return (
      <Button variant={`follow`} disabled>
        Updating...
      </Button>
    );
  }

  return (
    <Button
      variant={`follow`}
      className={`hover:text-red-600 hover:border-red-500`}
      onClick={() => handleUnFollow()}
    >
      unfollow
    </Button>
  );
};
