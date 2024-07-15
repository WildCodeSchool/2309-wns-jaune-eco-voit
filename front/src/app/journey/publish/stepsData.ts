import { Dispatch, SetStateAction } from "react";
import CityInput from "./components/CityInput";
import CountInput from "./components/CountInput";
import DateAndTimePicker from "./components/DateAndTimePicker";
import { JourneyData } from "./page";
import Options from "./components/Options";

export const stepsData = (
  setJourneyData: Dispatch<SetStateAction<JourneyData>>,
  journeyData: JourneyData
) => {
  return [
    {
      stepName: "Départ",
      stepContent: CityInput({
        setJourneyData,
        fromTo: "origin",
        defaultValue: journeyData?.origin,
      }),
      stepTitle: "D'où partez-vous?",
    },
    {
      stepName: "Arrivée",
      stepContent: CityInput({
        setJourneyData,
        fromTo: "destination",
        defaultValue: journeyData?.destination,
      }),
      stepTitle: "Où allez-vous?",
    },
    {
      stepName: "Date",
      stepContent: DateAndTimePicker({
        dateTime: "date",
        journeyData,
        setJourneyData,
      }),
      stepTitle: "Choisissez la date de votre départ",
    },
    {
      stepName: "Horaire",
      stepContent: DateAndTimePicker({
        dateTime: "time",
        journeyData,
        setJourneyData,
      }),
      stepTitle: "Choisissez l'heure de votre départ",
    },
    {
      stepName: "Passagers",
      stepContent: CountInput({
        availableSeatsOrPrice: "availableSeats",
        setJourneyData,
        journeyData,
        minValue: 1,
        maxValue: 8,
      }),
      stepTitle: "Combien de passagers acceptez-vous?",
    },
    {
      stepName: "Prix",
      stepContent: CountInput({
        availableSeatsOrPrice: "price",
        setJourneyData,
        journeyData,
      }),
      stepTitle: "Fixez le prix par passager",
    },
    {
      stepName: "Options",
      stepContent: Options({ setJourneyData, journeyData }),
      stepTitle: "Activer la réservation automatique?",
    },
  ];
};
