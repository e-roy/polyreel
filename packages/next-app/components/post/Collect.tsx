import { useContext } from "react";
import { UserContext } from "@/components/layout";
import { CollectionIcon } from "@heroicons/react/outline";

import { useMutation } from "@apollo/client";
import { CREATE_COLLECT_TYPED_DATA } from "@/queries/publications/collect";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import LENS_ABI from "@/abis/Lens-Hub.json";

import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

export const Collect = ({ publication }: any) => {
  const { currentUser } = useContext(UserContext);

  const { stats } = publication;

  const { signTypedData, signTypedDataAsync } = useSignTypedData();
  const { write, writeAsync } = useContractWrite(
    {
      addressOrName: LENS_HUB_PROXY_ADDRESS,
      contractInterface: LENS_ABI,
    },
    "mirrorWithSig"
  );

  const [createCollectTypedData, { loading, error }] = useMutation(
    CREATE_COLLECT_TYPED_DATA,
    {
      onCompleted({ createCollectTypedData }: any) {
        const { typedData } = createCollectTypedData;
        if (!createCollectTypedData)
          console.log("createCollectTypedData is null");
        const { collector, profileId, pubId, data } = typedData?.value;

        signTypedDataAsync({
          domain: omit(typedData?.domain, "__typename"),
          types: omit(typedData?.types, "__typename"),
          value: omit(typedData?.value, "__typename"),
        }).then((res) => {
          if (res) {
            const { v, r, s } = splitSignature(res);
            const postARGS = {
              collector,
              profileId,
              pubId,
              data,
              sig: {
                v,
                r,
                s,
                deadline: typedData.value.deadline,
              },
            };
            writeAsync({ args: postARGS }).then((res: any) => {
              if (!res.error) {
                console.log(res.data);

                // reset form  and other closing actions
              } else {
                console.log(res.error);
              }
            });
          }
          console.log(res);
        });
      },
      onError(error) {
        console.log(error);
      },
    }
  );

  const handleCollect = () => {
    console.log("collect");
    createCollectTypedData({
      variables: {
        request: {
          publicationId: publication.id,
        },
      },
    });
  };

  return (
    <div className="flex ml-4 cursor-pointer" onClick={() => handleCollect()}>
      {stats.totalAmountOfMirrors}
      <CollectionIcon className="h-6 w-6 ml-2" aria-hidden="true" />
    </div>
  );
};
