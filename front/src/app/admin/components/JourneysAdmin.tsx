import { useEffect, useState } from "react";
import {
  JourneyEntity,
  useListJourneysQuery,
  useUpdateJourneyStatusMutation,
} from "@/types/graphql";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CircularLoading from "@/app/components/CircularLoading/CircularLoading";
import { statusJourneyFrench } from "@/app/utils/generals";
import { Tooltip } from "@mui/material";
import { JourneyStatus } from "@/types/journey";

const JourneysAdmin = () => {
  const [journeys, setJourneys] = useState<JourneyEntity[]>([]);

  const {
    data: journeysData,
    error: journeysError,
    loading: journeysLoading,
    refetch: refetchJourneys,
  } = useListJourneysQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const [
    cancelJourney,
    { error: cancelJourneyError, loading: cancelJourneyLoading },
  ] = useUpdateJourneyStatusMutation({
    onCompleted: () => {
      refetchJourneys();
    },
  });

  useEffect(() => {
    if (journeysData?.listJourneys) {
      setJourneys(journeysData?.listJourneys as JourneyEntity[]);
    }
  }, [journeysData]);

  const columns: GridColDef[] = [
    {
      field: "user.firstname",
      headerName: "Créateur",
      width: 100,
      flex: 1,
      renderCell: (params: GridRenderCellParams<JourneyEntity>) => (
        <div className="truncate">
          {params.row.user.firstname} {params.row.user.lastname}
        </div>
      ),
    },
    {
      field: "origin",
      headerName: "Départ / Arrivée",
      width: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams<JourneyEntity>) => (
        <div className="truncate">
          {params.row.origin} - {params.row.destination}
        </div>
      ),
    },
    {
      field: "departureTime",
      headerName: "Date de départ",
      width: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams<JourneyEntity>) => (
        <div className="truncate">
          {new Date(params.row.departureTime as Date).toLocaleString()}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Statut",
      width: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams<JourneyEntity>) => (
        <div className="truncate">
          {statusJourneyFrench[params.row.status as JourneyStatus]}
        </div>
      ),
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
      renderCell: (params: GridRenderCellParams<JourneyEntity>) => {
        if (cancelJourneyError) return <div>Une erreur est survenue</div>;
        if (cancelJourneyLoading) return <CircularLoading size={30} />;
        return params.row.status === "PLANNED" ? (
          <Tooltip title="Annuler le trajet">
            <EventBusyIcon
              className="cursor-pointer"
              onClick={() => {
                cancelJourney({
                  variables: {
                    data: {
                      id: params.row.id,
                      status: "CANCELLED",
                    },
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

  if (journeysLoading) return <CircularLoading />;
  if (journeysError) return <div>Error</div>;

  return (
    <section className="journeys_admin">
      <h3 className="mb-4">Trajets</h3>
      <DataGrid
        columns={columns}
        rows={journeys || []}
        paginationModel={{ pageSize: 25, page: 0 }}
        className="bg-white"
      />
    </section>
  );
};

export default JourneysAdmin;
