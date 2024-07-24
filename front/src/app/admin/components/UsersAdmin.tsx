import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContext";
import {
  useArchiveUserMutation,
  useListUsersQuery,
  UserEntity,
  useUpdateUserMutation,
} from "@/types/graphql";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CircularLoading from "@/app/components/CircularLoading/CircularLoading";

const UsersAdmin = () => {
  const [users, setUsers] = useState<UserEntity[]>([]);

  const { getUser: currentUser } = useContext(AuthContext);

  const {
    data,
    error,
    loading,
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
      onError: (err) => {
        console.log("err", err.message);
      },
    });

  const [
    archiveUser,
    { error: archiveUserError, loading: archiveUserLoading },
  ] = useArchiveUserMutation({
    onCompleted: () => {
      refetchUsers();
    },
    onError: (err) => {
      console.log("err", err.message);
    },
  });

  useEffect(() => {
    if ((data?.listUsers, currentUser)) {
      const filteredUsers = data?.listUsers.filter(
        (user) => user.id !== currentUser && user.status !== "ARCHIVED"
      );
      setUsers(filteredUsers as UserEntity[]);
    }
  }, [data, currentUser]);

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
        if (params.row.id !== currentUser)
          return (
            <select
              className="w-full bg-primary"
              defaultValue={params.row.role}
              onChange={(e) => {
                updateUser({
                  variables: {
                    data: { id: params.row.id, role: e.target.value },
                  },
                });
                console.log(e.target.value);
              }}
            >
              <option value="USER">Utilisateur</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          );
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
        return (
          <DeleteForeverIcon
            className="cursor-pointer"
            onClick={() => {
              archiveUser({
                variables: {
                  archiveUserId: params.row.id,
                },
              });
            }}
          />
        );
      },
    },
  ];

  if (loading) return <CircularLoading />;
  if (error) return <div>Error</div>;

  return (
    <section className="users_admin">
      <h3 className="mb-4">Utilisateurs</h3>
      <DataGrid
        columns={columns}
        rows={users || []}
        paginationModel={{ page: 0, pageSize: 10 }}
      />
    </section>
  );
};

export default UsersAdmin;
