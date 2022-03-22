import React, { useState } from "react";
import { Button, TextField } from "@/components/elements";

import { useMutation } from "@apollo/client";

import { CREATE_POST_TYPED_DATA } from "@/queries/publications/create-post";

// import { uploadIpfs } from "@/lib/ipfs";

import { useSignTypedData, useContractWrite } from "wagmi";

import { omit, splitSignature } from "@/lib/helpers";

import LENS_ABI from "@/abis/Lens.json";
const LENS_CONTRACT = "0xd7B3481De00995046C7850bCe9a5196B7605c367";

export type CreatePostProps = {
  profileId: string;
};

export const CreatePost = ({ profileId }: CreatePostProps) => {
  // const [ipfsResult, setIpfsResult] = useState<any>();
  const [name, setName] = useState("");
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
          // console.log(res);
        });
      },
      onError(error) {
        console.log(error);
      },
    }
  );

  if (loading) return <p>Submitting...</p>;
  if (error) return <p>Submission error! {error.message}</p>;

  const handlePost = async () => {
    // const result = await uploadIpfs({ name, description: content, content });
    const result = "";
    // setIpfsResult(result);
    // console.log(result);
    createPostTypedData({
      variables: {
        request: {
          profileId,
          contentURI: "ipfs://" + result,
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
    <div className="p-2 border rounded">
      <h1 className="text-xl font-bold text-center cursor-pointer">
        Create Post - {profileId}
      </h1>
      {/* <form onSubmit={(e) => handlePost(e)}> */}
      <div>create Post</div>
      <TextField
        className="my-4"
        name="name"
        label="Name"
        value={name}
        placeholder="name"
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        className="my-4"
        name="content"
        label="Content"
        value={content}
        placeholder="content"
        onChange={(e) => setContent(e.target.value)}
      />

      <Button onClick={() => handlePost()}>Create Post</Button>
      {/* </form> */}
    </div>
  );
};
