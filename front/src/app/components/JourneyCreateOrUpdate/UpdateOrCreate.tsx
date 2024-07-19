"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { Button, Step, StepLabel, Stepper } from "@mui/material";
import { stepsData as steps } from "./stepsData";

export type JourneyData = {
  origin: string;
  destination: string;
  departure_date: any;
  price: number;
  automaticAccept: boolean;
  availableSeats: number;
  originCoordonates: string;
  destinationCoordonates: string;
};

export type UpdateOrCreateJourneyProps = {
  setJourneyData: Dispatch<SetStateAction<JourneyData>>;
  journeyData: JourneyData;
  errorMessage?: string;
  successMessage?: string;
  handleOnValidateForm: () => void;
};

const UpdateOrCreateJourney = ({
  setJourneyData,
  journeyData,
  errorMessage,
  handleOnValidateForm,
}: UpdateOrCreateJourneyProps) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const { origin, destination, price } = journeyData;

  return (
    <div className="publish_page flex flex-col space-between gap-8 flex-1 h-full w-full py-8 px-4">
      <div className="stepper_indicator md:block hidden">
        <Stepper activeStep={activeStep}>
          {steps(setJourneyData, journeyData).map((step) => (
            <Step key={step.stepName}>
              <StepLabel>{step.stepName}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      <div className="publish_content flex-1 h-full flex flex-col items-center">
        {!!errorMessage && (
          <div className="h-full flex-1 flex flex-col gap-3 items-center justify-center">
            <h3 className="text-2xl text-center xs:text-3xl">
              Impossible de créer le trajet!
            </h3>
          </div>
        )}
        <div className="h-full flex-1 flex flex-col gap-6 items-center justify-center">
          <h3 className="text-2xl text-center xs:text-3xl">
            {steps(setJourneyData, journeyData)[activeStep].stepTitle}
          </h3>
          {steps(setJourneyData, journeyData)[activeStep].stepContent}
        </div>
        <div className="stepper_nav flex gap-4">
          <Button
            variant={"contained"}
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Retour
          </Button>
          {activeStep === steps(setJourneyData, journeyData).length - 1 ? (
            <Button onClick={handleOnValidateForm} variant={"contained"}>
              Terminer
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant={"contained"}
              disabled={
                (activeStep === 0 && !origin) ||
                (activeStep === 1 && !destination) ||
                (activeStep === 5 && price === 0)
              }
            >
              Suivant
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateOrCreateJourney;
