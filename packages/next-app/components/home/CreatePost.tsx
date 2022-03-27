import { useState, useContext } from "react";
import { UserContext } from "@/components/layout";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/elements";

import { useMutation } from "@apollo/client";
import { CREATE_POST_TYPED_DATA } from "@/queries/publications/create-post";
import { uploadIpfs } from "@/lib/ipfs/ipfs";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import { Modal, Avatar } from "@/components/elements";

import LENS_ABI from "@/abis/Lens.json";
const LENS_CONTRACT = "0xd7B3481De00995046C7850bCe9a5196B7605c367";

export const CreatePost = () => {
  const { currentUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const [description, setDescription] = useState("");
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
    "postWithSig"
  );

  const [createPostTypedData, { loading, error }] = useMutation(
    CREATE_POST_TYPED_DATA,
    {
      onCompleted({ createPostTypedData }: any) {
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
                console.log(res.data);

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
    }
  );

  const handlePost = async () => {
    const result = await uploadIpfs({
      name: "Post from @" + currentUser?.handle,
      description: content,
      content,
    });
    // console.log(result);
    createPostTypedData({
      variables: {
        request: {
          profileId: currentUser?.id,
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
    setOpen(!open);
  };

  return (
    <>
      <div className="flex bg-transparent w-32">
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
          <div className="bg-white p-4">
            <div className=" items-start justify-between">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                Create Post
              </Dialog.Title>
              <div className="flex relative mt-6 flex-1">
                <div>
                  <Avatar profile={currentUser} size={"small"} />
                </div>
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
                  <Button onClick={() => handlePost()}> post</Button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
