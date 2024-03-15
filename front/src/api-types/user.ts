import { BookingEntity } from "./booking";
import { JourneyEntity } from "./journey";

<<<<<<< HEAD
type Role = "USER" | "ADMIN";
type Grade = "BEGINNER" | "CONFIRMED" | "AMBASSADOR";
type Status = "ARCHIVED" | "ACTIVE";
=======
// type Role = "USER" | "ADMIN";
// type Grade = "BEGINNER" | "CONFIRMED" | "AMBASSADOR";
// type Status = "ARCHIVED" | "ACTIVE";
>>>>>>> a615dc78 (FRONT creation type)

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
