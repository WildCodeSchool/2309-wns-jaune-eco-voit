import { useEffect, useState } from "react";
import {
  BookingEntity,
  useCancelBookingMutation,
  useListBookingsQuery,
  UserEntity,
} from "@/types/graphql";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CircularLoading from "@/app/components/CircularLoading/CircularLoading";
import { statusBookingFrench } from "@/app/utils/generals";
import { BookingStatus } from "@/types/booking";
import { Tooltip } from "@mui/material";

const BookingsAdmin = () => {
  const [bookings, setBookings] = useState<BookingEntity[]>([]);

  const {
    data: bookingsData,
    error: bookingsError,
    loading: bookingsLoading,
    refetch: refetchBookings,
  } = useListBookingsQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const [
    cancelBooking,
    { error: cancelBookingError, loading: cancelBookingLoading },
  ] = useCancelBookingMutation({
    onCompleted: () => {
      refetchBookings();
    },
  });

  useEffect(() => {
    if (bookingsData?.listBookings) {
      setBookings(bookingsData?.listBookings as BookingEntity[]);
    }
  }, [bookingsData]);

  const columns: GridColDef[] = [
    {
      field: "user.firstname",
      headerName: "Passager",
      width: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams<BookingEntity>) => (
        <div className="truncate">
          {params.row.user.firstname} {params.row.user.lastname}
        </div>
      ),
    },
    {
      field: "journey.user.firstname",
      headerName: "Conducteur",
      width: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams<BookingEntity>) => (
        <div className="truncate">
          {params.row.journey.user.firstname} {params.row.journey.user.lastname}
        </div>
      ),
    },
    {
      field: "journey.origin",
      headerName: "Départ / Arrivée",
      width: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams<BookingEntity>) => (
        <div className="truncate">
          {params.row.journey.origin} - {params.row.journey.destination}
        </div>
      ),
    },
    {
      field: "journey.departureTime",
      headerName: "Date de départ",
      width: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams<BookingEntity>) => (
        <div className="truncate">
          {new Date(params.row.journey.departureTime as Date).toLocaleString()}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      flex: 1,
      valueFormatter(params) {
        return statusBookingFrench[params.value as BookingStatus];
      },
    },
    {
      field: "deleteButton",
      headerName: "Actions",
      description: "Actions column",
      sortable: false,
      align: "center",
      filterable: false,
      disableColumnMenu: true,
      editable: false,
      renderCell: (params: GridRenderCellParams<UserEntity>) => {
        if (cancelBookingError) return <div>Une erreur est survenue</div>;
        if (cancelBookingLoading) return <CircularLoading size={30} />;
        return params.row.status === "PENDING" ||
          params.row.status === "ACCEPTED" ? (
          <Tooltip title="Annuler la réservation">
            <EventBusyIcon
              className="cursor-pointer"
              onClick={() => {
                cancelBooking({
                  variables: {
                    cancelBookingId: params.row.id,
                  },
                });
              }}
            />
          </Tooltip>
        ) : (
          "-"
        );
      },
    },
  ];

  if (bookingsLoading) return <CircularLoading />;
  if (bookingsError) return <div>Error</div>;

  return (
    <section className="users_admin">
      <h3 className="mb-4">Réservations</h3>
      <DataGrid
        columns={columns}
        rows={bookings || []}
        paginationModel={{ pageSize: 25, page: 0 }}
        className="bg-white"
      />
    </section>
  );
};

export default BookingsAdmin;
