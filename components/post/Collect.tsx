import { useCallback, useContext, useState } from "react";
import { UserContext } from "@/context";
import { HiOutlineCollection } from "react-icons/hi";

import { useMutation } from "@apollo/client";
import { CREATE_COLLECT_TYPED_DATA } from "@/graphql/publications/collect";

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
  const [isCollected, setIsCollected] = useState(false);
  // console.log("currentuser", currentUser);

  const { stats, collectModule, hasCollectedByMe } = publication;

  const { signTypedDataAsync } = useSignTypedData();
  const { writeAsync } = useContractWrite({
    address: LENS_HUB_PROXY_ADDRESS,
    abi: LENS_ABI,
    functionName: "collectWithSig",
    mode: "recklesslyUnprepared",
  });

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
                  setIsCollected(true);
                  // console.log("res", res);
                });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  if (collectModule?.__typename !== "FreeCollectModuleSettings") return null;

  return (
    <>
      {hasCollectedByMe || isCollected ? (
        <button
          className="flex ml-4 text-blue-600 hover:text-blue-700"
          type={`button`}
          onClick={handleCollect}
        >
          {isCollected
            ? stats?.totalAmountOfCollects + 1
            : stats?.totalAmountOfCollects}
          <HiOutlineCollection
            className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-2"
            aria-hidden="true"
          />
        </button>
      ) : (
        <button
          className="flex ml-4 my-auto font-medium text-stone-600 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          type={`button`}
          onClick={handleCollect}
        >
          {stats?.totalAmountOfCollects}
          <HiOutlineCollection
            className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-2"
            aria-hidden="true"
          />
        </button>
      )}
    </>
  );
};
