"use client";
import React, { useContext, useState } from "react";
import { Button, Step, StepLabel, Stepper, MobileStepper } from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
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
  price: number;
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
    price: 0,
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

  const {
    origin,
    departure_date,
    destination,
    availableSeats,
    price,
    automaticAccept,
  } = journeyData;

  const handleValidateForm = () => {
    console.log("tik");
    if (
      !origin ||
      !destination ||
      departure_date < dayjs() ||
      price === 0 ||
      availableSeats === 0 ||
      !userId
    ) {
      console.log(
        "error",
        origin,
        destination,
        departure_date,
        price,
        availableSeats,
        userId
      );
      return;
    }

    const journey: CreateJourneyInput = {
      departure_time: departure_date.toISOString(),
      arrival_time: departure_date.add(2, "hour").toISOString(),
      origin,
      destination,
      price,
      availableSeats,
      automaticAccept,
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
    <div className="publish_page flex flex-col space-between gap-8 flex-1 h-full py-8 px-4 w-10/12 mx-auto">
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

      <div className="publish_content flex-1 h-full flex flex-col items-center justify-center">
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
          <div className="flex flex-col justify-center items-center gap-6">
            {/* Steps content */}
            <div className="h-full flex-1 flex flex-col gap-6 items-center justify-center">
              <h3 className="text-2xl text-center xs:text-3xl">
                {steps(setJourneyData, journeyData)[activeStep].stepTitle}
              </h3>
              {steps(setJourneyData, journeyData)[activeStep].stepContent}
            </div>
            {/* Stepper Nav buttons */}
            <div className="stepper_nav md:flex gap-4 hidden">
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
                  activeStep ===
                  steps(setJourneyData, journeyData).length - 1 ? (
                    <Button onClick={handleValidateForm} variant={"contained"}>
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
        )}
      </div>
    </div>
  );
};

export default PublishJourney;
