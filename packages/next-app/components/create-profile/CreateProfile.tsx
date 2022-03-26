import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useMutation } from "@apollo/client";

import { CREATE_PROFILE } from "@/queries/profile/create-profile";
import { Button, TextField, Modal } from "@/components/elements";

export const CreateProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [handle, setHandle] = useState("");
  const [createProfile, { data, loading, error }] = useMutation(
    CREATE_PROFILE,
    {
      variables: {
        request: { handle: handle },
      },
    }
  );

  if (loading) return <p>Submitting...</p>;
  if (error) return <p>Submission error! {error.message}</p>;
  // console.log(data);
  return (
    <div className="">
      <div
        className="text-xl font-bold  cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        Create A New Profile
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <div className="bg-white p-4">
          <form onSubmit={() => createProfile()}>
            <TextField
              className="my-4"
              name="handle"
              label="Enter Your Handle"
              value={handle}
              placeholder="Handle"
              required
              onChange={(e) => setHandle(e.target.value)}
            />
            <Button disabled={handle === ""} type="submit">
              Create Profile
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};
