import { formattedDate, formattedTime } from "@/app/utils/date";
import { statusFrench } from "@/app/utils/generals";
import { Status } from "@/types/booking";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from "@mui/lab";
import AvatarJourney from "../Avatar/AvatarJouney";
import { Grade } from "@/types/user";
import { Button } from "@mui/material";
import Link from "next/link";
import { routes } from "@/app/lib/routes";
import TripOriginOutlinedIcon from "@mui/icons-material/TripOriginOutlined";
import { ArrayElementType } from "@/types/utils";
import {
  ListBookingsByUserQuery,
  useCancelBookingMutation,
  useCreatePaymentSessionLazyQuery,
} from "@/types/graphql";
import { useRouter } from "next/navigation";
import CircularLoading from "../CircularLoading/CircularLoading";

type MyBookingCardProps = {
  booking: ArrayElementType<ListBookingsByUserQuery["listBookingsByUser"]>;
  onCompleteCancelBooking: () => void;
};

const MyBookingCard = ({
  booking: {
    status,
    id,
    nbPassenger,
    journey: {
      id: journeyId,
      departureTime,
      destination,
      origin,
      price,
      user: {
        id: driverId,
        profilePicture: driverProfilePicture,
        firstname: driverFirstname,
        grade: driverGrade,
        averageRate: driverAverageRate,
      },
    },
  },
  onCompleteCancelBooking,
}: MyBookingCardProps) => {
  const router = useRouter();

  const [cancelBooking, { loading: cancelBookingLoading }] =
    useCancelBookingMutation({
      fetchPolicy: "network-only",
    });

  const [createPaymentSession] = useCreatePaymentSessionLazyQuery();

  const handleCancelBooking = () => {
    cancelBooking({
      variables: { cancelBookingId: id },
      onCompleted: () => {
        onCompleteCancelBooking();
      },
    });
  };

  const onLaunchPaymentSession = () => {
    createPaymentSession({
      variables: {
        data: {
          nbPassenger,
          bookingId: id,
          price,
        },
      },
      onCompleted(res) {
        router.push(res.createSession.url);
      },
      onError(error) {
        //TODO GERER L'ERREUR
        console.log(error);
      },
    });
  };

  if (cancelBookingLoading) {
    return <CircularLoading />;
  }

  return (
    <div
      className={`my_journey_card w-full flex p-4 rounded-md shadow-md ${
        status === "REJECTED" || status === "CANCELLED" || status === "PENDING"
          ? "opacity-70"
          : ""
      }`}
    >
      <div className="w-full flex flex-col gap-3">
        <div className="flex flex-col xs:flex-row w-full xs:justify-between gap-4">
          <p className="text-base">
            {formattedDate(departureTime)} à {formattedTime(departureTime)}
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
              <TripOriginOutlinedIcon fontSize="small" color="primary" />
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
          id={driverId}
          firstname={driverFirstname}
          grade={driverGrade as Grade}
          rating={driverAverageRate}
          profilePicture={driverProfilePicture ?? undefined}
        />
        <div className="card_footer flex flex-col item-start xs:flex-row xs:justify-between xs:items-end gap-3">
          <div className="buttons flex gap-3">
            <Button
              onClick={handleCancelBooking}
              disabled={
                status === "RATED" ||
                status === "REJECTED" ||
                status === "PAID" ||
                status === "DONE" ||
                status === "RATED"
              }
            >
              Annuler
            </Button>
            {status === "ACCEPTED" && (
              <Button onClick={onLaunchPaymentSession}>
                Payer pour confimer
              </Button>
            )}
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
  );
};

export default MyBookingCard;
