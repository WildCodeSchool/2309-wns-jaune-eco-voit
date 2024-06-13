import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import dayjs from "dayjs";
import TripOriginOutlinedIcon from "@mui/icons-material/TripOriginOutlined";

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
          <p className="font-semibold">
            {dayjs(departureTime).format("HH:mm")}
          </p>
          <p className="font-bold text-dark60 text-sm"> 10h20</p>
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
          <p className="font-semibold">{dayjs(arrivalTime).format("HH:mm")}</p>
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
