import {
  useListJourneyMessagesByJourneyQuery,
  usePostJourneyMessageMutation,
} from "@/types/graphql";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { useState } from "react";
import JourneyMessageCard from "./JourneyMessageCard";
import JourneyMessagePost from "./JourneyMessagePost";

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
    error: messagesError,
    refetch: refetchMessages,
  } = useListJourneyMessagesByJourneyQuery({
    variables: {
      journeyId: journeyId,
    },
  });

  const [
    postMessage,
    {
      data: postMessageData,
      loading: postMessageLoading,
      error: postMessageError,
    },
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
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
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
            messages.map(({ id, user: { firstname }, createdAt, message }) => (
              <JourneyMessageCard
                firstname={firstname}
                createdAt={createdAt}
                content={message}
                key={id}
              />
            ))
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
