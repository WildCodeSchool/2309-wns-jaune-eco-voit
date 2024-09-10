import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContext";
import {
  useArchiveUserMutation,
  useListUsersQuery,
  UserEntity,
  useUnarchiveUserMutation,
  useUpdateUserMutation,
} from "@/types/graphql";
import {
  DataGrid,
  GridColDef,
  GridDeleteForeverIcon,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import CircularLoading from "@/app/components/CircularLoading/CircularLoading";
import { Tooltip } from "@mui/material";
import { userStatusFrench } from "@/app/utils/generals";
import { UserStatus } from "@/types/user";
import HistoryIcon from "@mui/icons-material/History";

const UsersAdmin = () => {
  const [users, setUsers] = useState<UserEntity[]>([]);

  const { userId } = useContext(AuthContext);

  const {
    data: usersData,
    error: usersError,
    loading: usersLoading,
    refetch: refetchUsers,
  } = useListUsersQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const [updateUser, { error: updateUserError, loading: updateUserLoading }] =
    useUpdateUserMutation({
      onCompleted: () => {
        refetchUsers();
      },
    });

  const [
    archiveUser,
    { error: archiveUserError, loading: archiveUserLoading },
  ] = useArchiveUserMutation({
    onCompleted: () => {
      refetchUsers();
    },
  });

  const [
    unarchiveUser,
    { error: unarchiveUserError, loading: unarchiveUserLoading },
  ] = useUnarchiveUserMutation({
    onCompleted: () => {
      refetchUsers();
    },
  });

  useEffect(() => {
    if (usersData?.listUsers && userId) {
      const filteredUsers = usersData?.listUsers.filter(
        (user) => user.id !== userId
      );
      setUsers(filteredUsers as UserEntity[]);
    }
  }, [usersData, userId]);

  const columns: GridColDef[] = [
    {
      field: "firstname",
      headerName: "Utilisateur",
      width: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams<UserEntity>) => (
        <div>
          {params.row.firstname} {params.row.lastname}
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
      flex: 1,
    },
    {
      field: "role",
      headerName: "Droits",
      width: 180,
      filterable: false,
      disableColumnMenu: true,
      editable: false,
      renderCell(params: GridRenderCellParams<UserEntity>) {
        if (updateUserError) return <div>Une erreur est survenue</div>;
        if (updateUserLoading) return <CircularLoading size={30} />;
        return params.row.id !== userId && params.row.status === "ACTIVE" ? (
          <select
            className="w-full bg-primary"
            defaultValue={params.row.role}
            onChange={(e) => {
              updateUser({
                variables: {
                  data: { id: params.row.id, role: e.target.value },
                },
              });
            }}
          >
            <option value="USER">Utilisateur</option>
            <option value="ADMIN">Administrateur</option>
          </select>
        ) : (
          "-"
        );
      },
    },
    {
      field: "status",
      headerName: "Statut",
      width: 100,
      renderCell(params) {
        return userStatusFrench[params.row.status as UserStatus];
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
        if (archiveUserError || unarchiveUserError)
          return <div>Une erreur est survenue</div>;
        if (archiveUserLoading || unarchiveUserLoading)
          return <CircularLoading size={30} />;
        return params.row.status === "ACTIVE" ? (
          <Tooltip title="Archiver l'utilisateur">
            <GridDeleteForeverIcon
              className="cursor-pointer"
              onClick={() => {
                archiveUser({
                  variables: {
                    archiveUserId: params.row.id,
                  },
                });
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Restaurer l'utilisateur">
            <HistoryIcon
              className="cursor-pointer"
              onClick={() => {
                unarchiveUser({
                  variables: {
                    unarchiveUserId: params.row.id,
                  },
                });
              }}
            />
          </Tooltip>
        );
      },
    },
  ];

  if (usersLoading) return <CircularLoading />;
  if (usersError) return <div>Error</div>;

  return (
    <section className="users_admin">
      <h3 className="mb-4">Utilisateurs</h3>
      <DataGrid
        columns={columns}
        rows={users || []}
        paginationModel={{ pageSize: 25, page: 0 }}
        className="bg-white"
      />
    </section>
  );
};

export default UsersAdmin;
