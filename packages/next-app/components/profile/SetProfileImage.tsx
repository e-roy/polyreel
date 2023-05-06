import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/helpers";
import ImageUploading from "react-images-uploading";
import { uploadImageIpfs } from "@/lib/ipfs/ipfsImage";
import { FaUserPlus } from "react-icons/fa";

import { CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA } from "@/queries/profile/set-profile-image";
import { Button, Loading } from "@/components/elements";

import LENS_ABI from "@/abis/Lens-Hub.json";

import { LENS_HUB_PROXY_ADDRESS } from "@/lib/constants";

export type SetProfileImageProps = {
  profileId: string;
  refetch: () => void;
};

export const SetProfileImage = ({
  profileId,
  refetch,
}: SetProfileImageProps) => {
  const [profileImage, setProfileImage] = useState([]);
  const [updating, setUpdating] = useState(false);
  const maxNumber = 1;

  const { signTypedDataAsync } = useSignTypedData();
  const { writeAsync } = useContractWrite({
    address: LENS_HUB_PROXY_ADDRESS,
    abi: LENS_ABI,
    functionName: "setProfileImageURIWithSig",
    mode: "recklesslyUnprepared",
  });

  const [createSetProfileImageURITypedData, { error }] = useMutation(
    CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA,
    {
      onCompleted({ createSetProfileImageURITypedData }: any) {
        const { typedData } = createSetProfileImageURITypedData;

        signTypedDataAsync({
          domain: omit(typedData?.domain, "__typename"),
          types: omit(typedData?.types, "__typename"),
          value: omit(typedData?.value, "__typename"),
        }).then((res) => {
          setUpdating(true);
          const { profileId, imageURI } = typedData?.value;
          const { v, r, s } = splitSignature(res);
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
          writeAsync({ recklesslySetUnpreparedArgs: [postARGS] })
            .then((res) => {
              res.wait(1).then(() => {
                setUpdating(false);
                setProfileImage([]);
                refetch();
              });
            })
            .catch((error) => {
              setUpdating(false);
              console.log("follow error");
              console.log(error);
            });
        });
      },
    }
  );

  if (error) return <p>Updating error! {error.message}</p>;

  if (updating) return <Loading />;

  const onImageUpdate = async (image: any) => {
    const ipfsImage = await uploadImageIpfs(image);
    console.log("ipfsImage", ipfsImage);
    // TODO: current method obsolete, need to update

    // createSetProfileImageURITypedData({
    //   variables: {
    //     request: {
    //       profileId,
    //       url: ipfsImage.item,
    //     },
    //   },
    // });
  };

  const onChange = (imageList: any) => {
    setProfileImage(imageList);
  };

  return (
    <div className="p-2 border rounded">
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
            {profileImage[0] ? (
              <>
                {imageList.map((image: any, index: any) => (
                  <div key={index} className="flex w-full justify-between mt-4">
                    <img src={image.data_url} alt="" width="100" />
                    <div className="flex flex-col space-y-4">
                      <Button
                        className="py-1 px-2"
                        onClick={() => onImageUpdate(image)}
                      >
                        Update
                      </Button>
                      <Button
                        className="py-1 px-2"
                        onClick={() => onImageRemove(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <button
                type="button"
                className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none"
                style={isDragging ? { color: "red" } : {}}
                onClick={() => {
                  onImageRemove(0);
                  onImageUpload();
                }}
                {...dragProps}
              >
                <FaUserPlus
                  className="h-12 w-12 flex mx-auto text-stone-500"
                  aria-hidden="true"
                />
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Add profile image
                </span>
              </button>
            )}
          </div>
        )}
      </ImageUploading>
    </div>
  );
};
