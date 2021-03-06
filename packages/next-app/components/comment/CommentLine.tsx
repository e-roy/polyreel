import { useState, useContext } from "react";
import { UserContext } from "@/components/layout";
import { useMutation } from "@apollo/client";
import { CREATE_COMMENT_TYPED_DATA } from "@/queries/publications/comment";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";
import { uploadIpfs } from "@/lib/ipfs/ipfs";

import { Avatar } from "@/components/elements";
import { ReplyIcon } from "@heroicons/react/solid";

import LENS_ABI from "@/abis/Lens-Hub.json";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type CommentLineProps = {
  publicationId: string;
};

export const CommentLine = ({ publicationId }: CommentLineProps) => {
  const { currentUser } = useContext(UserContext);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          res.wait(1).then(() => {
            setIsSubmitting(false);
            setContent("");
          });
        });
      });
    },
    onError(error) {
      console.log(error);
      setIsSubmitting(false);
    },
  });

  const handleComment = async () => {
    console.log("handleComment");
    console.log(publicationId);
    if (!publicationId) return;
    setIsSubmitting(true);
    let media = [] as any[];

    const payload = {
      name: "Comment from @" + currentUser?.handle,
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
    <div className="mt-2 border-t">
      <div className="flex relative ml-1 mt-0.5 flex-1">
        <div>
          <Avatar profile={currentUser as any} size={"small"} />
        </div>
        {isSubmitting ? (
          <div className="w-full font-medium flex justify-center items-center text-stone-700">
            submitting...
          </div>
        ) : (
          <>
            <div className="w-full sm:mx-2">
              <textarea
                rows={3}
                className="block w-full sm:text-sm border p-1 resize-none focus-auto outline-none font-medium text-stone-800"
                placeholder="leave a comment"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              />
            </div>
            <button
              disabled={content.length !== 0 ? false : true}
              onClick={() => handleComment()}
              className={classNames(
                content.length !== 0
                  ? "bg-sky-500 hover:bg-sky-600 hover:text-white text-gray-100"
                  : "",
                "border m-auto p-1 rounded-full bg-stone-400 text-stone-500 cursor-pointer"
              )}
            >
              <ReplyIcon className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
