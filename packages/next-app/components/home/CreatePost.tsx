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

import LENS_ABI from "@/abis/Lens.json";

import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

export const CreatePost = () => {
  const { currentUser } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isGifOpen, setIsGifOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  const [selectedPicture, setSelectedPicture] = useState(null);

  const [content, setContent] = useState("");

  const [{}, signTypedData] = useSignTypedData();
  const [{}, write] = useContractWrite(
    {
      addressOrName: LENS_HUB_PROXY_ADDRESS,
      contractInterface: LENS_ABI,
    },
    "postWithSig"
  );

  const [createPostTypedData, {}] = useMutation(CREATE_POST_TYPED_DATA, {
    onCompleted({ createPostTypedData }: any) {
      console.log("on completed");
      const { typedData } = createPostTypedData;
      if (!createPostTypedData) console.log("createPost is null");
      const {
        profileId,
        contentURI,
        collectModule,
        collectModuleData,
        referenceModule,
        referenceModuleData,
      } = typedData?.value;

      signTypedData({
        domain: omit(typedData?.domain, "__typename"),
        types: omit(typedData?.types, "__typename"),
        value: omit(typedData?.value, "__typename"),
      }).then((res) => {
        if (!res.error) {
          const { v, r, s } = splitSignature(res.data);
          const postARGS = {
            profileId,
            contentURI,
            collectModule,
            collectModuleData,
            referenceModule,
            referenceModuleData,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          };
          write({ args: postARGS }).then((res) => {
            if (!res.error) {
              setIsModalOpen(false);
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
      description: "",
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

  return (
    <>
      <div className="flex w-32 z-50">
        <Button onClick={() => setIsModalOpen(!isModalOpen)}>
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
                  <Avatar profile={currentUser} size={"small"} />
                  <div className="w-full sm:ml-4 border border-stone-400 rounded-lg p-2">
                    <textarea
                      rows={6}
                      className="block w-full sm:text-sm resize-none focus-none outline-none"
                      placeholder=""
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
                      className="py-1 px-2 text-stone-500 hover:text-stone-800 hover:bg-stone-200 cursor-pointer my-auto rounded-lg"
                    >
                      <EmojiIcon />
                    </div>
                    <div
                      onClick={() => {
                        setIsGifOpen(!isGifOpen);
                        setIsPhotoOpen(false);
                        setIsEmojiOpen(false);
                      }}
                      className="py-1 px-2 text-stone-500 hover:text-stone-800 hover:bg-stone-200 cursor-pointer my-auto rounded-lg"
                    >
                      <GifIcon />
                    </div>
                    <div
                      onClick={() => {
                        setIsPhotoOpen(!isPhotoOpen);
                        setIsGifOpen(false);
                        setIsEmojiOpen(false);
                      }}
                      className="py-1 px-2 text-stone-500 hover:text-stone-800 hover:bg-stone-200 cursor-pointer my-auto rounded-lg"
                    >
                      <PhotographIcon className="text-3xl h-8 w-8 mx-auto " />
                    </div>
                  </div>
                  <div className="w-30">
                    <Button onClick={() => handlePost()}> post</Button>
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
