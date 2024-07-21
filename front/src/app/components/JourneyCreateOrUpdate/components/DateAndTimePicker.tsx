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
  journeyData: { departureTime },
  setJourneyData,
  dateTime,
}: DateAndTimeProps) => {
  function setDepartureTime(departureTime: Dayjs): Dayjs {
    const today = dayjs().startOf("day");
    if (departureTime.isSame(today, "day")) {
      return departureTime.add(2, "hour");
    } else {
      return departureTime;
    }
  }

  return (
    <>
      {dateTime === "date" ? (
        <DateCalendar
          className="date_input"
          value={setDepartureTime(departureTime)}
          onChange={(newValue) =>
            setJourneyData((prevState: JourneyData) => ({
              ...prevState,
              departureTime: newValue,
            }))
          }
          minDate={dayjs()}
          timezone="UTC"
        />
      ) : (
        <TimePicker
          timezone="system"
          value={setDepartureTime(departureTime)}
          onChange={(newValue) => {
            if (newValue) {
              console.log(newValue);
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
    </>
  );
};

export default DateAndTimePicker;
