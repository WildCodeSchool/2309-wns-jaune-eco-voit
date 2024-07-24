import { Status } from "@/types/booking";
import { Grade, Role } from "@/types/user";

export const gradeFrench: Record<Grade, string> = {
  BEGINNER: "Débutant",
  CONFIRMED: "Confirmé",
  AMBASSADOR: "Expert",
};

export const statusFrench: Record<Status, string> = {
  PENDING: "En attente",
  REJECTED: "Rejeté",
  CANCELLED: "Annulé",
  ACCEPTED: "Accepté",
  DONE: "Effectué",
  RATED: "Effectué",
};

export const roleFrench: Record<Role, string> = {
  ADMIN: "Administrateur",
  USER: "Utilisateur",
};
