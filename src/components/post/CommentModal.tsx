"use client";
// components/post/CommentModal.tsx

import {
  CreateOnchainCommentBroadcastItemResult,
  Post,
} from "@/types/graphql/generated";
import { Avatar } from "@/components/elements/Avatar";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { UserContext } from "@/context/UserContext/UserContext";
import { BsChat, BsFillSendFill } from "react-icons/bs";

import { CREATE_COMMENT_TYPED_DATA } from "@/graphql/publications/comment";

import { useAccount, useSignTypedData, useWriteContract } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import { LensHub } from "@/abis/LensHub";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

import { SubmitHandler, useForm } from "react-hook-form";
import { cardFormatDate } from "@/utils/formatDate";
import axios from "axios";

import Link from "next/link";
import { Button } from "../ui/button";

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

interface ICommentModalProps {
  publication: Post;
}

export const CommentModal = ({ publication }: ICommentModalProps) => {
  const { address } = useAccount();

  const { currentUser, verified } = useContext(UserContext);

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedPicture, setSelectedPicture] =
    useState<selectedPictureType | null>(null);

  const { signTypedDataAsync } = useSignTypedData();

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: (error) => {
        console.log("error", error);
        setIsSubmitting(false);
        setShowModal(false);
      },
    },
  });

  const write = async (args: PostArgs) => {
    const res = await writeContractAsync({
      address: LENS_HUB_PROXY_ADDRESS,
      abi: LensHub,
      functionName: "commentWithSig",
      args: [args.postParams, args.signature],
    });
    return res;
  };

  const [createOnchainCommentTypedData] = useMutation(
    CREATE_COMMENT_TYPED_DATA,
    {
      onCompleted({
        createOnchainCommentTypedData,
      }: CreateOnchainPostTypedDataResult) {
        const { typedData } = createOnchainCommentTypedData;

        if (!createOnchainCommentTypedData)
          console.log("createComment is null");

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
        } = typedData?.value;

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
            setShowModal(false);
            reset();
          });
        });
      },
      onError(error) {
        console.log(error);
        setIsSubmitting(false);
      },
    }
  );

  const { register, handleSubmit, reset } = useForm<CommentInputs>();
  const onSubmit: SubmitHandler<CommentInputs> = async (data) => {
    // console.log(data);
    if (!publication.id) return;
    setIsSubmitting(true);
    let media = [] as any[];

    const payload = {
      name: "Comment from @" + currentUser?.handle?.localName,
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
      createOnchainCommentTypedData({
        variables: {
          request: {
            commentOn: publication.id,
            contentURI: "https://ipfs.infura.io/ipfs/" + hash,
          },
        },
      });
    } catch (err) {
      console.log("ERROR =====> ", err);
      setIsSubmitting(false);
      reset();
    }
  };

  if (!currentUser) return null;

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <Button
          type={`button`}
          variant={`ghost`}
          size={`icon`}
          disabled={!verified}
          className="flex my-auto font-medium text-stone-600 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
        >
          {publication?.stats?.comments}
          <BsChat
            className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-2"
            aria-hidden="true"
          />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="my-2">
          <div className="flex relative flex-1 space-x-6">
            <div className={``}>
              <Avatar
                profile={publication?.by}
                size={"small"}
                hoverable={false}
              />
            </div>
            <div className={`flex flex-col col-span-7 md:col-span-11 w-full`}>
              <div className={`flex justify-between w-full`}>
                {publication.by && (
                  <Link
                    className={`hover:underline w-full`}
                    href={`/profile/${publication.by?.handle?.localName}`}
                    passHref
                  >
                    <span
                      className={`text-stone-700 dark:text-stone-100 font-medium w-full`}
                    >
                      {publication.by.metadata?.displayName}
                    </span>
                    <span
                      className={`text-stone-500 dark:text-stone-400 font-medium text-xs pl-2 my-auto`}
                    >
                      @{publication.by.handle?.localName}
                    </span>
                  </Link>
                )}
                <span
                  className={`text-right w-full text-stone-500 dark:text-stone-400 text-xs sm:text-sm my-auto`}
                >
                  {cardFormatDate(publication.createdAt)}
                </span>
              </div>
              <div className={`w-full my-3`}>
                {publication.metadata?.content}
              </div>
            </div>
          </div>
        </div>

        <div className="my-2 space-y-4">
          <div className="flex mt-6 space-x-4">
            <Avatar
              profile={currentUser as any}
              size={"small"}
              hoverable={false}
            />
            <div className="my-auto">
              <div className="primary/90">
                {currentUser?.metadata?.displayName}
              </div>
              <div className="text-sm primary/60">
                @{currentUser?.handle?.localName}
              </div>
            </div>
          </div>
          <div className="flex">
            {isSubmitting ? (
              <div className="w-full font-medium flex h-32 justify-center items-center text-stone-700 dark:text-stone-200">
                Confirm transaction to post on-chain
              </div>
            ) : (
              <>
                <form
                  className={`w-full sm:mx-2`}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className={`flex flex-col space-x-2`}>
                    <textarea
                      id={"content"}
                      rows={4}
                      required
                      placeholder={`Post a Reply`}
                      {...register("content")}
                      className={`block w-full rounded-md border resize-none border-stone-200 shadow-sm text-base text-stone-700 dark:text-stone-100 py-2 px-3 focus:outline-transparent focus:border-stone-300 focus:ring focus:ring-stone-200 focus:ring-opacity-50`}
                    />
                    <div className={`flex justify-between mt-6`}>
                      <div></div>
                      <button
                        type={`submit`}
                        className={
                          "bg-sky-500 hover:bg-sky-600 hover:text-white text-gray-100 rounded-full p-2"
                        }
                      >
                        <BsFillSendFill className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
