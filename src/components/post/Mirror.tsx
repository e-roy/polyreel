"use client";
// components/post/Mirror.tsx

import { useCallback, useState } from "react";

import { AiOutlineRetweet } from "react-icons/ai";

import { useMutation } from "@apollo/client";
import { CREATE_MIRROR_TYPED_DATA } from "@/graphql/publications/mirror";

import { useAccount, useSignTypedData, useWriteContract } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import { LensHub } from "@/abis/LensHub";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

import {
  CreateOnchainMirrorBroadcastItemResult,
  Post,
} from "@/types/graphql/generated";
// import { getMetadataAvatarUri } from "viem/_types/utils/ens/avatar/utils";

interface MirrorArgs {
  mirrorParams: {
    profileId: string;
    metadataURI: string;
    pointedProfileId: string;
    pointedPubId: string;
    referrerProfileIds: string[];
    referrerPubIds: string[];
    referenceModuleData: string;
  };
  signature: {
    signer: string;
    v: number;
    r: string;
    s: string;
    deadline: string;
  };
}

interface CreateOnchainMirrorBroadcastTypedDataResult {
  createOnchainMirrorTypedData: CreateOnchainMirrorBroadcastItemResult;
}

interface IMirrorProps {
  publication: Post;
}

export const Mirror = ({ publication }: IMirrorProps) => {
  const { address } = useAccount();

  const [isMirrored, setIsMirrored] = useState(false);

  const { stats } = publication;

  const { signTypedDataAsync } = useSignTypedData();

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: (error) => {
        console.log("error", error);
      },
    },
  });

  const write = async (args: MirrorArgs) => {
    const res = await writeContractAsync({
      address: LENS_HUB_PROXY_ADDRESS,
      abi: LensHub,
      functionName: "mirrorWithSig",
      args: [args.mirrorParams, args.signature],
    });
    return res;
  };

  const [createOnchainMirrorTypedData] = useMutation(CREATE_MIRROR_TYPED_DATA, {
    onCompleted({
      createOnchainMirrorTypedData,
    }: CreateOnchainMirrorBroadcastTypedDataResult) {
      const { typedData } = createOnchainMirrorTypedData;
      if (!createOnchainMirrorTypedData)
        console.log("createOnchainMirrorTypedData is null");

      const {
        profileId,
        metadataURI,
        pointedProfileId,
        pointedPubId,
        referrerProfileIds,
        referrerPubIds,
        referenceModuleData,
      } = typedData?.value;

      signTypedDataAsync({
        domain: omit(typedData?.domain, "__typename"),
        types: omit(typedData?.types, "__typename"),
        primaryType: "Mirror",
        message: omit(typedData?.value, "__typename"),
      }).then((res) => {
        const { v, r, s } = splitSignature(res);
        const mirrorArgs: MirrorArgs = {
          mirrorParams: {
            profileId,
            metadataURI,
            pointedProfileId,
            pointedPubId,
            referrerProfileIds,
            referrerPubIds,
            referenceModuleData,
          },
          signature: {
            signer: address!,
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          },
        };
        write(mirrorArgs).then((res) => {
          setIsMirrored(true);
        });
      });
    },
    onError(error) {
      console.log(error);
    },
  });

  const handleMirror = useCallback(() => {
    createOnchainMirrorTypedData({
      variables: {
        request: {
          mirrorOn: publication.id,
        },
      },
    });
  }, [createOnchainMirrorTypedData, publication]);

  return (
    <>
      <button
        className={`flex ml-4 ${
          isMirrored
            ? "text-green-500 hover:text-green-600"
            : "my-auto font-medium text-stone-600 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
        }`}
        type="button"
        onClick={handleMirror}
      >
        {isMirrored ? stats?.mirrors + 1 : stats?.mirrors}
        <AiOutlineRetweet
          className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-2"
          aria-hidden="true"
        />
      </button>
    </>
  );
};
