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

dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.locale(fr);

type DateAndTimeProps = {
  journeyData: JourneyData;
  setJourneyData: UpdateOrCreateJourneyProps["setJourneyData"];
  dateTime: "date" | "time";
};

const DateAndTimePicker = ({
  journeyData: { departure_date },
  setJourneyData,
  dateTime,
}: DateAndTimeProps) => {
  function setDepartureTime(departureDate: Dayjs): Dayjs {
    const today = dayjs().startOf("day");
    if (departureDate.isSame(today, "day")) {
      return departureDate.add(2, "hour");
    } else {
      return departureDate;
    }
  }

  return (
    <>
      {dateTime === "date" ? (
        <DateCalendar
          className="date_input"
          value={setDepartureTime(departure_date)}
          onChange={(newValue) =>
            setJourneyData((prevState: JourneyData) => ({
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
          value={setDepartureTime(departure_date)}
          onChange={(newValue) => {
            if (newValue) {
              setJourneyData((prevState: JourneyData) => ({
                ...prevState,
                departure_date: newValue,
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
