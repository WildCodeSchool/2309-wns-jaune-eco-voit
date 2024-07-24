import dayjs from "dayjs";

export const formattedTime = (time: Date) => {
  return dayjs(time).format("HH[h]mm");
};

export const formattedDate = (day: Date) => {
  return dayjs(day).locale("fr").format("dddd D MMMM");
};

export const tooLateToBook = (date: Date) =>
  dayjs(date).subtract(45, "minute") < dayjs();

export const tooLateToModify = (date: Date) =>
  dayjs(date).subtract(2, "hour") < dayjs();

export const calculateJourneyDuration = ({
  departureTime,
  arrivalTime,
}: {
  departureTime: Date;
  arrivalTime: Date;
}): string => {
  const departure = dayjs(departureTime);
  const arrival = dayjs(arrivalTime);

  const totalMinutes = arrival.diff(departure, "minute");

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // On s'assure qu'on a toujours 2 chiffres pour les minutes avec padStart
  return `${hours}h${minutes.toString().padStart(2, "0")}`;
};
