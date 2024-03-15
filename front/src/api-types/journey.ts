import { BookingEntity } from "./booking";
import { UserEntity } from "./user";

// type AvailableSeats = 1 | 2 | 3 | 4;

// type JourneyStatus = "PLANNED" | "CANCELLED" | "DONE";

export type JourneyEntity = {
  id: string;

  automaticAccept: Boolean;
  totalPrice: number;
  //   availableSeats: AvailableSeats;
  availableSeats: number;
  origin: string;
  destination: string;
  departure_time: Date;
  arrival_time: Date;
  //   status: JourneyStatus;
  status: string;
  createdAt: Date;
  updatedAt?: Date;
  user?: UserEntity;

  bookings?: BookingEntity[];
};
