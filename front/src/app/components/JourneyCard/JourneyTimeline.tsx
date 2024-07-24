import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import { Dayjs } from "dayjs";
import TripOriginOutlinedIcon from "@mui/icons-material/TripOriginOutlined";
import { calculateJourneyDuration, formattedTime } from "@/app/utils/date";

type JourneyTimelineProps = {
  departureTime: Dayjs;
  arrivalTime: Dayjs;
  origin: string;
  destination: string;
};

export default function JourneyTimeline({
  departureTime,
  arrivalTime,
  origin,
  destination,
}: any) {
  return (
    <Timeline>
      <TimelineItem>
        <TimelineOppositeContent color="textSecondary">
          <p className="font-semibold">{formattedTime(departureTime)}</p>
          <p className="font-bold text-dark60 text-sm">
            {" "}
            {calculateJourneyDuration({ arrivalTime, departureTime })}
          </p>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TripOriginOutlinedIcon color="primary" sx={{ marginBottom: 0 }} />
          <TimelineConnector
            sx={{ bgcolor: "primary.main", height: "200px", width: "4px" }}
          />
        </TimelineSeparator>
        <TimelineContent>
          <p className="font-semibold">{origin}</p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent color="textSecondary">
          <p className="font-semibold">{formattedTime(arrivalTime)}</p>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TripOriginOutlinedIcon color="primary" />
        </TimelineSeparator>
        <TimelineContent>
          <p className="font-semibold">{destination}</p>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
