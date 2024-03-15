import { UserEntity } from "@/api-types/user";
import { useFindUserByIdLazyQuery } from "@/types/graphql";
import {
  JSXElementConstructor,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createContext } from "react";

export const AuthContext = createContext<{
  user: UserEntity | undefined;
  getUser: UserEntity | undefined;
  updateUser: (user: UserEntity) => void;
  logout: () => void;
}>({
  user: undefined,
  getUser: undefined,
  updateUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<undefined | UserEntity>(undefined);

  const updateUser = useCallback(
    (user: UserEntity) => {
      console.log("user in context", user);
      setUser(user);
    },
    [setUser]
  );

  const getUser = useMemo<UserEntity | undefined>(() => user, [user]);

  const logout = () => {
    setUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, getUser, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
