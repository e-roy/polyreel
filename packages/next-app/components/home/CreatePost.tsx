import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { TextBox, Button } from "@/components/elements";

import { useMutation } from "@apollo/client";

import { CREATE_POST_TYPED_DATA } from "@/queries/publications/create-post";
import { uploadIpfs } from "@/lib/ipfs/ipfs";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

import LENS_ABI from "@/abis/Lens.json";
const LENS_CONTRACT = "0xd7B3481De00995046C7850bCe9a5196B7605c367";

export const CreatePost = () => {
  const [open, setOpen] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profileHandle, setProfileHandle] = useState<string | null>(null);
  const [name, setName] = useState("Post");
  const [description, setDescription] = useState("");
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

  useEffect(() => {
    setProfileId(sessionStorage.getItem("polyreel_profile_id"));
    setProfileHandle(sessionStorage.getItem("polyreel_profile_handle"));
    setName(`Post by @${sessionStorage.getItem("polyreel_profile_handle")}`);
    setProfilePicture(sessionStorage.getItem("polyreel_profile_picture"));
  }, []);

  const handlePost = async () => {
    const result = await uploadIpfs({
      name: name,
      description: content,
      content,
    });
    console.log(result);
    createPostTypedData({
      variables: {
        request: {
          profileId,
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
        <Button onClick={() => setOpen(!open)}>create post</Button>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 " onClose={setOpen}>
          <div className="absolute inset-0">
            <Dialog.Overlay className="absolute inset-0" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 flex w-screen">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <div className="pointer-events-auto w-screen">
                  <div className="flex h-1/2 flex-col bg-stone-200 py-6 shadow-xl overflow-y-hidden">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Create Post
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex relative mt-6 flex-1 px-4 sm:px-6">
                      <div>
                        {profilePicture ? (
                          <div className="h-8 w-8 sm:h-12 sm:w-12  relative rounded-full border-2 shadow-md">
                            <img
                              src={profilePicture}
                              alt=""
                              className="rounded-full"
                            />
                          </div>
                        ) : (
                          <div className="rounded-full h-8 w-8 sm:h-12 sm:w-12 bg-gray-300 border-2 shadow-md"></div>
                        )}
                      </div>
                      <div className="w-full ml-4">
                        <textarea
                          rows={8}
                          className="p-2 block w-full sm:text-sm resize-none focus-none"
                          placeholder=""
                          value={content}
                          onChange={(e) => {
                            setContent(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex mx-8 justify-end bg-transparent">
                      <Button onClick={() => handlePost()} className="w-16">
                        post
                      </Button>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
