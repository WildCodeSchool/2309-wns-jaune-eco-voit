import {
  useListJourneyMessagesByJourneyQuery,
  usePostJourneyMessageMutation,
} from "@/types/graphql";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { useState } from "react";
import JourneyMessageCard from "./JourneyMessageCard";
import JourneyMessagePost from "./JourneyMessagePost";
import CircularLoading from "../CircularLoading/CircularLoading";

type JourneyMessagesProps = {
  userId: string;
  journeyId: string;
};

export default function JourneyMessages({
  userId,
  journeyId,
}: JourneyMessagesProps) {
  const [newMessage, setNewMessage] = useState("");

  const {
    data: messagesData,
    loading: messagesLoading,
    refetch: refetchMessages,
  } = useListJourneyMessagesByJourneyQuery({
    variables: {
      journeyId: journeyId,
    },
  });

  const [
    postMessage,
    { loading: postMessageLoading, error: postMessageError },
  ] = usePostJourneyMessageMutation();

  const handlePostMessage = () => {
    postMessage({
      variables: {
        data: {
          user: { id: userId },
          journey: { id: journeyId },
          message: newMessage,
        },
      },
      onCompleted: () => {
        setNewMessage("");
        refetchMessages();
      },
    });
  };

  if (messagesLoading) {
    return <CircularLoading />;
  }

  if (!messagesData) {
    return null;
  }

  const messages = messagesData.listJourneyMessagesByJourney;

  return (
    <>
      <Stack justifyContent={"center"} className="mt-16">
        <Typography variant="h4" component="h4" align="center" height={"10vh"}>
          Messages
        </Typography>
        <div className="container mx-auto p-4">
          {messages && messages.length > 0 ? (
            messages.map(
              ({
                id,
                user: { firstname, profilePicture },
                createdAt,
                message,
              }) => (
                <JourneyMessageCard
                  firstname={firstname}
                  createdAt={createdAt}
                  content={message}
                  profilePicture={profilePicture ?? ""}
                  key={id}
                />
              )
            )
          ) : (
            <div className="text-center text-gray-500">Pas de messages</div>
          )}
        </div>
        <JourneyMessagePost
          onChangeMessageValue={setNewMessage}
          isPostMessageLoading={postMessageLoading}
          isPostNewMessageError={!!postMessageError}
          messageValue={newMessage}
          onPostNewMessage={handlePostMessage}
        />
      </Stack>
    </>
  );
}
