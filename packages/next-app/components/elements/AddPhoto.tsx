import { useState } from "react";
import ImageUploading from "react-images-uploading";
import { PhotographIcon } from "@heroicons/react/outline";
import { Button } from "@/components/elements";

type AddPhotoProps = {
  onSelect: (emoji: string) => void;
};

export const AddPhoto = ({ onSelect }: AddPhotoProps) => {
  const [uploadImage, setUploadImage] = useState([]);
  const maxNumber = 1;

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
    setUploadImage(imageList);
  };

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
            <button
              type="button"
              className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none"
              style={isDragging ? { color: "red" } : {}}
              onClick={onImageUpload}
              {...dragProps}
            >
              <PhotographIcon
                className="h-12 w-12 flex mx-auto text-stone-500"
                aria-hidden="true"
              />
              {/* <span className="mt-2 block text-sm font-medium text-gray-900">
                Add profile image
              </span> */}
              <span className="mt-2 block text-sm font-medium text-red-500">
                Add Images Coming Soon
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
    </div>
  );
};
