"use client";

import { useState, useContext } from "react";
import { UserContext } from "@/context/UserContext/UserContext";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useMutation } from "@apollo/client";
import { CREATE_POST_TYPED_DATA } from "@/graphql/publications/create-post";

import { useAccount, useSignTypedData, useWriteContract } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";
import { SubmitHandler, useForm } from "react-hook-form";

import { Avatar } from "@/components/elements/Avatar";

import { Button } from "@/components/ui/button";

import { IoClose } from "react-icons/io5";

import { LensHub } from "@/abis/LensHub";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

import { BsFillSendFill } from "react-icons/bs";
import axios from "axios";
import { CreateOnchainPostBroadcastItemResult } from "@/types/graphql/generated";

interface PostArgs {
  postParams: {
    profileId: string;
    contentURI: string;
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
  createOnchainPostTypedData: CreateOnchainPostBroadcastItemResult;
}

interface selectedPictureType {
  data_url: string;
  file: File;
}

type PostInputs = {
  content: string;
};

export const CreatePost = () => {
  const { address } = useAccount();

  const { currentUser, verified } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedPicture, setSelectedPicture] =
    useState<selectedPictureType | null>(null);

  const { signTypedDataAsync } = useSignTypedData();

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: (error) => {
        console.log("error", error);
        setIsSubmitting(false);
        setIsModalOpen(false);
      },
    },
  });

  const write = async (args: PostArgs) => {
    const res = await writeContractAsync({
      address: LENS_HUB_PROXY_ADDRESS,
      abi: LensHub,
      functionName: "postWithSig",
      args: [args.postParams, args.signature],
    });
    return res;
  };

  const [createPostTypedData] = useMutation(CREATE_POST_TYPED_DATA, {
    onCompleted({
      createOnchainPostTypedData,
    }: CreateOnchainPostTypedDataResult) {
      if (!createOnchainPostTypedData) {
        console.log("createPost is null");
        return;
      }

      const { typedData } = createOnchainPostTypedData;
      const {
        profileId,
        contentURI,
        referenceModule,
        referenceModuleInitData,
      } = typedData.value;

      signTypedDataAsync({
        domain: omit(typedData?.domain, "__typename"),
        types: omit(typedData?.types, "__typename"),
        primaryType: "Post",
        message: omit(typedData?.value, "__typename"),
      }).then((res) => {
        const { v, r, s } = splitSignature(res);

        const postARGS: PostArgs = {
          postParams: {
            profileId,
            contentURI,
            actionModules: [],
            actionModulesInitDatas: [],
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
          setIsModalOpen(false);
          reset();
        });
      });
    },
    onError(error) {
      console.log(error);
      setIsSubmitting(false);
      setIsModalOpen(false);
    },
  });

  const { register, handleSubmit, reset } = useForm<PostInputs>();
  const onSubmit: SubmitHandler<PostInputs> = async (data) => {
    setIsSubmitting(true);
    let media = [] as any[];
    if (selectedPicture) {
      media = [
        {
          item: selectedPicture,
          type: "image/gif",
        },
      ];
    }
    const payload = {
      name: "Post from @" + currentUser?.handle?.localName,
      description: data.content,
      content: data.content,
      image: selectedPicture?.data_url || null,
      imageMimeType: selectedPicture?.file?.type || null,
      attributes: [],
      media: media,
    };

    try {
      const res = await axios.post("/api/ipfs", payload);
      // console.log("RESPONSE ====>", res.data);
      const { hash } = res.data;

      createPostTypedData({
        variables: {
          request: {
            contentURI: "https://ipfs.infura.io/ipfs/" + hash,
          },
        },
      });
    } catch (err) {
      console.log("ERROR =====> ", err);
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };

  if (!currentUser || !verified) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          type={`button`}
          variant={`outline`}
          className={`flex justify-start px-4 space-x-2 w-full hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 my-2 p-2 xl:pr-6`}
        >
          <BsFillSendFill className="text-3xl h-7 w-7" />
          <div className="pl-2 my-auto block md:hidden xl:block">Post</div>
        </Button>
      </DialogTrigger>

      <DialogContent className="">
        <DialogTitle>Create Post</DialogTitle>
        <div className="space-y-6">
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

          <div className="w-full p-2">
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
                  <textarea
                    id={"content"}
                    rows={6}
                    required
                    className={`block w-full rounded-md border resize-none border-stone-200 shadow-sm text-base text-stone-700 dark:text-stone-100 py-2 px-3 focus:outline-transparent focus:border-stone-300 focus:ring focus:ring-stone-200 focus:ring-opacity-50`}
                    placeholder="create a post"
                    {...register("content")}
                  />
                  <div className="my-4 flex justify-between">
                    <div className="flex"></div>
                    <div className="mx-4">
                      <button
                        className={`flex hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full text-stone-500 dark:text-stone-300 hover:text-stone-800 my-2 p-2`}
                        type={`submit`}
                      >
                        <BsFillSendFill className="text-3xl h-7 w-7" />
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
            <div className="mx-auto">
              {selectedPicture && (
                <div className="flex">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedPicture?.data_url}
                    className="w-auto max-h-60 mx-auto"
                    alt="selected gif"
                  />
                  <IoClose
                    onClick={() => setSelectedPicture(null)}
                    className="h-6 w-6 text-stone-500 hover:text-stone-700 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
