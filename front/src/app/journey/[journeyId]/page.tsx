"use client";
import { AuthContext } from "@/context/authContext";
import { FIND_JOURNEY_BY_ID } from "@/requetes/queries/journey.queries";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

const JourneyDetails = ({ params }: { params: { journeyId: string } }) => {
  const { data, loading, error } = useQuery(FIND_JOURNEY_BY_ID, {
    variables: { findJourneyById: params.journeyId },
  });

  const { getUser: userId } = useContext(AuthContext);

  console.log("loading", loading);
  console.log("data", data);

  if (error) return <div>{error.message}</div>;
  if (loading) return <div>Loading...</div>;

  //Vérifier que l'utilisateur est authentifier et qu'il a le droit de voir cette page (créateur de la journey ou admin)
  return (
    <div>
      <div>
        {data?.findJourneyById?.origin} - {data?.findJourneyById?.destination}
      </div>
      {data?.findJourneyById?.user?.id !== userId ? null : (
        <Button>Modifier</Button>
      )}
    </div>
  );
};

export default JourneyDetails;
