import { useState } from "react";
import { Button } from "@/components/elements";

import { useSignTypedData, useContractWrite, useAccount } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import { useMutation } from "@apollo/client";
import { CREATE_FOLLOW_TYPED_DATA } from "@/queries/follow/follow";

import LENS_ABI from "@/abis/Lens.json";
const LENS_CONTRACT = "0xd7B3481De00995046C7850bCe9a5196B7605c367";

type FollowProfileButtonProps = {
  profileId: string;
};

export const FollowProfileButton = ({
  profileId,
}: FollowProfileButtonProps) => {
  const [txComplete, setTxComplete] = useState(false);
  const [txError, setTxError] = useState(false);
  const [{ data: accountData }] = useAccount();
  const [{}, signTypedData] = useSignTypedData();

  const [{}, write] = useContractWrite(
    {
      addressOrName: LENS_CONTRACT,
      contractInterface: LENS_ABI,
    },
    "followWithSig"
  );
  const [createFollowTypedData, {}] = useMutation(CREATE_FOLLOW_TYPED_DATA, {
    onCompleted({ createFollowTypedData }: any) {
      const { typedData } = createFollowTypedData;
      if (!createFollowTypedData) console.log("createFollow is null");
      const { profileIds, datas } = typedData?.value;

      signTypedData({
        domain: omit(typedData?.domain, "__typename"),
        types: omit(typedData?.types, "__typename"),
        value: omit(typedData?.value, "__typename"),
      }).then((res) => {
        if (!res.error) {
          const { v, r, s } = splitSignature(res.data);
          const postARGS = {
            follower: accountData?.address,
            profileIds,
            datas,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          };
          write({ args: postARGS }).then((res) => {
            if (!res.error) {
              setTxComplete(true);
            } else {
              setTxError(true);
            }
          });
        }
        // console.log(res);
      });
    },
  });

  const handleFollow = async () => {
    createFollowTypedData({
      variables: {
        request: {
          follow: { profile: profileId },
        },
      },
    });
  };

  return (
    <>
      {!txComplete && !txError && (
        <Button className="w-30" onClick={() => handleFollow()}>
          follow
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
