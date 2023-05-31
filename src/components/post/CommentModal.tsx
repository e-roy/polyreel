"use client";

import { Post } from "@/types/graphql/generated";
import { Avatar, Modal } from "@/components/elements";
import { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { UserContext } from "@/context";
import { BsChat } from "react-icons/bs";

import { BsFillSendFill } from "react-icons/bs";

import { CREATE_COMMENT_TYPED_DATA } from "@/graphql/publications/comment";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import LENS_ABI from "@/abis/Lens-Hub.json";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

import { SubmitHandler, useForm } from "react-hook-form";
import { cardFormatDate } from "@/utils/formatDate";
import axios from "axios";

import Link from "next/link";

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
  const { currentUser } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPicture, setSelectedPicture] =
    useState<selectedPictureType | null>(null);

  const { signTypedDataAsync } = useSignTypedData();

  const { writeAsync } = useContractWrite({
    address: LENS_HUB_PROXY_ADDRESS,
    abi: LENS_ABI,
    functionName: "commentWithSig",
    mode: "recklesslyUnprepared",
  });

  const [createCommentTypedData, {}] = useMutation(CREATE_COMMENT_TYPED_DATA, {
    onCompleted({ createCommentTypedData }: any) {
      const { typedData } = createCommentTypedData;

      if (!createCommentTypedData) console.log("createComment is null");
      const {
        profileId,
        contentURI,
        profileIdPointed,
        pubIdPointed,
        referenceModuleData,
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleInitData,
      } = typedData?.value;

      signTypedDataAsync({
        domain: omit(typedData?.domain, "__typename"),
        types: omit(typedData?.types, "__typename"),
        value: omit(typedData?.value, "__typename"),
      }).then((res) => {
        const { v, r, s } = splitSignature(res);
        const postARGS = {
          profileId,
          contentURI,
          profileIdPointed,
          pubIdPointed,
          referenceModuleData,
          collectModule,
          collectModuleInitData,
          referenceModule,
          referenceModuleInitData,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          },
        };

        writeAsync({ recklesslySetUnpreparedArgs: [postARGS] }).then((res) => {
          res.wait(1).then(() => {
            reset();
            // refetch && refetch();
            setShowModal(false);
            setIsSubmitting(false);
          });
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
    // console.log(data);
    if (!publication.id) return;
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
    // console.log("payload", payload);

    try {
      const res = await axios.post("/api/ipfs", payload);
      // console.log("RESPONSE ====>", res.data);
      const { hash } = res.data;
      createCommentTypedData({
        variables: {
          request: {
            profileId: currentUser?.id,
            publicationId: publication.id,
            contentURI: "https://ipfs.infura.io/ipfs/" + hash,
            collectModule: {
              revertCollectModule: true,
            },
            referenceModule: {
              followerOnlyReferenceModule: false,
            },
          },
        },
      });
    } catch (err) {
      console.log("ERROR =====> ", err);
      setIsSubmitting(false);
      // setResponse(null);
    }
  };

  if (!currentUser) return null;

  return (
    <>
      <button
        className="flex ml-4 my-auto font-medium text-stone-600 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
        type={`button`}
        onClick={() => setShowModal(!showModal)}
      >
        {publication?.stats?.totalAmountOfComments}
        <BsChat
          onClick={() => setShowModal(!showModal)}
          className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-2"
          aria-hidden="true"
        />
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="flex flex-col space-y-4 bg-white text-stone-700 dark:bg-stone-900 dark:text-stone-100 rounded-lg p-4">
          <div className="my-2">
            <div className="flex relative flex-1">
              <div className={`w-12`}>
                <Avatar profile={publication?.profile} size={"small"} />
              </div>
              <div className={`flex flex-col col-span-7 md:col-span-11 w-full`}>
                <div className={`flex justify-between w-full`}>
                  <Link
                    className={`hover:underline w-full`}
                    href={`/profile/${publication.profile.handle}`}
                    passHref
                  >
                    <span
                      className={`text-stone-700 dark:text-stone-100 font-medium w-full`}
                    >
                      {publication.profile.name}
                    </span>
                    <span
                      className={`text-stone-500 dark:text-stone-400 font-medium text-xs pl-2 my-auto`}
                    >
                      @{publication.profile.handle}
                    </span>
                  </Link>
                  <span
                    className={`text-right w-full text-stone-500 dark:text-stone-400 text-xs sm:text-sm my-auto`}
                  >
                    {cardFormatDate(publication.createdAt)}
                  </span>
                </div>
                <div className={`w-full my-3`}>
                  {publication.metadata.content}
                </div>
              </div>
            </div>
          </div>

          <div className="my-2">
            <div className="flex relative flex-1">
              <div className={`w-12`}>
                <Avatar profile={currentUser} size={"small"} />
              </div>
              {isSubmitting ? (
                <div className="w-full font-medium flex h-32 justify-center items-center text-stone-700 dark:text-stone-200">
                  posting comment
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
        </div>
      </Modal>
    </>
  );
};
