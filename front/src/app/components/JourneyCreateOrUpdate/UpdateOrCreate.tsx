"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { Button, Step, StepLabel, Stepper, MobileStepper } from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { stepsData as steps } from "./stepsData";
import { Dayjs } from "dayjs";
export type JourneyData = {
  origin: string;
  destination: string;
  departureTime: Dayjs;
  price: number;
  automaticAccept: boolean;
  availableSeats: number;
  originCoordinates: string;
  destinationCoordinates: string;
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
  // errorMessage,
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
    <div className="publish_page flex flex-col space-between gap-8 flex-1 h-full py-8 px-4 w-10/12 mx-auto">
      <div className="stepper_indicator md:block hidden">
        <Stepper activeStep={activeStep}>
          {steps(setJourneyData, journeyData).map((step) => (
            <Step key={step.stepName}>
              <StepLabel>{step.stepName}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      <div className="publish_content flex-1 h-full flex flex-col items-center justify-center">
        {/* {"aa" == "vv" ? (
          <div className="h-full flex-1 flex flex-col gap-3 items-center justify-center">
            <h3 className="text-2xl text-center xs:text-3xl">
              Impossible de créer le trajet!
            </h3>
          </div>
        ) : ( */}
        <div className="flex flex-col justify-center items-center gap-6">
          <div className="h-full flex-1 flex flex-col gap-6 items-center justify-center">
            <h3 className="text-2xl text-center xs:text-3xl">
              {steps(setJourneyData, journeyData)[activeStep].stepTitle}
            </h3>
            {steps(setJourneyData, journeyData)[activeStep].stepContent}
          </div>
          <div className="stepper_nav md:flex gap-4 hidden">
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
          <div className="md:hidden flex justify-center w-full">
            <MobileStepper
              variant="progress"
              steps={7}
              position="static"
              activeStep={activeStep}
              sx={{ maxWidth: 400, flexGrow: 1 }}
              nextButton={
                activeStep === steps(setJourneyData, journeyData).length - 1 ? (
                  <Button onClick={handleOnValidateForm} variant={"contained"}>
                    Terminer
                  </Button>
                ) : (
                  <Button
                    size="small"
                    onClick={handleNext}
                    disabled={
                      (activeStep === 0 && !origin) ||
                      (activeStep === 1 && !destination) ||
                      (activeStep === 5 && price === 0)
                    }
                  >
                    Suivant
                    <KeyboardArrowRight />
                  </Button>
                )
              }
              backButton={
                <Button
                  size="small"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  <KeyboardArrowLeft />
                  Retour
                </Button>
              }
            />
          </div>
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default UpdateOrCreateJourney;
