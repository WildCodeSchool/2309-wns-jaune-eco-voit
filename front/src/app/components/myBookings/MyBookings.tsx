import { formattedDate, formattedTime } from "@/app/utils/date";
import { ListBookingsByUserQuery } from "@/types/graphql";
import {
  TabPanel,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import { Button, Link } from "@mui/material";
import TripOriginOutlinedIcon from "@mui/icons-material/TripOriginOutlined";
import { timelineItemClasses } from "@mui/lab/TimelineItem";
import CircularLoading from "../CircularLoading/CircularLoading";
import { routes } from "@/app/lib/routes";
import { statusFrench } from "@/app/utils/generals";
import { Grade } from "@/types/user";
import { Status } from "@/types/booking";
import AvatarJourney from "../Avatar/AvatarJouney";

type MyBookingsTabProps = {
  bookings?: ListBookingsByUserQuery["listBookingsByUser"];
  onCancelBooking: (id: string) => void;
  isLoading: boolean;
};

const MyBookingsTab = ({
  bookings = [],
  onCancelBooking,
  isLoading,
}: MyBookingsTabProps) => {
  return (
    <TabPanel
      value="BOOKINGS"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      {isLoading ? (
        <CircularLoading />
      ) : (
        [...bookings]
          .sort((a, b) => {
            if (a.status === "ACCEPTED" && b.status !== "ACCEPTED") return -1;
            if (b.status === "ACCEPTED" && a.status !== "ACCEPTED") return 1;

            return (
              +new Date(a.journey.departureTime) -
              +new Date(b.journey.departureTime)
            );
          })
          .map(
            (
              {
                status,
                id,
                journey: {
                  id: journeyId,
                  departureTime,
                  destination,
                  origin,
                  user: {
                    id: userId,
                    profilePicture,
                    firstname,
                    grade,
                    averageRate,
                  },
                },
              },
              index
            ) => (
              <div
                key={index}
                className={`my_journey_card w-full flex p-4 rounded-md shadow-md ${
                  status !== "ACCEPTED" ? "opacity-70" : ""
                }`}
              >
                <div className="w-full flex flex-col gap-3">
                  <div className="flex flex-col xs:flex-row w-full xs:justify-between gap-4">
                    <p className="text-base">
                      {formattedDate(departureTime)} à{" "}
                      {formattedTime(departureTime)}
                      <br />
                    </p>
                    <p className="price text-sm px-3 py-1 rounded-md bg-primary100 text-white w-fit h-fit flex-shrink-0">
                      {statusFrench[status as Status]}
                    </p>
                  </div>
                  <div className="TimeLine flex items-center w-full border border-dark20 rounded-md p-4 h-fit">
                    <Timeline
                      sx={{
                        "ul.MuiTimeline-root": { padding: 0 },
                        ".MuiTimelineItem-root": { padding: 0, minHeight: 0 },
                        [`& .${timelineItemClasses.root}:before`]: {
                          flex: 0,
                          padding: 0,
                        },
                      }}
                    >
                      <TimelineItem className="h-20">
                        <TimelineSeparator>
                          <TripOriginOutlinedIcon
                            fontSize="small"
                            color="primary"
                            sx={{ marginBottom: 0, padding: 0 }}
                          />
                          <TimelineConnector
                            sx={{
                              bgcolor: "primary.main",
                              height: "200px",
                              width: "3px",
                            }}
                          />
                        </TimelineSeparator>
                        <TimelineContent>
                          <div>
                            <p className="text-xs text-dark80">ORIGINE</p>
                            <p>{origin}</p>
                          </div>
                        </TimelineContent>
                      </TimelineItem>
                      <TimelineItem className="h-fit">
                        <TripOriginOutlinedIcon
                          fontSize="small"
                          color="primary"
                        />
                        <TimelineContent>
                          <div>
                            <p className="text-xs text-dark80">DESTINATION</p>
                            <p>{destination}</p>
                          </div>
                        </TimelineContent>
                      </TimelineItem>
                    </Timeline>
                  </div>
                  <AvatarJourney
                    id={userId}
                    firstname={firstname}
                    grade={grade as Grade}
                    rating={averageRate}
                    profilePicture={profilePicture ?? undefined}
                  />
                  <div className="card_footer flex flex-col item-start xs:flex-row xs:justify-between xs:items-end gap-3">
                    <div className="buttons flex gap-3">
                      <Button
                        onClick={() => onCancelBooking(id)}
                        disabled={status !== "ACCEPTED"}
                      >
                        Annuler
                      </Button>
                    </div>
                    <Link
                      href={`${routes["journey"].pathname}/${journeyId}`}
                      className="text-sm underline text-dark80"
                    >
                      Voir le trajet
                    </Link>
                  </div>
                </div>
              </div>
            )
          )
      )}
    </TabPanel>
  );
};

export default MyBookingsTab;
