import { useContext } from "react";
import { UserContext } from "@/context";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useForm, SubmitHandler } from "react-hook-form";

import { CREATE_PROFILE } from "@/graphql/profile/create-profile";
import { Button, Modal } from "@/components/elements";

import { uploadImageIpfs } from "@/lib/ipfs/ipfsImage";
import ImageUploading from "react-images-uploading";
import { FaUserPlus } from "react-icons/fa";

interface IFormInputs {
  handle: string;
}

export const CreateProfile = () => {
  const { refechProfiles } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [profileImage, setProfileImage] = useState([]);
  const maxNumber = 1;

  const [createProfile, { data, loading, error }] = useMutation(
    CREATE_PROFILE,
    {
      onCompleted: () => {
        setSubmitError("");
        refechProfiles();
        setSubmitting(false);
        setIsModalOpen(false);
      },
      onError: (error) => {
        console.log("create profile error", error);
        setSubmitError(error.message);
        setSubmitting(false);
      },
    }
  );
  useEffect(() => {
    if (data?.createProfile.__typename === "RelayError") {
      setSubmitting(false);
      setSubmitError("Handle already taken");
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

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    setSubmitting(true);
    let ipfsImage = null;
    if (profileImage[0]) ipfsImage = await uploadImageIpfs(profileImage[0]);

    await createProfile({
      variables: {
        request: {
          handle: data.handle.toLowerCase(),
          profilePictureUri: ipfsImage?.item || null,
        },
      },
    });
  };

  const onChange = (imageList: any, addUpdateIndex: any) => {
    // data for submit
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              className="my-4 block w-full rounded-md border-2 border-stone-400 shadow-sm text-base text-stone-700 py-2 px-3 focus:outline-transparent focus:border-stone-300 focus:ring focus:ring-stone-200 focus:ring-opacity-50"
              placeholder="Handle"
              {...register("handle", {
                required: true,
                minLength: 5,
                maxLength: 31,
              })}
            />
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
                    className="relative block w-full border-2 border-stone-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none"
                    style={isDragging ? { color: "red" } : {}}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    <FaUserPlus
                      className="h-12 w-12 flex mx-auto text-stone-500"
                      aria-hidden="true"
                    />
                    <span className="mt-2 block text-sm font-medium text-stone-900">
                      Add profile image
                    </span>
                    <p className="text-xs font-medium text-stone-700">
                      optional - can be added later
                    </p>
                  </button>
                  <div className="my-4">
                    {imageList.map((image: any, index: any) => (
                      <div
                        key={index}
                        className="flex w-full justify-between my-4"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image.data_url} alt={``} width="100" />
                        <div className="flex flex-col space-y-4">
                          <Button
                            className="py-1 px-2"
                            onClick={() => onImageRemove(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ImageUploading>
            <Button className="py-3" type="submit">
              Create Profile
            </Button>
            <div className="h-20 py-4">
              {submitting && <div>Submitting...</div>}
              {errors.handle && (
                <div className="p-2 h-16 bg-red-600 text-stone-100 text-bold text-lg rounded-lg">
                  <p>
                    {errors.handle?.type === "required" && "Handle is required"}
                  </p>
                  <p>
                    {(errors.handle?.type === "minLength" || "maxLength") &&
                      "Handle must be at least 5 characters and less than 31 characters"}
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
