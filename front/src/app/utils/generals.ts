import { Status } from "@/types/booking";
import { Grade } from "@/types/user";

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
