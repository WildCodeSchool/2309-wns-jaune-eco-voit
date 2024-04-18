import { useCallback, useMemo, useState } from "react";
import { createContext } from "react";


export const AuthContext = createContext<{
  user: String | undefined;
  getUser: String | undefined;
  updateUser: (user: String) => void;
  contextLogout: () => void;
}>({
  user: undefined,
  getUser: undefined,
  updateUser: () => {},
  contextLogout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUser] = useState<undefined | String>(undefined);

  const updateUser = (useCallback)(
    (user: String) => {
      console.log('update context user', user);
      setUser(user);
    },
    [setUser]
  );

  const getUser = useMemo<String | undefined>(() => user, [user]);

  const contextLogout = () => {
    setUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, getUser, updateUser, contextLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
