"use client";
import React, { useContext, useState } from "react";
import { Button, Step, StepLabel, Stepper } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import fr from "dayjs/locale/fr";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { AuthContext } from "@/context/authContext";
import { useMutation } from "@apollo/client";
import { CREATE_JOURNEY } from "@/requetes/mutations/journey.mutations";
import { CreateJourneyInput } from "@/types/graphql";
import { useRouter } from "next/navigation";
import { routes } from "@/app/lib/routes";
import { stepsData as steps } from "./stepsData";
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.locale(fr);

export type JourneyData = {
  origin: string;
  destination: string;
  departure_date: Dayjs;
  totalPrice: number;
  automaticAccept: boolean;
  availableSeats: number;
};

const PublishJourney = () => {
  const { getUser: userId } = useContext(AuthContext);
  const router = useRouter();
  const [
    createJourney,
    { data: createJourneySuccess, error: createJourneyError },
  ] = useMutation(CREATE_JOURNEY);

  const [journeyData, setJourneyData] = useState<JourneyData>({
    origin: "",
    destination: "",
    departure_date: dayjs(),
    totalPrice: 0,
    automaticAccept: true,
    availableSeats: 1,
  });

  const [activeStep, setActiveStep] = useState<number>(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleValidateForm = () => {
    if (
      !journeyData.origin ||
      !journeyData.destination ||
      journeyData.departure_date < dayjs() ||
      journeyData.totalPrice === 0 ||
      journeyData.availableSeats === 0 ||
      !userId
    )
      return;

    const journey: CreateJourneyInput = {
      departure_time: journeyData.departure_date.toISOString(),
      arrival_time: journeyData.departure_date.add(2, "hour").toISOString(),
      origin: journeyData.origin,
      destination: journeyData.destination,
      totalPrice: journeyData.totalPrice,
      availableSeats: journeyData.availableSeats,
      automaticAccept: journeyData.automaticAccept,
      user: { id: userId },
    };

    createJourney({
      variables: { data: journey },
      onCompleted: (res) => {
        setTimeout(() => {
          router.push(`${routes.journey.pathname}/${res?.createJourney.id}`);
        }, 1500);
      },
      onError: (err) => console.error("error", err),
    });
  };

  return (
    <div className="publish_page flex flex-col space-between gap-8 flex-1 h-full w-full py-8 px-4">
      <div className="stepper_indicator md:block hidden">
        <Stepper activeStep={activeStep}>
          {steps(setJourneyData, journeyData).map((step) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            return (
              <Step key={step.stepName} {...stepProps}>
                <StepLabel {...labelProps}>{step.stepName}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </div>

      <div className="publish_content flex-1 h-full flex flex-col items-center">
        {createJourneyError ? (
          <div className="h-full flex-1 flex flex-col gap-3 items-center justify-center">
            <h3 className="text-2xl text-center xs:text-3xl">
              Impossible de créer le trajet!
            </h3>
            <p>{createJourneyError.message}</p>
          </div>
        ) : createJourneySuccess ? (
          <div className="h-full flex-1 flex flex-col gap-3 items-center justify-center">
            <h3 className="text-2xl text-center xs:text-3xl">
              Félicitations, votre trajet est en ligne!
            </h3>
          </div>
        ) : (
          <>
            {/* Steps content */}
            <div className="h-full flex-1 flex flex-col gap-6 items-center justify-center">
              <h3 className="text-2xl text-center xs:text-3xl">
                {steps(setJourneyData, journeyData)[activeStep].stepTitle}
              </h3>
              {steps(setJourneyData, journeyData)[activeStep].stepContent}
            </div>
            {/* Stepper Nav buttons */}
            <div className="stepper_nav flex gap-4">
              <Button
                variant={"contained"}
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Retour
              </Button>
              {activeStep === steps(setJourneyData, journeyData).length - 1 ? (
                <Button onClick={handleValidateForm} variant={"contained"}>
                  Terminer
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant={"contained"}
                  disabled={
                    (activeStep === 0 && !journeyData.origin) ||
                    (activeStep === 1 && !journeyData.destination) ||
                    (activeStep === 5 && journeyData.totalPrice === 0)
                  }
                >
                  Suivant
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PublishJourney;
