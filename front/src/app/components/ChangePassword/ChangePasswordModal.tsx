import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { FormEvent } from "react";

type ChangePasswordModalProps = {
  onCloseModal: () => void;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  onChangeOldPassword: (value: string) => void;
  onChangeNewPassword: (value: string) => void;
  onChangeConfirmNewPassword: (value: string) => void;
  onSavePassword: (e: FormEvent<HTMLFormElement>) => void;
  isError: boolean;
};

const ChangePasswordModal = ({
  onCloseModal,
  oldPassword,
  newPassword,
  confirmNewPassword,
  onSavePassword,
  onChangeOldPassword,
  onChangeNewPassword,
  onChangeConfirmNewPassword,
  isError,
}: ChangePasswordModalProps) => {
  return (
    <Modal
      open
      onClose={onCloseModal}
      aria-labelledby="change-password-modal"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <section className="p-6 rounded-md bg-white">
        <Typography id="modal-modal-title" variant="h5" component="h2">
          Changement de mot de passe
        </Typography>
        <form onSubmit={(e) => onSavePassword(e)}>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Ancien mot de passe :</FormLabel>
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => onChangeOldPassword(e.target.value)}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Nouveau mot de passe :</FormLabel>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => onChangeNewPassword(e.target.value)}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Confirmer le nouveau mot de passe :</FormLabel>
              <Input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => onChangeConfirmNewPassword(e.target.value)}
                required
              />
            </FormControl>
            <Button type="submit">Enregistrer</Button>
            <Button onClick={onCloseModal}>Annuler</Button>
          </Stack>
          {isError && (
            <Typography variant="body2" color="error">
              Les données ne correspondent pas
            </Typography>
          )}
        </form>
      </section>
    </Modal>
  );
};

export default ChangePasswordModal;
