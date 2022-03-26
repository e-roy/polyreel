import { useState } from "react";
import { Button } from "@/components/elements";
import { ethers } from "ethers";

import { useSignTypedData, useSigner } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import { useMutation } from "@apollo/client";
import { CREATE_UNFOLLOW_TYPED_DATA } from "@/queries/follow/unfollow";

import LENS_FOLLOW_NFT_ABI from "@/abis/Lens-follow";

type UnFollowProfileButtonProps = {
  profileId: string;
};

export const UnFollowProfileButton = ({
  profileId,
}: UnFollowProfileButtonProps) => {
  const [txComplete, setTxComplete] = useState(false);
  const [txError, setTxError] = useState(false);
  const [{}, signTypedData] = useSignTypedData();
  const [{ data: signerData }] = useSigner();

  const [createUnfollowTypedData, {}] = useMutation(
    CREATE_UNFOLLOW_TYPED_DATA,
    {
      onCompleted({ createUnfollowTypedData }: any) {
        const { typedData } = createUnfollowTypedData;
        if (!createUnfollowTypedData) console.log("createUnFollow is null");
        const { tokenId } = typedData?.value;
        const { verifyingContract } = typedData?.domain;

        signTypedData({
          domain: omit(typedData?.domain, "__typename"),
          types: omit(typedData?.types, "__typename"),
          value: omit(typedData?.value, "__typename"),
        }).then((res) => {
          if (!res.error) {
            const { v, r, s } = splitSignature(res.data);
            const followContract = new ethers.Contract(
              verifyingContract,
              LENS_FOLLOW_NFT_ABI,
              signerData
            );
            const sig = {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            };
            const excuteContract = async () => {
              const tx = await followContract.burnWithSig(tokenId, sig);
              if (tx.hash) {
                setTxComplete(true);
              } else {
                setTxError(true);
              }
            };
            return excuteContract();
          } else {
            setTxError(true);
          }
        });
      },
    }
  );

  const handleUnFollow = async () => {
    createUnfollowTypedData({
      variables: {
        request: {
          profile: profileId,
        },
      },
    });
  };

  return (
    <>
      {!txComplete && !txError && (
        <Button className="w-30" onClick={() => handleUnFollow()}>
          unfollow
        </Button>
      )}
      {txComplete && (
        <Button className="w-30" disabled>
          success
        </Button>
      )}
      {txError && (
        <Button className="w-30" disabled>
          error
        </Button>
      )}
    </>
  );
};
