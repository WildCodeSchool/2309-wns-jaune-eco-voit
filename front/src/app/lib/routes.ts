export type Route = {
  pathname: string;
  title: string;
  protected: Protected;
};

export type Protected = "ADMIN" | "PRIVATE" | "PUBLIC";

export const routes: { [key: string]: Route } = {
  home: {
    pathname: "/",
    title: "Accueil",
    protected: "PUBLIC",
  },
  login: {
    pathname: "/auth/login",
    title: "Connexion",
    protected: "PUBLIC",
  },
  logout: {
    pathname: "/auth/logout",
    title: "Déconnexion",
    protected: "PUBLIC",
  },
  register: {
    pathname: "/auth/register",
    title: "Créer un compte",
    protected: "PUBLIC",
  },
  admin: {
    pathname: "/admin",
    title: "Admin",
    protected: "ADMIN",
  },
  profil: {
    pathname: "/profile/my-profile",
    title: "Votre compte",
    protected: "PRIVATE",
  },
  journeysUser: {
    pathname: "/profile/my-journeys",
    title: "Vos trajets",
    protected: "PRIVATE",
  },
  journey: {
    pathname: "/journey",
    title: "Trajet",
    protected: "PUBLIC",
  },
  messagerie: {
    pathname: "/profile/messaging",
    title: "Messagerie",
    protected: "PRIVATE",
  },
  publier: {
    pathname: "/publish",
    title: "Publier un trajet",
    protected: "PRIVATE",
  },
};
