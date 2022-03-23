import { useState } from "react";
import { Button, Modal, TextField } from "@/components/elements";
import { XIcon } from "@heroicons/react/outline";

type EditProfileButtonProps = {};

export const EditProfileButton = ({}: EditProfileButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const [updateName, setUpdateName] = useState("");
  const [updateBio, setUpdateBio] = useState("");
  const [updateLocation, setUpdateLocation] = useState("");

  const handleButton = () => {
    console.log("button");
    setIsOpen(true);
  };

  return (
    <>
      <Button className="w-30" onClick={() => handleButton()}>
        edit profile
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="bg-white rounded p-2 -z-20">
          <div className="flex justify-between pb-2">
            <div className="pt-2 font-bold text-stone-700 text-lg">
              <div className=" flex h-7 items-center">
                <button
                  type="button"
                  className="rounded-full p-2 bg-white hover:bg-stone-200 text-stone-400 hover:text-stone-500 focus:outline-none"
                  onClick={() => handleClose()}
                >
                  <span className="sr-only">Close panel</span>
                  <XIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <span className="pl-4"> Edit Profile</span>
              </div>
            </div>
            <div>
              <Button>save</Button>
            </div>
          </div>
          <div className="relative h-40 sm:h-56 bg-sky-300">
            {/* <img
              className="absolute h-full w-full object-cover sm:border-2 border-transparent rounded-lg z-20"
              src="https://images.unsplash.com/photo-1501031170107-cfd33f0cbdcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&h=600&q=80"
              alt=""
            /> */}
          </div>
          <div className="-mt-8 z-30">
            <>
              {/* {profilePicture ? (
                <div className="h-12 w-12 relative rounded-full border-2 shadow-md">
                  <img src={profilePicture} alt="" className="rounded-full" />
                </div>
              ) : ( */}
              <div className="rounded-full h-12 w-12 bg-gray-800 border-2 shadow-md"></div>
              {/* )} */}
            </>
          </div>
          <TextField
            className="my-4"
            name="name"
            label="Update Your Name"
            value={updateName}
            placeholder="name"
            onChange={(e) => setUpdateName(e.target.value)}
          />
          <TextField
            className="my-4"
            name="bio"
            label="Update Your Bio"
            value={updateBio}
            placeholder="bio"
            onChange={(e) => setUpdateBio(e.target.value)}
          />
          <TextField
            className="my-4"
            name="location"
            label="Update Your Location"
            value={updateLocation}
            placeholder="location"
            onChange={(e) => setUpdateLocation(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
};
