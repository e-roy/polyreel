import { useCallback, useContext } from "react";
import { UserContext } from "@/context";
import { HiOutlineCollection } from "react-icons/hi";

import { useMutation } from "@apollo/client";
import { CREATE_COLLECT_TYPED_DATA } from "@/queries/publications/collect";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import LENS_ABI from "@/abis/Lens-Hub.json";

import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

import { Post } from "@/types/graphql/generated";

interface ICollectProps {
  publication: Post;
}

export const Collect = ({ publication }: ICollectProps) => {
  const { currentUser } = useContext(UserContext);
  // console.log("currentuser", currentUser);

  const { stats, collectModule } = publication;

  const { signTypedDataAsync } = useSignTypedData();
  const { writeAsync } = useContractWrite({
    address: LENS_HUB_PROXY_ADDRESS,
    abi: LENS_ABI,
    functionName: "commentWithSig",
    mode: "recklesslyUnprepared",
  });

  // TODO: error on collecting, need to fix
  const [createCollectTypedData, { loading, error }] = useMutation(
    CREATE_COLLECT_TYPED_DATA,
    {
      onCompleted({ createCollectTypedData }: any) {
        const { typedData } = createCollectTypedData;
        if (!createCollectTypedData)
          console.log("createCollectTypedData is null");
        const { profileId, pubId, data } = typedData?.value;

        signTypedDataAsync({
          domain: omit(typedData?.domain, "__typename"),
          types: omit(typedData?.types, "__typename"),
          value: omit(typedData?.value, "__typename"),
        }).then((res) => {
          if (res) {
            const { v, r, s } = splitSignature(res);
            const postARGS = {
              collector: currentUser?.ownedBy,
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

            writeAsync({ recklesslySetUnpreparedArgs: [postARGS] }).then(
              (res) => {
                res.wait(1).then(() => {
                  // console.log("res", res);
                  // onClose();
                });
                // if (!res.error) {
                //   console.log(res.data);

                //   // reset form  and other closing actions
                // } else {
                //   console.log(res.error);
                // }
              }
            );
          }
        });
      },
      onError(error) {
        console.log(error);
      },
    }
  );

  const handleCollect = useCallback(() => {
    createCollectTypedData({
      variables: {
        request: {
          publicationId: publication.id,
        },
      },
    });
  }, [currentUser]);

  if (collectModule?.__typename !== "FreeCollectModuleSettings") return null;

  return (
    <button
      className="flex ml-4 hover:text-stone-700"
      type={`button`}
      onClick={handleCollect}
    >
      {stats?.totalAmountOfCollects}
      <HiOutlineCollection
        className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ml-2"
        aria-hidden="true"
      />
    </button>
  );
};
