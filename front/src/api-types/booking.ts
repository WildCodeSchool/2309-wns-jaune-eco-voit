import { JourneyEntity } from "./journey";
import { UserEntity } from "./user";

<<<<<<< HEAD
type Status = "PENDING" | "REJECTED" | "CANCELLED" | "ACCEPTED";
=======
// type Status = "PENDING" | "REJECTED" | "CANCELLED" | "ACCEPTED";
>>>>>>> a615dc78 (FRONT creation type)

export type BookingEntity = {
  id: string;
  arrivalTime: Date;
  departureTime: Date;
  //   status: Status;
  status: string;
  totalPrice: number;

  createdAt: Date;

  updatedAt?: Date;

  journey?: JourneyEntity | null;
  user?: UserEntity | null;
};
