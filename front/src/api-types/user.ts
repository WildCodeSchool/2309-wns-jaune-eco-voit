import { BookingEntity } from "./booking";
import { JourneyEntity } from "./journey";

// type Role = "USER" | "ADMIN";
// type Grade = "BEGINNER" | "CONFIRMED" | "AMBASSADOR";
// type Status = "ARCHIVED" | "ACTIVE";

export type UserEntity = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  dateOfBirth: Date;
  // role: Role;
  role: string;
  tripsAsPassenger: number;
  tripsAsDriver: number;
  createdAt: Date;
  // grade?: Grade;
  grade?: string | null;
  phoneNumber?: string;
  profilPicture?: string | null;
  updatedAt?: Date;
  // status?: Status;
  status?: string | null;

  bookings?: BookingEntity[] | null;
  journeys?: JourneyEntity[] | null;
};
