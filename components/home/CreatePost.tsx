import { useState, useContext } from "react";
import { UserContext } from "@/context";
import { Dialog } from "@headlessui/react";

import { useMutation } from "@apollo/client";
import { CREATE_POST_TYPED_DATA } from "@/graphql/publications/create-post";
import { uploadIpfsPost } from "@/lib/ipfs/ipfsPost";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";
import { SubmitHandler, useForm } from "react-hook-form";

import {
  Modal,
  Avatar,
  AddEmoji,
  AddGif,
  AddPhoto,
} from "@/components/elements";

import { RiFileGifLine } from "react-icons/ri";
import { GrEmoji } from "react-icons/gr";
import { FaPhotoVideo } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import LENS_ABI from "@/abis/Lens-Hub.json";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";
import { BsFillSendFill } from "react-icons/bs";

interface selectedPictureType {
  data_url: string;
  file: File;
}

type PostInputs = {
  content: string;
};

export const CreatePost = () => {
  const { currentUser } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isGifOpen, setIsGifOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  const [selectedPicture, setSelectedPicture] =
    useState<selectedPictureType | null>(null);

  const [content, setContent] = useState("");

  const { signTypedDataAsync } = useSignTypedData();
  const { writeAsync } = useContractWrite({
    address: LENS_HUB_PROXY_ADDRESS,
    abi: LENS_ABI,
    functionName: "postWithSig",
    mode: "recklesslyUnprepared",
  });

  const [createPostTypedData, {}] = useMutation(CREATE_POST_TYPED_DATA, {
    onCompleted({ createPostTypedData }: any) {
      if (!createPostTypedData) console.log("createPost is null");
      const { typedData } = createPostTypedData;
      const {
        profileId,
        contentURI,
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleInitData,
      } = typedData?.value;

      signTypedDataAsync({
        domain: omit(typedData?.domain, "__typename"),
        types: omit(typedData?.types, "__typename"),
        value: omit(typedData?.value, "__typename"),
      }).then((res: any) => {
        const { v, r, s } = splitSignature(res);
        const postARGS = {
          profileId,
          contentURI,
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
            setIsModalOpen(false);
            setIsSubmitting(false);
          });
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
      name: "Post from @" + currentUser?.handle,
      description: content,
      content: data.content,
      image: selectedPicture?.data_url || null,
      imageMimeType: selectedPicture?.file?.type || null,
      attributes: [],
      media: media,
    };
    const result = await uploadIpfsPost(payload);

    createPostTypedData({
      variables: {
        request: {
          profileId: currentUser?.id,
          contentURI: "https://ipfs.infura.io/ipfs/" + result.path,
          collectModule: {
            revertCollectModule: true,
          },
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        },
      },
    });
  };

  if (!currentUser) return null;

  return (
    <>
      <button
        type={`button`}
        className={`flex hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full text-stone-500 dark:text-stone-300 hover:text-stone-800 my-2 p-2`}
        onClick={() => setIsModalOpen(!isModalOpen)}
      >
        <BsFillSendFill className="text-3xl h-7 w-7" />
        <div className="pl-2 my-auto block md:hidden xl:block">Post</div>
      </button>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
        >
          <div className="p-4 w-full bg-white text-stone-700 dark:bg-stone-900 dark:text-stone-100 rounded-lg">
            <div className="items-start justify-between">
              <Dialog.Title className="text-lg font-bold">
                Create Post
              </Dialog.Title>
              <div className="max-h-screen overflow-y-scroll p-4">
                <div className="flex mt-6">
                  <div>
                    <Avatar profile={currentUser as any} size={"small"} />
                  </div>
                  <div className="w-full sm:ml-4 p-2">
                    {isSubmitting ? (
                      <div className="w-full font-medium flex h-32 justify-center items-center text-stone-700 dark:text-stone-200">
                        posting
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
                            <div className="flex">
                              {/* <div
                              onClick={() => {
                                setIsEmojiOpen(!isEmojiOpen);
                                setIsGifOpen(false);
                                setIsPhotoOpen(false);
                              }}
                              className="p-1 mx-1 text-stone-500 hover:text-stone-800 hover:bg-stone-200 hover:shadow-xl cursor-pointer my-auto rounded-2xl"
                            >
                              <GrEmoji className={`h-5 w-5`} />
                            </div>
                            <div
                              onClick={() => {
                                setIsGifOpen(!isGifOpen);
                                setIsPhotoOpen(false);
                                setIsEmojiOpen(false);
                              }}
                              className="p-1 mx-1 text-stone-500 hover:text-stone-800 hover:bg-stone-200 hover:shadow-xl cursor-pointer my-auto rounded-2xl"
                            >
                              <RiFileGifLine className={`h-5 w-5`} />
                            </div>
                            <div
                              onClick={() => {
                                setIsPhotoOpen(!isPhotoOpen);
                                setIsGifOpen(false);
                                setIsEmojiOpen(false);
                              }}
                              className="p-1 mx-1 text-stone-500 hover:text-stone-800 hover:bg-stone-200 hover:shadow-xl cursor-pointer my-auto rounded-2xl"
                            >
                              <FaPhotoVideo className="text-3xl h-5 w-5 mx-auto " />
                            </div> */}
                            </div>
                            <div className="mx-4">
                              <button
                                // disabled={
                                //   selectedPicture || content.length !== 0
                                //     ? false
                                //     : true
                                // }
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

                <div className="">
                  {isEmojiOpen ? (
                    <AddEmoji
                      onSelect={(emoji) => {
                        setIsEmojiOpen(!isEmojiOpen);
                        setContent(content + emoji);
                      }}
                    />
                  ) : null}
                  {isGifOpen && (
                    <AddGif onSelect={(gif) => setSelectedPicture(gif)} />
                  )}
                  {isPhotoOpen && (
                    <AddPhoto onSelect={(photo) => setSelectedPicture(photo)} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
