import { formattedDate, formattedTime } from "@/app/utils/date";
import {
    BookingEntity,
    JourneyEntity,
    ListJourneysByUserQuery,
    UserEntity,
    useAcceptBookingMutation,
    useListJourneysByUserQuery,
    useRejectBookingMutation,
} from "@/types/graphql";
import {
    TabPanel, Timeline, TimelineConnector, TimelineContent, TimelineItem, timelineItemClasses, TimelineSeparator
} from "@mui/lab";
import { Avatar, Button, Card, CardContent, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AvatarJourney from "../Avatar/AvatarJouney";
import TripOriginOutlinedIcon from "@mui/icons-material/TripOriginOutlined";
import { statusFrench } from "@/app/utils/generals";
import { Status } from "@/types/booking";

type OnPendingTabProps = {
    journeysRefetch: () => void;
    journeys?: ListJourneysByUserQuery["listJourneysByUser"];
};


type BookingsArrayWithJourneyInfos = Omit<BookingEntity, "journey" | "user"> &
    Pick<
        JourneyEntity,
        | "destination"
        | "arrivalTime"
        | "availableSeats"
        | "departureTime"
        | "price"
        | "origin"
    > & { user: Pick<UserEntity, "firstname" | "lastname" | "profilePicture"> };

const OnPendingTab = ({ journeys, journeysRefetch }: OnPendingTabProps) => {
    const [bookingsPending, setBookingsPending] = useState<BookingsArrayWithJourneyInfos[]>([]);
    const [
        acceptBooking,
        { error: acceptBookingError, loading: acceptBookingLoading },
    ] = useAcceptBookingMutation({});

    const [
        rejectBooking,
        { error: rejectBookingError, loading: rejectBookingLoading },
    ] = useRejectBookingMutation({});

    const handleAccept = (bookingId: string) => {
        acceptBooking({
            variables: {
                acceptBookingId: bookingId,
            },
            onCompleted: () => {
                journeysRefetch()
            },
        });
    };

    const handleReject = (bookingId: string) => {
        rejectBooking({
            variables: {
                rejectBookingId: bookingId,
            },
            onCompleted: () => {
                journeysRefetch()
            },
        });
    };

    useEffect(() => {
        if (journeys && journeys.length) {
            const bookingsPendingArray: BookingsArrayWithJourneyInfos[] = [];
            journeys.forEach((journey) => {
                if (journey.bookings.length) {
                    journey.bookings.forEach(
                        ({ createdAt, id, status, user, nbPassenger }) => {
                            if (status === "PENDING") {
                                const {
                                    arrivalTime,
                                    departureTime,
                                    origin,
                                    availableSeats,
                                    price,
                                    destination,
                                } = journey;
                                bookingsPendingArray.push({
                                    arrivalTime,
                                    departureTime,
                                    origin,
                                    availableSeats,
                                    price,
                                    destination,
                                    createdAt,
                                    id,
                                    status,
                                    nbPassenger,
                                    user: {
                                        firstname: user.firstname,
                                        lastname: user.lastname,
                                        profilePicture: user.profilePicture,
                                    },
                                });
                            }
                        }
                    );
                }
            });
            setBookingsPending(bookingsPendingArray);
        }
    }, [journeys]);

    console.log("bookingsPending", bookingsPending)
    return (
        <>
            <TabPanel value="PENDING">
                {bookingsPending.length ? (
                    bookingsPending.map(
                        ({
                            status,
                            id,
                            nbPassenger,
                            origin,
                            availableSeats,
                            price,
                            destination,
                            departureTime,
                            user: { profilePicture, firstname },
                        }) => (
                            <div key={id} className="my_pending_card w-1/3 flex p-4 rounded-md shadow-md">
                                <div className="w-full flex flex-col gap-3">
                                    <div className="flex flex-col xs:flex-row w-full xs:justify-between gap-4">
                                        <p className="text-base">
                                            {formattedDate(departureTime)} à{" "}
                                            {formattedTime(departureTime)}
                                            <br />
                                            <span className="text-sm text-dark60">
                                                ({nbPassenger} siège{nbPassenger > 1 && "s"}{" "}
                                                réservé{nbPassenger > 1 && "s"})
                                            </span>
                                        </p>
                                        <p className="price text-sm px-3 py-1 rounded-md bg-primary100 text-white w-fit h-fit flex-shrink-0">
                                            {price * nbPassenger} €
                                        </p>
                                    </div>
                                    <div>
                                        <p className="status text-sm px-3 py-1 rounded-md bg-primary100 text-white w-fit h-fit flex-shrink-0 justify-self-end">
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
                                        <AvatarJourney
                                            id={id}
                                            firstname={firstname}
                                            profilePicture={profilePicture ?? undefined}
                                        />
                                    </div>
                                    <div className="card_footer flex flex-col item-start xs:flex-row xs:justify-between xs:items-end gap-3">
                                        <div className="buttons flex gap-3 justify-content-center">
                                            {status === "PENDING" && (
                                                <>
                                                    <Button onClick={() => handleAccept(id)}>Accepter</Button>
                                                    <Button onClick={() => handleReject(id)}>Refuser</Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )
                ) : (
                    <Typography variant="body1" className="text-center mt-4">
                        Vous n&apos;avez pas de booking en attente.
                    </Typography>
                )}
            </TabPanel>
        </>
    );
};

export default OnPendingTab;
