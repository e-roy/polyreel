"use client";

import { useState, useContext } from "react";
import { UserContext } from "@/context/UserContext/UserContext";
import { useMutation } from "@apollo/client";
import { CREATE_COMMENT_TYPED_DATA } from "@/graphql/publications/comment";

import { useAccount, useSignTypedData, useWriteContract } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import { Avatar } from "@/components/elements/Avatar";
import { BsFillSendFill } from "react-icons/bs";

import { LensHub } from "@/abis/LensHub";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { CreateOnchainCommentBroadcastItemResult } from "@/types/graphql/generated";

interface PostArgs {
  postParams: {
    profileId: string;
    contentURI: string;
    pointedProfileId: string;
    pointedPubId: BigInt;
    referrerProfileIds: string[];
    referrerPubIds: string[];
    referenceModuleData: Uint8Array;
    actionModules: any[];
    actionModulesInitDatas: any[];
    referenceModule: string;
    referenceModuleInitData: string;
  };
  signature: {
    signer: string;
    v: number;
    r: string;
    s: string;
    deadline: string;
  };
}

interface CreateOnchainPostTypedDataResult {
  createOnchainCommentTypedData: CreateOnchainCommentBroadcastItemResult;
}

interface selectedPictureType {
  data_url: string;
  file: File;
}

type CommentInputs = {
  content: string;
};

type CommentLineProps = {
  publicationId: string;
  refetch?: () => void;
};

export const CommentLine = ({ publicationId, refetch }: CommentLineProps) => {
  const { address } = useAccount();
  const { currentUser } = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPicture, setSelectedPicture] =
    useState<selectedPictureType | null>(null);

  const { signTypedDataAsync } = useSignTypedData();

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: (error) => {
        console.log("error", error);
        setIsSubmitting(false);
      },
    },
  });

  const write = async (args: PostArgs) => {
    console.log("args", args);
    const res = await writeContractAsync({
      address: LENS_HUB_PROXY_ADDRESS,
      abi: LensHub,
      functionName: "commentWithSig",
      args: [args.postParams, args.signature],
    });
    return res;
  };

  const [createCommentTypedData] = useMutation(CREATE_COMMENT_TYPED_DATA, {
    onCompleted({
      createOnchainCommentTypedData,
    }: CreateOnchainPostTypedDataResult) {
      const { typedData } = createOnchainCommentTypedData;

      if (!createOnchainCommentTypedData)
        console.log("createOnchainCommentTypedData is null");
      const {
        profileId,
        contentURI,
        pointedProfileId,
        pointedPubId,
        referrerProfileIds,
        referrerPubIds,
        referenceModuleData,
        actionModules,
        actionModulesInitDatas,
        referenceModule,
        referenceModuleInitData,
      } = typedData.value;

      signTypedDataAsync({
        domain: omit(typedData?.domain, "__typename"),
        types: omit(typedData?.types, "__typename"),
        primaryType: "Comment",
        message: omit(typedData?.value, "__typename"),
      }).then((res) => {
        const { v, r, s } = splitSignature(res);
        const postARGS = {
          postParams: {
            profileId,
            contentURI,
            pointedProfileId,
            pointedPubId,
            referrerProfileIds,
            referrerPubIds,
            referenceModuleData,
            actionModules,
            actionModulesInitDatas,
            referenceModule,
            referenceModuleInitData,
          },
          signature: {
            signer: address!,
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          },
        };
        write(postARGS).then(() => {
          setIsSubmitting(false);
          reset();
        });
      });
    },
    onError(error) {
      console.log(error);
      setIsSubmitting(false);
    },
  });

  const { register, handleSubmit, reset } = useForm<CommentInputs>();
  const onSubmit: SubmitHandler<CommentInputs> = async (data) => {
    if (!publicationId) return;
    setIsSubmitting(true);
    let media = [] as any[];

    const payload = {
      name: "Comment from @" + currentUser?.handle,
      description: "",
      content: data.content,
      image: selectedPicture?.data_url || null,
      imageMimeType: selectedPicture?.file?.type || null,
      attributes: [],
      media: media,
    };

    try {
      const res = await axios.post("/api/ipfs", payload);
      const { hash } = res.data;
      createCommentTypedData({
        variables: {
          request: {
            commentOn: publicationId,
            contentURI: "https://ipfs.infura.io/ipfs/" + hash,
          },
        },
      });
    } catch (err) {
      console.log("ERROR =====> ", err);
      setIsSubmitting(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="my-6">
      <div className="flex relative ml-1 mt-0.5 flex-1">
        <div className={`w-12`}>
          <Avatar profile={currentUser} size={"small"} />
        </div>
        {isSubmitting ? (
          <div className="w-full font-medium flex justify-center items-center text-stone-700 dark:text-stone-200">
            submitting...
          </div>
        ) : (
          <form className={`w-full sm:mx-2`} onSubmit={handleSubmit(onSubmit)}>
            <div className={`flex space-x-2`}>
              <input
                id={"content"}
                type="text"
                required
                placeholder={`Write a comment...`}
                {...register("content")}
                className={`block w-full rounded-full border border-stone-200 shadow-sm text-base text-stone-700 dark:text-stone-100 py-2 px-3 focus:outline-transparent focus:border-stone-300 focus:ring focus:ring-stone-200 focus:ring-opacity-50`}
              />
              <button
                type={`submit`}
                className={
                  "bg-sky-500 hover:bg-sky-600 hover:text-white text-gray-100 rounded-full p-2 my-auto"
                }
              >
                <BsFillSendFill className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
