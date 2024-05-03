"use client";

import { useState } from "react";
import { Button } from "@/components/elements/Button";

import { useSignTypedData, useAccount, useWriteContract } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import { useMutation } from "@apollo/client";
import { CREATE_FOLLOW_TYPED_DATA } from "@/graphql/follow/follow";

import { LensHub } from "@/abis/LensHub";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

import { CreateFollowBroadcastItemResult } from "@/types/graphql/generated";

interface FollowArgs {
  followerProfileId: string;
  idsOfProfilesToFollow: string[];
  followTokenIds: string[];
  datas: string[];
  signature: {
    signer: string;
    v: number;
    r: string;
    s: string;
    deadline: string;
  };
}

type FollowProfileButtonProps = {
  profileId: string;
  refetch: () => void;
};

export const FollowProfileButton = ({
  profileId,
  refetch,
}: FollowProfileButtonProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: (error: Error) => {
        console.error("Error writing contract:", error);
        setIsUpdating(false);
      },
      onSettled: () => {
        setIsUpdating(false);
        refetch();
      },
    },
  });

  const write = async (args: FollowArgs) => {
    const res = await writeContractAsync({
      address: LENS_HUB_PROXY_ADDRESS,
      abi: LensHub,
      functionName: "follow",
      args: [
        args.followerProfileId,
        args.idsOfProfilesToFollow,
        args.followTokenIds,
        args.datas,
      ],
    });
    return res;
  };

  const [createFollowTypedData] = useMutation<{
    createFollowTypedData: CreateFollowBroadcastItemResult;
  }>(CREATE_FOLLOW_TYPED_DATA, {
    onCompleted({ createFollowTypedData }) {
      if (!createFollowTypedData) {
        console.error("createFollow is null");
        return;
      }

      const { typedData } = createFollowTypedData;

      if (!typedData) {
        console.error("typedData is undefined");
        return;
      }

      signTypedDataAsync({
        domain: omit(typedData.domain, "__typename"),
        types: omit(typedData.types, "__typename"),
        primaryType: "Follow",
        message: omit(typedData.value, "__typename"),
      }).then((res) => {
        const { v, r, s } = splitSignature(res);

        const followArgs: FollowArgs = {
          followerProfileId: typedData.value.followerProfileId,
          idsOfProfilesToFollow: typedData.value.idsOfProfilesToFollow,
          followTokenIds: typedData.value.followTokenIds,
          datas: typedData.value.datas,
          signature: {
            signer: address!,
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          },
        };

        write(followArgs)
          .then(() => {
            console.log("Followed successfully");
            refetch();
          })
          .catch((error) => {
            console.error("Error following:", error);
          });
      });
    },
    onError(error) {
      console.error("Error creating follow typed data:", error);
    },
  });

  const handleFollow = async () => {
    setIsUpdating(true);
    createFollowTypedData({
      variables: {
        request: {
          follow: [{ profileId }],
        },
      },
    });
  };

  return (
    <Button
      variant={`follow`}
      className={`bg-stone-800 hover:bg-stone-700 text-white`}
      onClick={handleFollow}
      disabled={isUpdating}
      type={`button`}
    >
      {isUpdating ? "UPDATING" : "FOLLOW"}
    </Button>
  );
};
