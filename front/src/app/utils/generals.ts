import { BookingStatus } from "@/types/booking";
import { JourneyStatus } from "@/types/journey";
import { Grade, Role, UserStatus } from "@/types/user";

export const gradeFrench: Record<Grade, string> = {
  BEGINNER: "Débutant",
  CONFIRMED: "Confirmé",
  AMBASSADOR: "Expert",
};

export const statusBookingFrench: Record<BookingStatus, string> = {
  PENDING: "En attente",
  REJECTED: "Rejeté",
  CANCELLED: "Annulé",
  ACCEPTED: "Paiement en attente",
  PAID: "Accepté",
  DONE: "Effectué",
  RATED: "Effectué",
};

export const statusJourneyFrench: Record<JourneyStatus, string> = {
  PLANNED: "Prévu",
  CANCELLED: "Annulé",
  DONE: "Effectué",
};

export const roleFrench: Record<Role, string> = {
  ADMIN: "Administrateur",
  USER: "Utilisateur",
};

export const userStatusFrench: Record<UserStatus, string> = {
  ACTIVE: "Actif",
  ARCHIVED: "Archivé",
};
