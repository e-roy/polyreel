import { useState, useContext } from "react";
import { UserContext } from "@/components/layout";
import { useMutation } from "@apollo/client";
import { CREATE_COMMENT_TYPED_DATA } from "@/queries/publications/comment";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";
import { uploadIpfs } from "@/lib/ipfs/ipfs";

import {
  Button,
  Avatar,
  AddEmoji,
  AddGif,
  AddPhoto,
} from "@/components/elements";

import { EmojiIcon, GifIcon } from "@/icons";
import { PhotographIcon, XCircleIcon } from "@heroicons/react/outline";

import LENS_ABI from "@/abis/Lens-Hub.json";

import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

type CommentCardProps = {
  publicationId: string;
  onClose: () => void;
};

export const CommentCard = ({ publicationId, onClose }: CommentCardProps) => {
  const { currentUser } = useContext(UserContext);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isGifOpen, setIsGifOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [content, setContent] = useState("");
  const [selectedPicture, setSelectedPicture] = useState(null);

  const { signTypedDataAsync } = useSignTypedData();

  const { writeAsync } = useContractWrite({
    addressOrName: LENS_HUB_PROXY_ADDRESS,
    contractInterface: LENS_ABI,
    functionName: "commentWithSig",
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
        writeAsync({ args: postARGS }).then((res) => {
          onClose();
          res.wait(1).then(() => {
            // console.log("res", res);
            // onClose();
          });
        });
      });
    },
    onError(error) {
      console.log(error);
      onClose();
    },
  });

  const handleComment = async () => {
    if (!publicationId) return;
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

    createCommentTypedData({
      variables: {
        request: {
          profileId: currentUser?.id,
          publicationId: publicationId,
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
    <div className="">
      <div className="ml-6 h-8 w-0.5 bg-stone-400"></div>
      <div className="flex relative ml-1 mt-0.5 flex-1">
        <div>
          <Avatar profile={currentUser as any} size={"small"} />
        </div>
        <div className="w-full sm:ml-4 p-2">
          <textarea
            rows={6}
            className="block w-full sm:text-sm resize-none focus-auto outline-none font-medium text-stone-800"
            placeholder="reply with a comment"
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
      <div className="my-4 flex justify-between mx-1">
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
            <PhotographIcon className="text-3xl h-5 w-5 mx-auto" />
          </div>
        </div>
        <div className="w-30">
          <Button
            disabled={selectedPicture || content.length !== 0 ? false : true}
            onClick={() => handleComment()}
            className="px-2 py-1"
          >
            comment
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
        {isGifOpen && <AddGif onSelect={(gif) => setSelectedPicture(gif)} />}
        {isPhotoOpen && <AddPhoto onSelect={(photo) => console.log(photo)} />}
      </div>
    </div>
  );
};
