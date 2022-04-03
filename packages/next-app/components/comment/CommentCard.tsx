import { useState, useContext } from "react";
import { UserContext } from "@/components/layout";
import { useMutation } from "@apollo/client";
import { CREATE_COMMENT_TYPED_DATA } from "@/queries/publications/comment";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";
import { uploadIpfs } from "@/lib/ipfs/ipfs";

import LENS_ABI from "@/abis/Lens.json";
const LENS_CONTRACT = "0xd7B3481De00995046C7850bCe9a5196B7605c367";

import { Button, Avatar } from "@/components/elements";

type CommentCardProps = {
  publicationId: string;
  onClose: () => void;
};

export const CommentCard = ({ publicationId, onClose }: CommentCardProps) => {
  const { currentUser } = useContext(UserContext);
  //   const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const [{ data: signData }, signTypedData] = useSignTypedData();
  const [
    { data, error: writeContractError, loading: writeContractLoading },
    write,
  ] = useContractWrite(
    {
      addressOrName: LENS_CONTRACT,
      contractInterface: LENS_ABI,
    },
    "commentWithSig"
  );

  const [createCommentTypedData, {}] = useMutation(CREATE_COMMENT_TYPED_DATA, {
    onCompleted({ createCommentTypedData }: any) {
      const { typedData } = createCommentTypedData;

      if (!createCommentTypedData) console.log("createComment is null");
      const {
        profileId,
        contentURI,
        profileIdPointed,
        pubIdPointed,
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
            profileIdPointed,
            pubIdPointed,
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
              // console.log(res.data);
              onClose();
              // reset form  and other closing actions
            } else {
              console.log(res.error);
            }
          });
        }
        console.log(res);
      });
    },
  });

  //   console.log(currentUser);

  const handleComment = async () => {
    if (!publicationId) return;
    // console.log(content);
    const result = await uploadIpfs({
      name: "Comment from @" + currentUser?.handle,
      description: content,
      content,
    });
    // console.log(result);
    createCommentTypedData({
      variables: {
        request: {
          profileId: currentUser?.id,
          publicationId: publicationId,
          contentURI: "ipfs://" + result.path,
          collectModule: {
            emptyCollectModule: true,
          },
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        },
      },
    });
  };

  return (
    <div className="my-4">
      <div className="border rounded-lg border-stone-300 p-2 shadow-lg">
        <div className="flex relative mt-6 flex-1 px-4 sm:px-6">
          <Avatar profile={currentUser} size={"small"} />
          <div className="w-full ml-4">
            <textarea
              rows={8}
              className="p-2 block w-full sm:text-sm resize-none focus-none border border-stone-400  rounded-lg"
              placeholder=""
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="my-4 flex justify-between px-4 sm:px-6">
          <div></div>
          <div className="w-30">
            <Button onClick={() => handleComment()}>Comment</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
