import { useCallback, useMemo, useState } from "react";
import { createContext } from "react";

export const AuthContext = createContext<{
  getUserId: string | undefined;
  updateUser: (user: string) => void;
  contextLogout: () => void;
}>({
  getUserId: undefined,
  updateUser: () => {},
  contextLogout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<undefined | string>(undefined);

  const updateUser = useCallback(
    (userId: string) => {
      setUserId(userId);
    },
    [setUserId]
  );

  const getUserId = useMemo<string | undefined>(() => userId, [userId]);

  const contextLogout = () => {
    setUserId(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        getUserId,
        updateUser,
        contextLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
