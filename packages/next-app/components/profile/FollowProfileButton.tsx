import { useState } from "react";
import { Button } from "@/components/elements";

import { useSignTypedData, useContractWrite, useAccount } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import { useMutation } from "@apollo/client";
import { CREATE_FOLLOW_TYPED_DATA } from "@/queries/follow/follow";

import LENS_ABI from "@/abis/Lens-Hub.json";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

type FollowProfileButtonProps = {
  profileId: string;
  refetch: () => void;
};

export const FollowProfileButton = ({
  profileId,
  refetch,
}: FollowProfileButtonProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: accountData } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const { writeAsync } = useContractWrite(
    {
      addressOrName: LENS_HUB_PROXY_ADDRESS,
      contractInterface: LENS_ABI,
    },
    "followWithSig"
  );
  const [createFollowTypedData, {}] = useMutation(CREATE_FOLLOW_TYPED_DATA, {
    onCompleted({ createFollowTypedData }: any) {
      if (!createFollowTypedData) console.log("createFollow is null");

      const { typedData } = createFollowTypedData;
      const { profileIds, datas } = typedData?.value;

      signTypedDataAsync({
        domain: omit(typedData?.domain, "__typename"),
        types: omit(typedData?.types, "__typename"),
        value: omit(typedData?.value, "__typename"),
      }).then((res) => {
        const { v, r, s } = splitSignature(res);
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

        writeAsync({ args: postARGS })
          .then((res) => {
            res.wait(1).then(() => {
              refetch();
              setIsUpdating(false);
            });
          })
          .catch((error) => {
            console.log("follow error");
            console.log(error);
            setIsUpdating(false);
          });
      });
    },
    onError(error) {
      console.log(error);
    },
  });

  const handleFollow = async () => {
    setIsUpdating(true);
    createFollowTypedData({
      variables: {
        request: {
          follow: { profile: profileId },
        },
      },
    });
  };

  if (isUpdating) {
    return (
      <Button className="py-2 px-4" disabled>
        Updating...
      </Button>
    );
  }

  return (
    <Button className="py-2 px-4" onClick={() => handleFollow()}>
      follow
    </Button>
  );
};
