import { Modal } from "@mui/material";
import UploadPofilePicture from "./UploadPofilePicture";

type UploadProfilePictureModal = {
  onCloseEditPictureModal: () => void;
  profilePicture?: string | null;
};

const UploadProfilePictureModal = ({
  onCloseEditPictureModal,
  profilePicture,
}: UploadProfilePictureModal) => {
  return (
    <Modal
      open
      onClose={onCloseEditPictureModal}
      aria-labelledby="modal-profile-picture"
      aria-describedby="Modale d'édition de la photo de profil"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="flex flex-col justify-center items-center bg-white p-6 rounded-md">
        <UploadPofilePicture
          onCloseEditPictureModal={onCloseEditPictureModal}
          profilePictureUrl={profilePicture}
        />
      </div>
    </Modal>
  );
};

export default UploadProfilePictureModal;
