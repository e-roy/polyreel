"use client";

import { useEffect, useState } from "react";
import ImageUploading from "react-images-uploading";
import { FaPhotoVideo } from "react-icons/fa";
import { Button } from "@/components/elements";
import { uploadImageIpfs } from "@/lib/ipfs/ipfsImage";

type AddPhotoProps = {
  title?: string;
  description?: string;
  onSelect: (image: any) => void;
  // onRemove: () => void;
};

export const AddPhoto = ({
  title,
  description,
  onSelect,
}: // onRemove,
AddPhotoProps) => {
  const [uploadImage, setUploadImage] = useState([]);
  const maxNumber = 1;

  const onImageUpdate = async (image: any) => {
    console.log(image);
    const payload = {
      path: image.file.name,
      content: image.data_url,
    };
    console.log(payload);
    const ipfsImage = await uploadImageIpfs(payload);
    // const ipfsImage = await uploadImageIpfs(image);

    console.log("ipfsImage - onImageUpdate - ", ipfsImage);
    onSelect(ipfsImage);
  };

  const onChange = async (imageList: any) => {
    console.log("imageList", imageList);
    let ipfsImage = null;

    if (imageList[0]) ipfsImage = await uploadImageIpfs(imageList[0]);
    console.log("ipfsImage", ipfsImage);

    onSelect(ipfsImage);
    setUploadImage(imageList);
  };

  // useEffect(() => {
  //   console.log("on remove");
  // }, [onRemove]);

  return (
    <div className="py-1 px-2 text-stone-500 hover:text-stone-800 hover:bg-stone-200 cursor-pointer my-auto rounded-lg">
      <ImageUploading
        multiple
        value={uploadImage}
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
            {uploadImage[0] ? (
              <>
                {imageList.map((image: any, index: any) => (
                  <div key={index} className="flex w-full justify-between mt-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
                className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-6 text-center hover:border-gray-400 focus:outline-none"
                style={isDragging ? { color: "red" } : {}}
                onClick={() => {
                  onImageRemove(0);
                  onImageUpload();
                }}
                {...dragProps}
              >
                <span className="mt-2 block text-md font-medium text-gray-900">
                  {title || "Add Photo"}
                </span>
                <span className="mt-2 block text-sm font-medium text-gray-600">
                  {description || <FaPhotoVideo className="h-8 w-8 m-auto" />}
                </span>
              </button>
            )}
          </div>
        )}
      </ImageUploading>
    </div>
  );
};
