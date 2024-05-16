import React from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import fr from "dayjs/locale/fr";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { JourneyData } from "../page";

dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.locale(fr);

type DateAndTimeProps = {
  journeyData: JourneyData;
  setJourneyData: React.Dispatch<React.SetStateAction<JourneyData>>;
  dateTime: "date" | "time";
};

const DateAndTimePicker = ({
  journeyData,
  setJourneyData,
  dateTime,
}: DateAndTimeProps) => {
  return (
    <>
      {dateTime === "date" ? (
        <DateCalendar
          className="date_input"
          value={journeyData.departure_date}
          onChange={(newValue) =>
            setJourneyData((prevState) => ({
              ...prevState,
              departure_date: newValue,
            }))
          }
          minDate={dayjs()}
          timezone="UTC"
        />
      ) : (
        <TimePicker
          timezone="system"
          value={journeyData.departure_date}
          onChange={(newValue) => {
            console.log("newValue", newValue);
            if (newValue) {
              setJourneyData((prevState) => ({
                ...prevState,
                departure_date: newValue > dayjs() ? newValue : dayjs(),
              }));
            }
          }}
          label="departure_time"
          ampm={false}
        />
      )}
    </>
  );
};

export default DateAndTimePicker;
