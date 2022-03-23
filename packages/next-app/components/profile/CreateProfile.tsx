import { useState } from "react";
import { Button, Modal } from "@/components/elements";

type EditProfileButtonProps = {};

export const EditProfileButton = ({}: EditProfileButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button className="w-30">edit profile</Button>);
      <Modal isOpen={true} onClose={handleClose}>
        inside modal
      </Modal>
    </>
  );
};
