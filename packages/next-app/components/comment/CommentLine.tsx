import { useState, useContext } from "react";
import { UserContext } from "@/context";
import { useMutation } from "@apollo/client";
import { CREATE_COMMENT_TYPED_DATA } from "@/queries/publications/comment";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";
import { uploadIpfsPost } from "@/lib/ipfs/ipfsPost";

import { Avatar } from "@/components/elements";
import { BsFillSendFill } from "react-icons/bs";

import LENS_ABI from "@/abis/Lens-Hub.json";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

import { SubmitHandler, useForm } from "react-hook-form";

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
  const { currentUser } = useContext(UserContext);
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
            refetch && refetch();
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
    // console.log("payload", payload);
    const result = await uploadIpfsPost(payload);

    // console.log("result", result);

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
          <>
            <form
              className={`w-full sm:mx-2`}
              onSubmit={handleSubmit(onSubmit)}
            >
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
          </>
        )}
      </div>
    </div>
  );
};
