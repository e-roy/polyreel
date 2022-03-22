import React, { useState, MouseEvent, FormEvent } from "react";
import { useMutation } from "@apollo/client";
import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";

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
  const [profileImage, setProfileImage] = useState("");
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createSetProfileImageURITypedData({
      variables: {
        request: {
          profileId,
          url: profileImage,
        },
      },
    });
    console.log("updateing profile pic");
    console.log(profileImage);
  };
  if (loading) return <p>Submitting...</p>;
  if (error) return <p>Submission error! {error.message}</p>;

  return (
    <div className="p-2 border rounded">
      <h1 className="text-xl font-bold text-center cursor-pointer">
        Update Profile Picture - {profileId}
      </h1>

      <form onSubmit={(e) => handleSubmit(e)}>
        <TextField
          className="my-4"
          name="coverPicture"
          label="Update Your Cover Picture"
          value={profileImage}
          placeholder="cover picture"
          onChange={(e) => setProfileImage(e.target.value)}
        />

        <Button type="submit">Update Profile</Button>
      </form>
    </div>
  );
};
