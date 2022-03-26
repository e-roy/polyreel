import { useContext } from "react";
import { UserContext } from "@/components/layout";
import { CollectionIcon } from "@heroicons/react/outline";

import { useMutation } from "@apollo/client";
import { CREATE_COLLECT_TYPED_DATA } from "@/queries/publications/collect";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import LENS_ABI from "@/abis/Lens.json";
const LENS_CONTRACT = "0xd7B3481De00995046C7850bCe9a5196B7605c367";

export const Collect = ({ publication }: any) => {
  const { currentUser } = useContext(UserContext);

  const { stats } = publication;

  const [{ data: signData }, signTypedData] = useSignTypedData();
  const [
    { data, error: writeContractError, loading: writeContractLoading },
    write,
  ] = useContractWrite(
    {
      addressOrName: LENS_CONTRACT,
      contractInterface: LENS_ABI,
    },
    "mirrorWithSig"
  );

  const [createMirrorTypedData, { loading, error }] = useMutation(
    CREATE_COLLECT_TYPED_DATA,
    {
      onCompleted({ createMirrorTypedData }: any) {
        const { typedData } = createMirrorTypedData;
        if (!createMirrorTypedData)
          console.log("createMirrorTypedData is null");
        const { collector, profileId, pubId, data } = typedData?.value;

        signTypedData({
          domain: omit(typedData?.domain, "__typename"),
          types: omit(typedData?.types, "__typename"),
          value: omit(typedData?.value, "__typename"),
        }).then((res) => {
          if (!res.error) {
            const { v, r, s } = splitSignature(res.data);
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
            write({ args: postARGS }).then((res) => {
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

  const handleMirror = () => {
    console.log("mirror");
    createMirrorTypedData({
      variables: {
        request: {
          publicationId: publication.id,
        },
      },
    });
  };

  return (
    <div className="flex ml-4 cursor-pointer" onClick={() => handleMirror()}>
      {stats.totalAmountOfMirrors}
      <CollectionIcon className="h-6 w-6 ml-2" aria-hidden="true" />
    </div>
  );
};
