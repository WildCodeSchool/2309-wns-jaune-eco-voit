import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import fr from "dayjs/locale/fr";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  JourneyData,
  UpdateOrCreateJourneyProps,
} from "@/app/components/JourneyCreateOrUpdate/UpdateOrCreate";
import { useState } from "react";

dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.locale(fr);

type DateAndTimeProps = {
  journeyData: JourneyData;
  setJourneyData: UpdateOrCreateJourneyProps["setJourneyData"];
  dateTime: "date" | "time";
};

const DateAndTimePicker = ({
  journeyData: { departureTime },
  setJourneyData,
  dateTime,
}: DateAndTimeProps) => {
  const [error, setError] = useState(false);

  const getDepartureTime = (departureTime: Dayjs): Dayjs =>
    departureTime.isSame(dayjs().startOf("day"), "day")
      ? departureTime.add(2, "hour")
      : departureTime;

  return (
    <>
      {dateTime === "date" ? (
        <DateCalendar
          className="date_input"
          value={departureTime}
          onChange={(newValue) =>
            setJourneyData((prevState: JourneyData) => ({
              ...prevState,
              departureTime: getDepartureTime(newValue),
            }))
          }
          minDate={dayjs()}
          timezone="UTC"
        />
      ) : (
        <TimePicker
          timezone="system"
          value={departureTime}
          onChange={(newValue) => {
            if (newValue) {
              if (newValue < dayjs().add(118, "minute")) {
                setError(true);
              }
              setJourneyData((prevState: JourneyData) => ({
                ...prevState,
                departureTime: newValue,
              }));
            }
          }}
          label="departureTime"
          ampm={false}
        />
      )}
      {error && "Votre heure de départ ne peut pas être dans moins de 2h"}
    </>
  );
};

export default DateAndTimePicker;
