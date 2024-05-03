"use client";

import { useState } from "react";
import { useAccount, useSignTypedData, useWriteContract } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";
import { useMutation } from "@apollo/client";
import { CREATE_UNFOLLOW_TYPED_DATA } from "@/graphql/follow/unfollow";
import { Button } from "@/components/elements/Button";
import { LensHub } from "@/abis/LensHub";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

interface UnfollowArgs {
  unfollowerProfileId: string;
  idsOfProfilesToUnfollow: string[];
  signature: {
    signer: string;
    v: number;
    r: string;
    s: string;
    deadline: string;
  };
}

type UnFollowProfileButtonProps = {
  profileId: string;
  refetch: () => void;
};

export const UnFollowProfileButton = ({
  profileId,
  refetch,
}: UnFollowProfileButtonProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const { writeContractAsync } = useWriteContract();

  const write = async (args: UnfollowArgs) => {
    try {
      const res = await writeContractAsync({
        address: LENS_HUB_PROXY_ADDRESS,
        abi: LensHub,
        functionName: "unfollow",
        args: [args.unfollowerProfileId, args.idsOfProfilesToUnfollow],
      });
      return res;
    } catch (error) {
      console.error("Error writing contract:", error);
      throw error;
    } finally {
      setIsUpdating(false);
      refetch();
    }
  };

  const [createUnfollowTypedData] = useMutation(CREATE_UNFOLLOW_TYPED_DATA, {
    onCompleted({ createUnfollowTypedData }) {
      if (!createUnfollowTypedData) {
        console.log("createUnFollow is null");
        return;
      }
      const { typedData } = createUnfollowTypedData;

      signTypedDataAsync({
        domain: omit(typedData?.domain, "__typename"),
        types: omit(typedData?.types, "__typename"),
        primaryType: "Unfollow",
        message: omit(typedData?.value, "__typename"),
      })
        .then((res) => {
          const { v, r, s } = splitSignature(res);

          const unfollowArgs: UnfollowArgs = {
            unfollowerProfileId: typedData.value.unfollowerProfileId,
            idsOfProfilesToUnfollow: typedData.value.idsOfProfilesToUnfollow,
            signature: {
              signer: address!,
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          };

          write(unfollowArgs);
        })
        .catch((error) => {
          console.error("Error signing typed data:", error);
        });
    },
    onError(error) {
      console.error("Error creating unfollow typed data:", error);
    },
  });

  const handleUnfollow = () => {
    setIsUpdating(true);
    createUnfollowTypedData({
      variables: {
        request: {
          unfollow: profileId,
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
      onClick={handleUnfollow}
      disabled={isUpdating}
      type={`button`}
    >
      unfollow
    </Button>
  );
};
