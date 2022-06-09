import { useState, useContext } from "react";
import { UserContext } from "@/components/layout";
import { Dialog } from "@headlessui/react";

import { useMutation } from "@apollo/client";
import { CREATE_POST_TYPED_DATA } from "@/queries/publications/create-post";
import { uploadIpfs } from "@/lib/ipfs/ipfs";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import {
  Button,
  Modal,
  Avatar,
  AddEmoji,
  AddGif,
  AddPhoto,
} from "@/components/elements";

import { EmojiIcon, GifIcon } from "@/icons";
import { PhotographIcon, XCircleIcon } from "@heroicons/react/outline";

import LENS_ABI from "@/abis/Lens-Hub.json";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

export const CreatePost = () => {
  const { currentUser } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isGifOpen, setIsGifOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  const [selectedPicture, setSelectedPicture] = useState(null);

  const [content, setContent] = useState("");

  const { signTypedDataAsync } = useSignTypedData();
  const { write, writeAsync } = useContractWrite(
    {
      addressOrName: LENS_HUB_PROXY_ADDRESS,
      contractInterface: LENS_ABI,
    },
    "postWithSig"
  );

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
        write({ args: postARGS });
        setIsModalOpen(false);
      });
    },
    onError(error) {
      console.log(error);
      setIsModalOpen(false);
    },
  });

  const handlePost = async () => {
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
      content,
      media: media,
    };
    const result = await uploadIpfs({ payload });

    setContent("");
    setSelectedPicture(null);

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
      <div className="flex z-50">
        <Button
          className="px-2 py-1"
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          create post
        </Button>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
        >
          <div className="bg-white p-4 w-full">
            <div className="items-start justify-between">
              <Dialog.Title className="text-lg font-bold text-stone-600">
                Create Post
              </Dialog.Title>
              <div className="max-h-screen overflow-y-scroll">
                <div className="flex mt-6">
                  <Avatar profile={currentUser as any} size={"small"} />
                  <div className="w-full sm:ml-4 p-2">
                    <textarea
                      rows={6}
                      className="block w-full sm:text-sm resize-none focus-auto outline-none"
                      placeholder="create a post"
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value);
                      }}
                    />
                    <div className="mx-auto">
                      {selectedPicture && (
                        <div className="flex">
                          <img
                            src={selectedPicture}
                            className="w-auto max-h-60 mx-auto"
                            alt="selected gif"
                          />
                          <XCircleIcon
                            onClick={() => setSelectedPicture(null)}
                            className="h-6 w-6 text-stone-500 hover:text-stone-700 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="my-4 flex justify-between">
                  <div className="flex ml-12">
                    <div
                      onClick={() => {
                        setIsEmojiOpen(!isEmojiOpen);
                        setIsGifOpen(false);
                        setIsPhotoOpen(false);
                      }}
                      className="p-1 mx-1 text-stone-500 hover:text-stone-800 hover:bg-stone-200 hover:shadow-xl cursor-pointer my-auto rounded-2xl"
                    >
                      <EmojiIcon />
                    </div>
                    <div
                      onClick={() => {
                        setIsGifOpen(!isGifOpen);
                        setIsPhotoOpen(false);
                        setIsEmojiOpen(false);
                      }}
                      className="p-1 mx-1 text-stone-500 hover:text-stone-800 hover:bg-stone-200 hover:shadow-xl cursor-pointer my-auto rounded-2xl"
                    >
                      <GifIcon />
                    </div>
                    <div
                      onClick={() => {
                        setIsPhotoOpen(!isPhotoOpen);
                        setIsGifOpen(false);
                        setIsEmojiOpen(false);
                      }}
                      className="p-1 mx-1 text-stone-500 hover:text-stone-800 hover:bg-stone-200 hover:shadow-xl cursor-pointer my-auto rounded-2xl"
                    >
                      <PhotographIcon className="text-3xl h-5 w-5 mx-auto " />
                    </div>
                  </div>
                  <div className="mx-4">
                    <Button
                      disabled={
                        selectedPicture || content.length !== 0 ? false : true
                      }
                      className="px-4 py-1"
                      onClick={() => handlePost()}
                    >
                      post
                    </Button>
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
                    <AddPhoto onSelect={(photo) => console.log(photo)} />
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
