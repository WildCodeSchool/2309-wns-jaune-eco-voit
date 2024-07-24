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
  "my-profile": {
    pathname: "/profile/my-profile",
    title: "Votre compte",
    protected: "PRIVATE",
  },
  profile: {
    pathname: "/profile",
    title: "Profil utilisateur",
    protected: "PRIVATE",
  },
  journeysUser: {
    pathname: "/profile/my-journeys",
    title: "Vos trajets",
    protected: "PRIVATE",
  },
  "publish-journey": {
    pathname: "/journey/publish",
    title: "Publier un trajet",
    protected: "PRIVATE",
  },
  journey: {
    pathname: "/journey",
    title: "Trajet",
    protected: "PUBLIC",
  },
  error: {
    pathname: "/error",
    title: "Erreur",
    protected: "PUBLIC",
  },
  paymentWaiting: {
    pathname: "/payment/waiting",
    title: "Payment waiting",
    protected: "PRIVATE",
  },
  "booking rating": {
    pathname: "/booking/rate",
    title: "Booking rating",
    protected: "PRIVATE",
  },
  "booking accept": {
    pathname: "/booking/accept",
    title: "Booking accept",
    protected: "PRIVATE",
  },
};
