"use client";

import { useFindBookingByIdQuery } from "@/types/graphql";
import { Stack, Typography, CircularProgress } from "@mui/material";

export default function Page({ params }: { params: { id: string } }) {
  const { data, loading, error } = useFindBookingByIdQuery({
    variables: {
      findBookingById: params.id,
    },
  });

  return (
    <Stack
      className="h-full w-10/12"
      alignSelf={"center"}
      display={"flex"}
      justifyContent={"center"}
    >
      {loading && <CircularProgress />}
      {error && (
        <Typography variant="h4" component="h1" align="center">
          Erreur: {error.message}
        </Typography>
      )}
      {data && (
        <>
          {data.findBookingById.status === "ACCEPTED" && (
            <Typography variant="h4" component="h1" align="center">
              Booking accepted
            </Typography>
          )}
          {data && data.findBookingById.status === "PENDING" && (
            <Typography variant="h4" component="h1" align="center">
              Booking pending
            </Typography>
          )}
          {data && data.findBookingById.status === "REFUSED" && (
            <Typography variant="h4" component="h1" align="center">
              Booking refused
            </Typography>
          )}
          {!data ||
            (data &&
              data.findBookingById.status !== "ACCEPTED" &&
              data.findBookingById.status !== "PENDING" &&
              data.findBookingById.status !== "REFUSED" && (
                <Typography variant="h4" component="h1" align="center">
                  Booking not found{" "}
                </Typography>
              ))}
        </>
      )}
    </Stack>
  );
}
