import { useContext } from "react";
import { UserContext } from "@/components/layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";

import { CREATE_PROFILE } from "@/queries/profile/create-profile";
import { Button, TextField, Modal } from "@/components/elements";

import ImageUploading from "react-images-uploading";
import { UserAddIcon } from "@heroicons/react/outline";

export const CreateProfile = () => {
  const router = useRouter();
  const { refechProfiles } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [handle, setHandle] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [profileImage, setProfileImage] = useState([]);
  const maxNumber = 1;

  const [createProfile, { data, loading, error }] = useMutation(
    CREATE_PROFILE,
    {
      variables: {
        request: { handle: handle },
      },
    }
  );
  useEffect(() => {
    if (data?.createProfile.txHash) {
      refechProfiles();
      router.push(`/profile/${handle}`);
    }
    if (data?.createProfile.__typename === "RelayError") {
      setSubmitError("Handle already taken");
      setHandle("");
    }
  }, [data]);

  if (loading)
    return (
      <div className="text-xl font-bold cursor-pointer">Submitting...</div>
    );
  if (error)
    return (
      <div className="text-xl font-bold cursor-pointer text-red-600">
        Submission error! {error.message}
      </div>
    );

  const handleCreateProfile = async () => {
    setSubmitError("");
    setIsModalOpen(false);
    await createProfile();
  };

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

  return (
    <div className="">
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        Create A New Profile
      </div>
      {submitError && (
        <div className="text-red-600 text-center text-xl">{submitError}</div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <div className="bg-white p-4">
          <form onSubmit={() => handleCreateProfile()}>
            <TextField
              className="my-4"
              name="handle"
              label="Enter Your Handle"
              value={handle}
              placeholder="Handle"
              required
              onChange={(e) => setHandle(e.target.value)}
            />

            <div className="flex justify-between">
              {/* <ImageUploading
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
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Add profile image
                      </span>
                    </button>
                    {imageList.map((image: any, index: any) => (
                      <div
                        key={index}
                        className="flex w-full justify-between mt-4"
                      >
                        <img src={image.data_url} alt="" width="100" />
                        <div className="flex flex-col space-y-4">
                          <Button
                            className=""
                            onClick={() => onImageUpdate(image)}
                          >
                            Update
                          </Button>
                          <Button onClick={() => onImageRemove(index)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ImageUploading> */}

              <Button className="h-12" disabled={handle === ""} type="submit">
                Create Profile
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
