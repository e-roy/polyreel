import { useContext } from "react";
import { UserContext } from "@/components/layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";

import { CREATE_PROFILE } from "@/queries/profile/create-profile";
import { Button, TextField, Modal } from "@/components/elements";

export const CreateProfile = () => {
  const router = useRouter();
  const { refechProfiles } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [handle, setHandle] = useState("");
  const [submitError, setSubmitError] = useState("");
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
            <Button disabled={handle === ""} type="submit">
              Create Profile
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};
