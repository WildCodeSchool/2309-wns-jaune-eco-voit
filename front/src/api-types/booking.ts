import { JourneyEntity } from "./journey";
import { UserEntity } from "./user";

type Status = "PENDING" | "REJECTED" | "CANCELLED" | "ACCEPTED";

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
