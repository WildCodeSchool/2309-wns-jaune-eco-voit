import {
  formattedDate,
  formattedTime,
  tooLateToModify,
} from "@/app/utils/date";
import { ListJourneysByUserQuery } from "@/types/graphql";
import {
  TabPanel,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import CircularLoading from "../CircularLoading/CircularLoading";
import TripOriginOutlinedIcon from "@mui/icons-material/TripOriginOutlined";
import { timelineItemClasses } from "@mui/lab/TimelineItem";
import { Button } from "@mui/material";
import Link from "next/link";
import { routes } from "@/app/lib/routes";

type MyJourneysTabProps = {
  journeys?: ListJourneysByUserQuery["listJourneysByUser"];
  onCancelJourney: (id: string) => void;
  isLoading: boolean;
  onEditJourney: (id: string) => void;
};

const MyJourneysTab = ({
  journeys = [],
  onCancelJourney,
  isLoading,
  onEditJourney,
}: MyJourneysTabProps) => {
  return (
    <TabPanel
      value="JOURNEYS"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      {isLoading ? (
        <CircularLoading />
      ) : (
        [...journeys]
          .sort(
            (a, b) => +new Date(a.departureTime) - +new Date(b.departureTime)
          )
          .map((journey, index) => {
            const {
              origin,
              destination,
              departureTime,
              availableSeats,
              price,
              bookings,
              arrivalTime,
              id,
              status,
            } = journey;
            return (
              <div
                key={index}
                className="my_journey_card w-full flex p-4 rounded-md shadow-md"
              >
                <div className="w-full flex flex-col gap-3">
                  <div className="flex flex-col xs:flex-row w-full xs:justify-between gap-4">
                    <p className="text-base">
                      Départ: {formattedDate(departureTime)} à{" "}
                      {formattedTime(departureTime)}
                      <br />
                      Arrivée: {formattedDate(arrivalTime)} à{" "}
                      {formattedTime(arrivalTime)}
                      <br />
                      <span className="text-sm text-dark60">
                        ({availableSeats} siège{availableSeats > 1 && "s"}{" "}
                        disponible{availableSeats > 1 && "s"})
                      </span>
                    </p>
                    <p className="price text-sm px-3 py-1 rounded-md bg-primary100 text-white w-fit h-fit flex-shrink-0">
                      {price} €
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
                  <div className="card_footer flex flex-col item-start xs:flex-row xs:justify-between xs:items-end gap-3">
                    <div className="buttons flex gap-3">
                      {status === "PLANNED" && (
                        <>
                          <Button
                            className=""
                            onClick={() => onCancelJourney(id)}
                          >
                            Annuler
                          </Button>
                          {bookings.length === 0 &&
                            !tooLateToModify(departureTime) && (
                              <Button
                                className=""
                                onClick={() => {
                                  onEditJourney(id);
                                }}
                              >
                                Modifier
                              </Button>
                            )}
                        </>
                      )}
                    </div>
                    <Link
                      href={`${routes["journey"].pathname}/${id}`}
                      className="text-sm underline text-dark80"
                    >
                      Voir le trajet
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
      )}
    </TabPanel>
  );
};

export default MyJourneysTab;
