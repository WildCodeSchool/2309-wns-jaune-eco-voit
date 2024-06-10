import {
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type JourneyMessagePostProps = {
  onChangeMessageValue: (newMessage: string) => void;
  messageValue: string;
  isPostMessageLoading: boolean;
  onPostNewMessage: () => void;
  isPostNewMessageError: boolean;
};

export default function JourneyMessagePost({
  messageValue,
  onChangeMessageValue,
  isPostMessageLoading,
  isPostNewMessageError,
  onPostNewMessage,
}: JourneyMessagePostProps) {
  return (
    <Stack
      direction={"column"}
      spacing={2}
      alignItems={"center"}
      className="mt-8"
    >
      <TextField
        label="Votre message"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={messageValue}
        onChange={(e) => onChangeMessageValue(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={onPostNewMessage}
        disabled={isPostMessageLoading}
        sx={{ borderRadius: "20px" }}
      >
        {isPostMessageLoading ? <CircularProgress size={24} /> : "Envoyer"}
      </Button>
      {isPostNewMessageError && (
        <Typography variant="body2" color="error">
          Quelque chose s'est mal passé
        </Typography>
      )}
    </Stack>
  );
}
