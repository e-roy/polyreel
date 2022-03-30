import React, { useState, MouseEvent, FormEvent } from "react";
import { useMutation } from "@apollo/client";
import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";
import ImageUploading from "react-images-uploading";
import { uploadImageIpfs } from "@/lib/ipfs/ipfsImage";
import { UserAddIcon } from "@heroicons/react/outline";

import { CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA } from "@/queries/profile/set-profile-image";
import { Button, TextField } from "@/components/elements";

// import { uploadIpfs } from "@/lib/ipfs";

import LENS_ABI from "@/abis/Lens.json";
const LENS_CONTRACT = "0xd7B3481De00995046C7850bCe9a5196B7605c367";

export type SetProfileImageProps = {
  profileId: string;
};

export const SetProfileImage = ({ profileId }: SetProfileImageProps) => {
  //   const profileId = "0x45";
  const [profileImage, setProfileImage] = useState([]);
  const maxNumber = 1;

  const [{ data: signData }, signTypedData] = useSignTypedData();
  const [
    {
      data: writeContractData,
      error: writeContractError,
      loading: writeContractLoading,
    },
    write,
  ] = useContractWrite(
    {
      addressOrName: LENS_CONTRACT,
      contractInterface: LENS_ABI,
    },
    "setProfileImageURIWithSig"
  );

  const [createSetProfileImageURITypedData, { data, loading, error }] =
    useMutation(CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA, {
      onCompleted({ createSetProfileImageURITypedData }: any) {
        const { typedData } = createSetProfileImageURITypedData;

        signTypedData({
          domain: omit(typedData?.domain, "__typename"),
          types: omit(typedData?.types, "__typename"),
          value: omit(typedData?.value, "__typename"),
        }).then((res) => {
          if (!res.error) {
            const { profileId, imageURI } = typedData?.value;
            console.log("profileId", profileId);
            console.log("imageURI", imageURI);
            const { v, r, s } = splitSignature(res.data);
            const postARGS = {
              profileId,
              imageURI,
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
    });

  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  const handleSubmit = () => {
    // e.preventDefault();
    createSetProfileImageURITypedData({
      variables: {
        request: {
          profileId,
          url: "https://ipfs.io/ipfs/QmaZdyGNxdM2AB37PXp4bUjF3Mc5VR33r8pwMqmJF3P6be/dev_4504.png",
          // url: profileImage,
        },
      },
    });
    console.log("updateing profile pic");
    console.log(profileImage);
  };
  if (loading) return <p>Submitting...</p>;
  if (error) return <p>Submission error! {error.message}</p>;

  const onImageUpdate = async (image: any) => {
    console.log(image);
    const payload = {
      path: image.file.name,
      content: image.data_url,
    };
    console.log(payload);
    // const ipfsImage = await uploadImageIpfs(payload);
    // const ipfsImage = await uploadImageIpfs(image);

    // console.log(ipfsImage);
  };
  const onChange = (imageList: any, addUpdateIndex: any) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setProfileImage(imageList);
  };
  console.log("profileImage", profileImage);

  return (
    <div className="p-2 border rounded">
      {/* <h1 className="text-xl font-bold text-center cursor-pointer">
        Update Profile Picture - {profileId}
      </h1> */}
      <ImageUploading
        multiple
        value={profileImage}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div className="">
            <button
              type="button"
              className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none"
              style={isDragging ? { color: "red" } : {}}
              onClick={onImageUpload}
              {...dragProps}
            >
              <UserAddIcon
                className="h-12 w-12 flex mx-auto text-stone-500"
                aria-hidden="true"
              />
              {/* <span className="mt-2 block text-sm font-medium text-gray-900">
                Add profile image
              </span> */}
              <span className="mt-2 block text-sm font-medium text-red-500">
                Add profile image coming soon
              </span>
            </button>
            {imageList.map((image: any, index: any) => (
              <div key={index} className="flex w-full justify-between mt-4">
                <img src={image.data_url} alt="" width="100" />
                <div className="flex flex-col space-y-4">
                  <Button className="" onClick={() => onImageUpdate(image)}>
                    Update
                  </Button>
                  <Button onClick={() => onImageRemove(index)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>

      {/* <Button onClick={() => handleSubmit()}>Update Profile</Button> */}
    </div>
  );
};
