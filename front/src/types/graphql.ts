import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: any; output: any; }
  EmailAddress: { input: any; output: any; }
};

export type BookingEntity = {
  __typename?: 'BookingEntity';
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  journey: JourneyEntity;
  nbPassenger: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  user: UserEntity;
};

export type CreateBookingInput = {
  journey: PartialBookingInput;
  nbPassenger: Scalars['Float']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  user: PartialBookingInput;
};

export type CreateJourneyInput = {
  arrival_time: Scalars['DateTimeISO']['input'];
  automaticAccept: Scalars['Boolean']['input'];
  availableSeats: Scalars['Float']['input'];
  departure_time: Scalars['DateTimeISO']['input'];
  destination: Scalars['String']['input'];
  origin: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  user: PartialUserInput;
};

export type CreateJourneyMessageInput = {
  journey: PartialJourneyInput;
  message: Scalars['String']['input'];
  user: PartialUserInput;
};

export type CreateRatingInput = {
  booking: PartialBookingInput;
  rate: Scalars['String']['input'];
  userRated: PartialUserInput;
};

export type CreateUserInput = {
  dateOfBirth: Scalars['DateTimeISO']['input'];
  email: Scalars['String']['input'];
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  password: Scalars['String']['input'];
  profilePicture?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

export type JourneyEntity = {
  __typename?: 'JourneyEntity';
  arrival_time: Scalars['DateTimeISO']['output'];
  automaticAccept: Scalars['Boolean']['output'];
  availableSeats: Scalars['Float']['output'];
  bookings: Array<BookingEntity>;
  createdAt: Scalars['DateTimeISO']['output'];
  departure_time: Scalars['DateTimeISO']['output'];
  destination: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  journeyMessages?: Maybe<Array<JourneyMessageEntity>>;
  origin: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  user: UserEntity;
};

export type JourneyMessageEntity = {
  __typename?: 'JourneyMessageEntity';
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  journey: JourneyEntity;
  message: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  user: UserEntity;
};

export type ListJourneysWithFilters = {
  automaticAccept?: InputMaybe<Scalars['Boolean']['input']>;
  availableSeats: Scalars['Float']['input'];
  departureTime: Scalars['DateTimeISO']['input'];
  destination: Scalars['String']['input'];
  origin: Scalars['String']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptBooking: BookingEntity;
  archiveUser: UserEntity;
  cancelBooking: BookingEntity;
  createBooking: BookingEntity;
  createJourney: JourneyEntity;
  createJourneyMessage: JourneyMessageEntity;
  createRating: RatingEntity;
  deleteJourneyMessage: JourneyMessageEntity;
  register: UserWithoutPassord;
  rejectBooking: BookingEntity;
  updateJourney: JourneyEntity;
  updateJourneyStatus: JourneyEntity;
  updateUser: UserEntity;
  updateUserPassword: UserEntity;
};


export type MutationAcceptBookingArgs = {
  id: Scalars['String']['input'];
};


export type MutationArchiveUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationCancelBookingArgs = {
  id: Scalars['String']['input'];
};


export type MutationCreateBookingArgs = {
  data: CreateBookingInput;
};


export type MutationCreateJourneyArgs = {
  data: CreateJourneyInput;
};


export type MutationCreateJourneyMessageArgs = {
  data: CreateJourneyMessageInput;
};


export type MutationCreateRatingArgs = {
  data: CreateRatingInput;
};


export type MutationDeleteJourneyMessageArgs = {
  id: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  data: CreateUserInput;
};


export type MutationRejectBookingArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateJourneyArgs = {
  data: UpdateJourneyInput;
};


export type MutationUpdateJourneyStatusArgs = {
  data: UpdateJourneyStatusInput;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
};


export type MutationUpdateUserPasswordArgs = {
  data: UpdateUserPasswordInput;
};

export type PartialBookingInput = {
  id: Scalars['ID']['input'];
};

export type PartialJourneyInput = {
  id: Scalars['ID']['input'];
};

export type PartialUserInput = {
  id: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  findBookingById: BookingEntity;
  findJourneyById: JourneyEntity;
  findUserById: UserEntity;
  getProfile: UserProfile;
  listBookings: Array<BookingEntity>;
  listBookingsByJourney: Array<BookingEntity>;
  listBookingsByUser: Array<BookingEntity>;
  listJourneyMessagesByJourney: Array<JourneyMessageEntity>;
  listJourneys: Array<JourneyEntity>;
  listJourneysByUser: Array<JourneyEntity>;
  listRatingsByUser: Array<RatingEntity>;
  listUsers: Array<UserEntity>;
  login: UserEntity;
  logout: UserMessage;
};


export type QueryFindBookingByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryFindJourneyByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryFindUserByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryListBookingsByJourneyArgs = {
  journeyId: Scalars['String']['input'];
};


export type QueryListBookingsByUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryListJourneyMessagesByJourneyArgs = {
  journeyId: Scalars['String']['input'];
};


export type QueryListJourneysArgs = {
  filters?: InputMaybe<ListJourneysWithFilters>;
};


export type QueryListJourneysByUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryListRatingsByUserArgs = {
  userRatedId: Scalars['String']['input'];
};


export type QueryLoginArgs = {
  data: LoginInput;
};

export type RatingEntity = {
  __typename?: 'RatingEntity';
  booking: BookingEntity;
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  rate: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  userRated: UserEntity;
};

export type UpdateJourneyInput = {
  arrival_time?: InputMaybe<Scalars['DateTimeISO']['input']>;
  automaticAccept?: InputMaybe<Scalars['Boolean']['input']>;
  availableSeats?: InputMaybe<Scalars['Float']['input']>;
  departure_time?: InputMaybe<Scalars['DateTimeISO']['input']>;
  destination?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  origin?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateJourneyStatusInput = {
  id: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};

export type UpdateUserInput = {
  averageRate?: InputMaybe<Scalars['Float']['input']>;
  dateOfBirth?: InputMaybe<Scalars['DateTimeISO']['input']>;
  email?: InputMaybe<Scalars['EmailAddress']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  grade?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  lastname?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  profilePicture?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  tripsAsDriver?: InputMaybe<Scalars['Float']['input']>;
  tripsAsPassenger?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateUserPasswordInput = {
  id: Scalars['ID']['input'];
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export type UserEntity = {
  __typename?: 'UserEntity';
  averageRate?: Maybe<Scalars['Float']['output']>;
  bookings?: Maybe<Array<BookingEntity>>;
  createdAt: Scalars['DateTimeISO']['output'];
  dateOfBirth: Scalars['DateTimeISO']['output'];
  email: Scalars['EmailAddress']['output'];
  firstname: Scalars['String']['output'];
  grade: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  journeyMessages: Array<JourneyMessageEntity>;
  journeys?: Maybe<Array<JourneyEntity>>;
  lastname: Scalars['String']['output'];
  password: Scalars['String']['output'];
  profilePicture?: Maybe<Scalars['String']['output']>;
  ratings: Array<RatingEntity>;
  role: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  tripsAsDriver: Scalars['Float']['output'];
  tripsAsPassenger: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type UserMessage = {
  __typename?: 'UserMessage';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type UserProfile = {
  __typename?: 'UserProfile';
  averageRate?: Maybe<Scalars['Float']['output']>;
  dateOfBirth?: Maybe<Scalars['DateTimeISO']['output']>;
  email: Scalars['String']['output'];
  firstname: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastname: Scalars['String']['output'];
  password: Scalars['String']['output'];
  profilePicture?: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
};

export type UserWithoutPassord = {
  __typename?: 'UserWithoutPassord';
  email: Scalars['EmailAddress']['output'];
  firstname: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastname: Scalars['String']['output'];
};

export type RegisterMutationVariables = Exact<{
  data: CreateUserInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserWithoutPassord', firstname: string, lastname: string, email: any } };

export type CreateBookingMutationVariables = Exact<{
  data: CreateBookingInput;
}>;


export type CreateBookingMutation = { __typename?: 'Mutation', createBooking: { __typename?: 'BookingEntity', id: string, status: string, createdAt: any, updatedAt?: any | null, user: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, email: any, averageRate?: number | null, password: string, dateOfBirth: any, profilePicture?: string | null, role: string, grade: string, tripsAsPassenger: number, tripsAsDriver: number, status?: string | null, createdAt: any, updatedAt?: any | null }, journey: { __typename?: 'JourneyEntity', id: string, origin: string, destination: string, price: number, departure_time: any, arrival_time: any, availableSeats: number, status: string, automaticAccept: boolean, createdAt: any, updatedAt?: any | null } } };

export type AcceptBookingMutationVariables = Exact<{
  acceptBookingId: Scalars['String']['input'];
}>;


export type AcceptBookingMutation = { __typename?: 'Mutation', acceptBooking: { __typename?: 'BookingEntity', id: string, status: string, createdAt: any, updatedAt?: any | null, user: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, email: any, password: string, averageRate?: number | null, dateOfBirth: any, profilePicture?: string | null, role: string, grade: string, tripsAsPassenger: number, tripsAsDriver: number, status?: string | null, createdAt: any, updatedAt?: any | null }, journey: { __typename?: 'JourneyEntity', id: string, origin: string, destination: string, price: number, departure_time: any, arrival_time: any, availableSeats: number, status: string, automaticAccept: boolean, createdAt: any, updatedAt?: any | null } } };

export type RejectBookingMutationVariables = Exact<{
  rejectBookingId: Scalars['String']['input'];
}>;


export type RejectBookingMutation = { __typename?: 'Mutation', rejectBooking: { __typename?: 'BookingEntity', id: string, status: string, createdAt: any, updatedAt?: any | null, user: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, email: any, password: string, dateOfBirth: any, averageRate?: number | null, profilePicture?: string | null, role: string, grade: string, tripsAsPassenger: number, tripsAsDriver: number, status?: string | null, createdAt: any, updatedAt?: any | null }, journey: { __typename?: 'JourneyEntity', id: string, origin: string, destination: string, price: number, departure_time: any, arrival_time: any, availableSeats: number, status: string, automaticAccept: boolean, createdAt: any, updatedAt?: any | null } } };

export type CancelBookingMutationVariables = Exact<{
  cancelBookingId: Scalars['String']['input'];
}>;


export type CancelBookingMutation = { __typename?: 'Mutation', cancelBooking: { __typename?: 'BookingEntity', id: string, status: string, createdAt: any, updatedAt?: any | null, user: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, email: any, password: string, dateOfBirth: any, profilePicture?: string | null, averageRate?: number | null, role: string, grade: string, tripsAsPassenger: number, tripsAsDriver: number, status?: string | null, createdAt: any, updatedAt?: any | null }, journey: { __typename?: 'JourneyEntity', id: string, origin: string, destination: string, price: number, departure_time: any, arrival_time: any, availableSeats: number, status: string, automaticAccept: boolean, createdAt: any, updatedAt?: any | null } } };

export type CreateJourneyMutationVariables = Exact<{
  data: CreateJourneyInput;
}>;


export type CreateJourneyMutation = { __typename?: 'Mutation', createJourney: { __typename?: 'JourneyEntity', id: string, origin: string, destination: string, price: number, departure_time: any, arrival_time: any, availableSeats: number, status: string, automaticAccept: boolean, createdAt: any, updatedAt?: any | null, user: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, email: any, password: string, dateOfBirth: any, averageRate?: number | null, profilePicture?: string | null, role: string, grade: string, tripsAsPassenger: number, tripsAsDriver: number, status?: string | null, createdAt: any, updatedAt?: any | null }, bookings: Array<{ __typename?: 'BookingEntity', id: string, status: string, createdAt: any, updatedAt?: any | null }> } };

export type UpdateJourneyMutationVariables = Exact<{
  data: UpdateJourneyInput;
}>;


export type UpdateJourneyMutation = { __typename?: 'Mutation', updateJourney: { __typename?: 'JourneyEntity', id: string, origin: string, destination: string, price: number, departure_time: any, arrival_time: any, availableSeats: number, status: string, automaticAccept: boolean, createdAt: any, updatedAt?: any | null, bookings: Array<{ __typename?: 'BookingEntity', id: string, status: string, createdAt: any, updatedAt?: any | null }>, user: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, email: any, password: string, dateOfBirth: any, profilePicture?: string | null, role: string, grade: string, averageRate?: number | null, tripsAsPassenger: number, tripsAsDriver: number, status?: string | null, createdAt: any, updatedAt?: any | null } } };

export type UpdateJourneyStatusMutationVariables = Exact<{
  data: UpdateJourneyStatusInput;
}>;


export type UpdateJourneyStatusMutation = { __typename?: 'Mutation', updateJourneyStatus: { __typename?: 'JourneyEntity', id: string, origin: string, destination: string, price: number, departure_time: any, arrival_time: any, availableSeats: number, status: string, automaticAccept: boolean, createdAt: any, updatedAt?: any | null, user: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, email: any, password: string, dateOfBirth: any, profilePicture?: string | null, averageRate?: number | null, role: string, grade: string, tripsAsPassenger: number, tripsAsDriver: number, status?: string | null, createdAt: any, updatedAt?: any | null }, bookings: Array<{ __typename?: 'BookingEntity', id: string, status: string, createdAt: any, updatedAt?: any | null }> } };

export type PostJourneyMessageMutationVariables = Exact<{
  data: CreateJourneyMessageInput;
}>;


export type PostJourneyMessageMutation = { __typename?: 'Mutation', createJourneyMessage: { __typename?: 'JourneyMessageEntity', id: string, createdAt: any, message: string, journey: { __typename?: 'JourneyEntity', journeyMessages?: Array<{ __typename?: 'JourneyMessageEntity', id: string }> | null }, user: { __typename?: 'UserEntity', id: string } } };

export type CreateRateMutationVariables = Exact<{
  data: CreateRatingInput;
}>;


export type CreateRateMutation = { __typename?: 'Mutation', createRating: { __typename?: 'RatingEntity', id: string, rate: string, createdAt: any, updatedAt: any, userRated: { __typename?: 'UserEntity', id: string }, booking: { __typename?: 'BookingEntity', id: string } } };

export type UpdateUserMutationVariables = Exact<{
  data: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, email: any, password: string, dateOfBirth: any, profilePicture?: string | null, role: string, grade: string, averageRate?: number | null, tripsAsPassenger: number, tripsAsDriver: number, status?: string | null, createdAt: any, updatedAt?: any | null, journeys?: Array<{ __typename?: 'JourneyEntity', id: string, origin: string, destination: string, price: number, departure_time: any, arrival_time: any, availableSeats: number, status: string, automaticAccept: boolean, createdAt: any, updatedAt?: any | null }> | null, bookings?: Array<{ __typename?: 'BookingEntity', id: string, status: string, createdAt: any, updatedAt?: any | null }> | null } };

export type UpdateUserPasswordMutationVariables = Exact<{
  data: UpdateUserPasswordInput;
}>;


export type UpdateUserPasswordMutation = { __typename?: 'Mutation', updateUserPassword: { __typename?: 'UserEntity', id: string } };

export type ArchiveUserMutationVariables = Exact<{
  archiveUserId: Scalars['String']['input'];
}>;


export type ArchiveUserMutation = { __typename?: 'Mutation', archiveUser: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, email: any, password: string, dateOfBirth: any, profilePicture?: string | null, role: string, grade: string, tripsAsPassenger: number, tripsAsDriver: number, averageRate?: number | null, status?: string | null, createdAt: any, updatedAt?: any | null, journeys?: Array<{ __typename?: 'JourneyEntity', id: string, origin: string, destination: string, price: number, departure_time: any, arrival_time: any, availableSeats: number, status: string, automaticAccept: boolean, createdAt: any, updatedAt?: any | null }> | null, bookings?: Array<{ __typename?: 'BookingEntity', id: string, status: string, createdAt: any, updatedAt?: any | null }> | null } };

export type LoginQueryVariables = Exact<{
  data: LoginInput;
}>;


export type LoginQuery = { __typename?: 'Query', login: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, email: any, password: string, dateOfBirth: any, profilePicture?: string | null, role: string, grade: string, tripsAsPassenger: number, status?: string | null, averageRate?: number | null, tripsAsDriver: number, createdAt: any, updatedAt?: any | null } };

export type LogoutQueryVariables = Exact<{ [key: string]: never; }>;


export type LogoutQuery = { __typename?: 'Query', logout: { __typename?: 'UserMessage', success: boolean, message: string } };

export type ListBookingsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListBookingsQuery = { __typename?: 'Query', listBookings: Array<{ __typename?: 'BookingEntity', id: string, status: string, createdAt: any, updatedAt?: any | null, nbPassenger: number, user: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, email: any, password: string, dateOfBirth: any, profilePicture?: string | null, role: string, grade: string, tripsAsPassenger: number, tripsAsDriver: number, averageRate?: number | null, status?: string | null, createdAt: any, updatedAt?: any | null }, journey: { __typename?: 'JourneyEntity', id: string, origin: string, destination: string, price: number, departure_time: any, arrival_time: any, availableSeats: number, status: string, automaticAccept: boolean, createdAt: any, updatedAt?: any | null, user: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, profilePicture?: string | null } } }> };

export type ListBookingsByUserQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type ListBookingsByUserQuery = { __typename?: 'Query', listBookingsByUser: Array<{ __typename?: 'BookingEntity', id: string, nbPassenger: number, status: string, createdAt: any, updatedAt?: any | null, user: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, email: any, password: string, dateOfBirth: any, profilePicture?: string | null, role: string, grade: string, tripsAsPassenger: number, tripsAsDriver: number, averageRate?: number | null, status?: string | null, createdAt: any, updatedAt?: any | null }, journey: { __typename?: 'JourneyEntity', id: string, origin: string, destination: string, price: number, departure_time: any, arrival_time: any, availableSeats: number, status: string, automaticAccept: boolean, createdAt: any, updatedAt?: any | null, user: { __typename?: 'UserEntity', email: any, lastname: string, firstname: string, profilePicture?: string | null } } }> };

export type ListBookingsByJourneyQueryVariables = Exact<{
  journeyId: Scalars['String']['input'];
}>;


export type ListBookingsByJourneyQuery = { __typename?: 'Query', listBookingsByJourney: Array<{ __typename?: 'BookingEntity', id: string, status: string, nbPassenger: number, createdAt: any, updatedAt?: any | null, user: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, email: any, password: string, dateOfBirth: any, averageRate?: number | null, profilePicture?: string | null, role: string, grade: string, tripsAsPassenger: number, tripsAsDriver: number, status?: string | null, createdAt: any, updatedAt?: any | null }, journey: { __typename?: 'JourneyEntity', id: string, origin: string, destination: string, price: number, departure_time: any, arrival_time: any, availableSeats: number, status: string, automaticAccept: boolean, createdAt: any, updatedAt?: any | null, user: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, profilePicture?: string | null } } }> };

export type FindBookingByIdQueryVariables = Exact<{
  findBookingById: Scalars['String']['input'];
}>;


export type FindBookingByIdQuery = { __typename?: 'Query', findBookingById: { __typename?: 'BookingEntity', id: string, status: string, nbPassenger: number, createdAt: any, updatedAt?: any | null, user: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, email: any, password: string, dateOfBirth: any, profilePicture?: string | null, role: string, grade: string, tripsAsPassenger: number, averageRate?: number | null, tripsAsDriver: number, status?: string | null, createdAt: any, updatedAt?: any | null }, journey: { __typename?: 'JourneyEntity', id: string, origin: string, destination: string, price: number, departure_time: any, arrival_time: any, availableSeats: number, status: string, automaticAccept: boolean, createdAt: any, updatedAt?: any | null, user: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, profilePicture?: string | null } } } };

export type ListJourneysQueryVariables = Exact<{
  filters?: InputMaybe<ListJourneysWithFilters>;
}>;


export type ListJourneysQuery = { __typename?: 'Query', listJourneys: Array<{ __typename?: 'JourneyEntity', arrival_time: any, automaticAccept: boolean, availableSeats: number, createdAt: any, departure_time: any, destination: string, id: string, origin: string, status: string, price: number, updatedAt?: any | null, bookings: Array<{ __typename?: 'BookingEntity', createdAt: any, id: string, status: string, updatedAt?: any | null }>, user: { __typename?: 'UserEntity', email: any, firstname: string, lastname: string, id: string, averageRate?: number | null, profilePicture?: string | null } }> };

export type ListJourneysByUserQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type ListJourneysByUserQuery = { __typename?: 'Query', listJourneysByUser: Array<{ __typename?: 'JourneyEntity', id: string, origin: string, destination: string, price: number, departure_time: any, arrival_time: any, availableSeats: number, status: string, automaticAccept: boolean, createdAt: any, updatedAt?: any | null, user: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, email: any, password: string, dateOfBirth: any, profilePicture?: string | null, role: string, grade: string, tripsAsPassenger: number, tripsAsDriver: number, status?: string | null, createdAt: any, updatedAt?: any | null, averageRate?: number | null }, bookings: Array<{ __typename?: 'BookingEntity', id: string, status: string, createdAt: any, updatedAt?: any | null }> }> };

export type FindJourneyByIdQueryVariables = Exact<{
  findJourneyById: Scalars['String']['input'];
}>;


export type FindJourneyByIdQuery = { __typename?: 'Query', findJourneyById: { __typename?: 'JourneyEntity', id: string, origin: string, destination: string, price: number, departure_time: any, arrival_time: any, availableSeats: number, status: string, automaticAccept: boolean, createdAt: any, updatedAt?: any | null, bookings: Array<{ __typename?: 'BookingEntity', id: string, status: string, createdAt: any, updatedAt?: any | null }>, user: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, email: any, password: string, dateOfBirth: any, profilePicture?: string | null, role: string, grade: string, tripsAsPassenger: number, tripsAsDriver: number, status?: string | null, createdAt: any, averageRate?: number | null, updatedAt?: any | null } } };

export type ListJourneyMessagesByJourneyQueryVariables = Exact<{
  journeyId: Scalars['String']['input'];
}>;


export type ListJourneyMessagesByJourneyQuery = { __typename?: 'Query', listJourneyMessagesByJourney: Array<{ __typename?: 'JourneyMessageEntity', createdAt: any, id: string, message: string, journey: { __typename?: 'JourneyEntity', id: string }, user: { __typename?: 'UserEntity', id: string, firstname: string, profilePicture?: string | null } }> };

export type ListUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type ListUsersQuery = { __typename?: 'Query', listUsers: Array<{ __typename?: 'UserEntity', id: string, firstname: string, lastname: string, email: any, password: string, dateOfBirth: any, profilePicture?: string | null, role: string, grade: string, averageRate?: number | null, tripsAsPassenger: number, tripsAsDriver: number, status?: string | null, createdAt: any, updatedAt?: any | null, journeys?: Array<{ __typename?: 'JourneyEntity', id: string, origin: string, destination: string, price: number, departure_time: any, arrival_time: any, availableSeats: number, status: string, automaticAccept: boolean, createdAt: any, updatedAt?: any | null }> | null, bookings?: Array<{ __typename?: 'BookingEntity', id: string, status: string, createdAt: any, updatedAt?: any | null }> | null }> };

export type FindUserByIdQueryVariables = Exact<{
  findUserById: Scalars['String']['input'];
}>;


export type FindUserByIdQuery = { __typename?: 'Query', findUserById: { __typename?: 'UserEntity', id: string, firstname: string, lastname: string, email: any, password: string, profilePicture?: string | null, averageRate?: number | null, role: string, tripsAsPassenger: number, grade: string, tripsAsDriver: number, status?: string | null, createdAt: any, updatedAt?: any | null, journeys?: Array<{ __typename?: 'JourneyEntity', id: string, origin: string, destination: string, price: number, departure_time: any, arrival_time: any, availableSeats: number, status: string, automaticAccept: boolean, createdAt: any, updatedAt?: any | null }> | null, bookings?: Array<{ __typename?: 'BookingEntity', id: string, status: string, createdAt: any, updatedAt?: any | null }> | null } };

export type GetProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProfileQuery = { __typename?: 'Query', getProfile: { __typename?: 'UserProfile', lastname: string, firstname: string, averageRate?: number | null, profilePicture?: string | null, email: string, role: string, dateOfBirth?: any | null, password: string } };


export const RegisterDocument = gql`
    mutation register($data: CreateUserInput!) {
  register(data: $data) {
    firstname
    lastname
    email
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const CreateBookingDocument = gql`
    mutation createBooking($data: CreateBookingInput!) {
  createBooking(data: $data) {
    id
    status
    createdAt
    updatedAt
    user {
      id
      firstname
      lastname
      email
      averageRate
      password
      dateOfBirth
      profilePicture
      role
      grade
      tripsAsPassenger
      tripsAsDriver
      status
      createdAt
      updatedAt
    }
    journey {
      id
      origin
      destination
      price
      departure_time
      arrival_time
      availableSeats
      status
      automaticAccept
      createdAt
      updatedAt
    }
  }
}
    `;
export type CreateBookingMutationFn = Apollo.MutationFunction<CreateBookingMutation, CreateBookingMutationVariables>;

/**
 * __useCreateBookingMutation__
 *
 * To run a mutation, you first call `useCreateBookingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBookingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBookingMutation, { data, loading, error }] = useCreateBookingMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateBookingMutation(baseOptions?: Apollo.MutationHookOptions<CreateBookingMutation, CreateBookingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBookingMutation, CreateBookingMutationVariables>(CreateBookingDocument, options);
      }
export type CreateBookingMutationHookResult = ReturnType<typeof useCreateBookingMutation>;
export type CreateBookingMutationResult = Apollo.MutationResult<CreateBookingMutation>;
export type CreateBookingMutationOptions = Apollo.BaseMutationOptions<CreateBookingMutation, CreateBookingMutationVariables>;
export const AcceptBookingDocument = gql`
    mutation acceptBooking($acceptBookingId: String!) {
  acceptBooking(id: $acceptBookingId) {
    id
    status
    createdAt
    updatedAt
    user {
      id
      firstname
      lastname
      email
      password
      averageRate
      dateOfBirth
      profilePicture
      role
      grade
      tripsAsPassenger
      tripsAsDriver
      status
      createdAt
      updatedAt
    }
    journey {
      id
      origin
      destination
      price
      departure_time
      arrival_time
      availableSeats
      status
      automaticAccept
      createdAt
      updatedAt
    }
  }
}
    `;
export type AcceptBookingMutationFn = Apollo.MutationFunction<AcceptBookingMutation, AcceptBookingMutationVariables>;

/**
 * __useAcceptBookingMutation__
 *
 * To run a mutation, you first call `useAcceptBookingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptBookingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptBookingMutation, { data, loading, error }] = useAcceptBookingMutation({
 *   variables: {
 *      acceptBookingId: // value for 'acceptBookingId'
 *   },
 * });
 */
export function useAcceptBookingMutation(baseOptions?: Apollo.MutationHookOptions<AcceptBookingMutation, AcceptBookingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptBookingMutation, AcceptBookingMutationVariables>(AcceptBookingDocument, options);
      }
export type AcceptBookingMutationHookResult = ReturnType<typeof useAcceptBookingMutation>;
export type AcceptBookingMutationResult = Apollo.MutationResult<AcceptBookingMutation>;
export type AcceptBookingMutationOptions = Apollo.BaseMutationOptions<AcceptBookingMutation, AcceptBookingMutationVariables>;
export const RejectBookingDocument = gql`
    mutation rejectBooking($rejectBookingId: String!) {
  rejectBooking(id: $rejectBookingId) {
    id
    status
    createdAt
    updatedAt
    user {
      id
      firstname
      lastname
      email
      password
      dateOfBirth
      averageRate
      profilePicture
      role
      grade
      tripsAsPassenger
      tripsAsDriver
      status
      createdAt
      updatedAt
    }
    journey {
      id
      origin
      destination
      price
      departure_time
      arrival_time
      availableSeats
      status
      automaticAccept
      createdAt
      updatedAt
    }
  }
}
    `;
export type RejectBookingMutationFn = Apollo.MutationFunction<RejectBookingMutation, RejectBookingMutationVariables>;

/**
 * __useRejectBookingMutation__
 *
 * To run a mutation, you first call `useRejectBookingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectBookingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectBookingMutation, { data, loading, error }] = useRejectBookingMutation({
 *   variables: {
 *      rejectBookingId: // value for 'rejectBookingId'
 *   },
 * });
 */
export function useRejectBookingMutation(baseOptions?: Apollo.MutationHookOptions<RejectBookingMutation, RejectBookingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RejectBookingMutation, RejectBookingMutationVariables>(RejectBookingDocument, options);
      }
export type RejectBookingMutationHookResult = ReturnType<typeof useRejectBookingMutation>;
export type RejectBookingMutationResult = Apollo.MutationResult<RejectBookingMutation>;
export type RejectBookingMutationOptions = Apollo.BaseMutationOptions<RejectBookingMutation, RejectBookingMutationVariables>;
export const CancelBookingDocument = gql`
    mutation cancelBooking($cancelBookingId: String!) {
  cancelBooking(id: $cancelBookingId) {
    id
    status
    createdAt
    updatedAt
    user {
      id
      firstname
      lastname
      email
      password
      dateOfBirth
      profilePicture
      averageRate
      role
      grade
      tripsAsPassenger
      tripsAsDriver
      status
      createdAt
      updatedAt
    }
    journey {
      id
      origin
      destination
      price
      departure_time
      arrival_time
      availableSeats
      status
      automaticAccept
      createdAt
      updatedAt
    }
  }
}
    `;
export type CancelBookingMutationFn = Apollo.MutationFunction<CancelBookingMutation, CancelBookingMutationVariables>;

/**
 * __useCancelBookingMutation__
 *
 * To run a mutation, you first call `useCancelBookingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelBookingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelBookingMutation, { data, loading, error }] = useCancelBookingMutation({
 *   variables: {
 *      cancelBookingId: // value for 'cancelBookingId'
 *   },
 * });
 */
export function useCancelBookingMutation(baseOptions?: Apollo.MutationHookOptions<CancelBookingMutation, CancelBookingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelBookingMutation, CancelBookingMutationVariables>(CancelBookingDocument, options);
      }
export type CancelBookingMutationHookResult = ReturnType<typeof useCancelBookingMutation>;
export type CancelBookingMutationResult = Apollo.MutationResult<CancelBookingMutation>;
export type CancelBookingMutationOptions = Apollo.BaseMutationOptions<CancelBookingMutation, CancelBookingMutationVariables>;
export const CreateJourneyDocument = gql`
    mutation createJourney($data: CreateJourneyInput!) {
  createJourney(data: $data) {
    id
    origin
    destination
    price
    departure_time
    arrival_time
    availableSeats
    status
    automaticAccept
    createdAt
    updatedAt
    user {
      id
      firstname
      lastname
      email
      password
      dateOfBirth
      averageRate
      profilePicture
      role
      grade
      tripsAsPassenger
      tripsAsDriver
      status
      createdAt
      updatedAt
    }
    bookings {
      id
      status
      createdAt
      updatedAt
    }
  }
}
    `;
export type CreateJourneyMutationFn = Apollo.MutationFunction<CreateJourneyMutation, CreateJourneyMutationVariables>;

/**
 * __useCreateJourneyMutation__
 *
 * To run a mutation, you first call `useCreateJourneyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateJourneyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createJourneyMutation, { data, loading, error }] = useCreateJourneyMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateJourneyMutation(baseOptions?: Apollo.MutationHookOptions<CreateJourneyMutation, CreateJourneyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateJourneyMutation, CreateJourneyMutationVariables>(CreateJourneyDocument, options);
      }
export type CreateJourneyMutationHookResult = ReturnType<typeof useCreateJourneyMutation>;
export type CreateJourneyMutationResult = Apollo.MutationResult<CreateJourneyMutation>;
export type CreateJourneyMutationOptions = Apollo.BaseMutationOptions<CreateJourneyMutation, CreateJourneyMutationVariables>;
export const UpdateJourneyDocument = gql`
    mutation updateJourney($data: UpdateJourneyInput!) {
  updateJourney(data: $data) {
    id
    origin
    destination
    price
    departure_time
    arrival_time
    availableSeats
    status
    automaticAccept
    createdAt
    updatedAt
    bookings {
      id
      status
      createdAt
      updatedAt
    }
    user {
      id
      firstname
      lastname
      email
      password
      dateOfBirth
      profilePicture
      role
      grade
      averageRate
      tripsAsPassenger
      tripsAsDriver
      status
      createdAt
      updatedAt
    }
  }
}
    `;
export type UpdateJourneyMutationFn = Apollo.MutationFunction<UpdateJourneyMutation, UpdateJourneyMutationVariables>;

/**
 * __useUpdateJourneyMutation__
 *
 * To run a mutation, you first call `useUpdateJourneyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateJourneyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateJourneyMutation, { data, loading, error }] = useUpdateJourneyMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateJourneyMutation(baseOptions?: Apollo.MutationHookOptions<UpdateJourneyMutation, UpdateJourneyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateJourneyMutation, UpdateJourneyMutationVariables>(UpdateJourneyDocument, options);
      }
export type UpdateJourneyMutationHookResult = ReturnType<typeof useUpdateJourneyMutation>;
export type UpdateJourneyMutationResult = Apollo.MutationResult<UpdateJourneyMutation>;
export type UpdateJourneyMutationOptions = Apollo.BaseMutationOptions<UpdateJourneyMutation, UpdateJourneyMutationVariables>;
export const UpdateJourneyStatusDocument = gql`
    mutation updateJourneyStatus($data: UpdateJourneyStatusInput!) {
  updateJourneyStatus(data: $data) {
    id
    origin
    destination
    price
    departure_time
    arrival_time
    availableSeats
    status
    automaticAccept
    createdAt
    updatedAt
    user {
      id
      firstname
      lastname
      email
      password
      dateOfBirth
      profilePicture
      averageRate
      role
      grade
      tripsAsPassenger
      tripsAsDriver
      status
      createdAt
      updatedAt
    }
    bookings {
      id
      status
      createdAt
      updatedAt
    }
  }
}
    `;
export type UpdateJourneyStatusMutationFn = Apollo.MutationFunction<UpdateJourneyStatusMutation, UpdateJourneyStatusMutationVariables>;

/**
 * __useUpdateJourneyStatusMutation__
 *
 * To run a mutation, you first call `useUpdateJourneyStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateJourneyStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateJourneyStatusMutation, { data, loading, error }] = useUpdateJourneyStatusMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateJourneyStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateJourneyStatusMutation, UpdateJourneyStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateJourneyStatusMutation, UpdateJourneyStatusMutationVariables>(UpdateJourneyStatusDocument, options);
      }
export type UpdateJourneyStatusMutationHookResult = ReturnType<typeof useUpdateJourneyStatusMutation>;
export type UpdateJourneyStatusMutationResult = Apollo.MutationResult<UpdateJourneyStatusMutation>;
export type UpdateJourneyStatusMutationOptions = Apollo.BaseMutationOptions<UpdateJourneyStatusMutation, UpdateJourneyStatusMutationVariables>;
export const PostJourneyMessageDocument = gql`
    mutation postJourneyMessage($data: CreateJourneyMessageInput!) {
  createJourneyMessage(data: $data) {
    id
    createdAt
    journey {
      journeyMessages {
        id
      }
    }
    message
    user {
      id
    }
  }
}
    `;
export type PostJourneyMessageMutationFn = Apollo.MutationFunction<PostJourneyMessageMutation, PostJourneyMessageMutationVariables>;

/**
 * __usePostJourneyMessageMutation__
 *
 * To run a mutation, you first call `usePostJourneyMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostJourneyMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postJourneyMessageMutation, { data, loading, error }] = usePostJourneyMessageMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function usePostJourneyMessageMutation(baseOptions?: Apollo.MutationHookOptions<PostJourneyMessageMutation, PostJourneyMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PostJourneyMessageMutation, PostJourneyMessageMutationVariables>(PostJourneyMessageDocument, options);
      }
export type PostJourneyMessageMutationHookResult = ReturnType<typeof usePostJourneyMessageMutation>;
export type PostJourneyMessageMutationResult = Apollo.MutationResult<PostJourneyMessageMutation>;
export type PostJourneyMessageMutationOptions = Apollo.BaseMutationOptions<PostJourneyMessageMutation, PostJourneyMessageMutationVariables>;
export const CreateRateDocument = gql`
    mutation createRate($data: CreateRatingInput!) {
  createRating(data: $data) {
    id
    rate
    userRated {
      id
    }
    booking {
      id
    }
    createdAt
    updatedAt
  }
}
    `;
export type CreateRateMutationFn = Apollo.MutationFunction<CreateRateMutation, CreateRateMutationVariables>;

/**
 * __useCreateRateMutation__
 *
 * To run a mutation, you first call `useCreateRateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRateMutation, { data, loading, error }] = useCreateRateMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateRateMutation(baseOptions?: Apollo.MutationHookOptions<CreateRateMutation, CreateRateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRateMutation, CreateRateMutationVariables>(CreateRateDocument, options);
      }
export type CreateRateMutationHookResult = ReturnType<typeof useCreateRateMutation>;
export type CreateRateMutationResult = Apollo.MutationResult<CreateRateMutation>;
export type CreateRateMutationOptions = Apollo.BaseMutationOptions<CreateRateMutation, CreateRateMutationVariables>;
export const UpdateUserDocument = gql`
    mutation updateUser($data: UpdateUserInput!) {
  updateUser(data: $data) {
    id
    firstname
    lastname
    email
    password
    dateOfBirth
    profilePicture
    role
    grade
    averageRate
    tripsAsPassenger
    tripsAsDriver
    status
    createdAt
    updatedAt
    journeys {
      id
      origin
      destination
      price
      departure_time
      arrival_time
      availableSeats
      status
      automaticAccept
      createdAt
      updatedAt
    }
    bookings {
      id
      status
      createdAt
      updatedAt
    }
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const UpdateUserPasswordDocument = gql`
    mutation updateUserPassword($data: UpdateUserPasswordInput!) {
  updateUserPassword(data: $data) {
    id
  }
}
    `;
export type UpdateUserPasswordMutationFn = Apollo.MutationFunction<UpdateUserPasswordMutation, UpdateUserPasswordMutationVariables>;

/**
 * __useUpdateUserPasswordMutation__
 *
 * To run a mutation, you first call `useUpdateUserPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserPasswordMutation, { data, loading, error }] = useUpdateUserPasswordMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateUserPasswordMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserPasswordMutation, UpdateUserPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserPasswordMutation, UpdateUserPasswordMutationVariables>(UpdateUserPasswordDocument, options);
      }
export type UpdateUserPasswordMutationHookResult = ReturnType<typeof useUpdateUserPasswordMutation>;
export type UpdateUserPasswordMutationResult = Apollo.MutationResult<UpdateUserPasswordMutation>;
export type UpdateUserPasswordMutationOptions = Apollo.BaseMutationOptions<UpdateUserPasswordMutation, UpdateUserPasswordMutationVariables>;
export const ArchiveUserDocument = gql`
    mutation archiveUser($archiveUserId: String!) {
  archiveUser(id: $archiveUserId) {
    id
    firstname
    lastname
    email
    password
    dateOfBirth
    profilePicture
    role
    grade
    tripsAsPassenger
    tripsAsDriver
    averageRate
    status
    createdAt
    updatedAt
    journeys {
      id
      origin
      destination
      price
      departure_time
      arrival_time
      availableSeats
      status
      automaticAccept
      createdAt
      updatedAt
    }
    bookings {
      id
      status
      createdAt
      updatedAt
    }
  }
}
    `;
export type ArchiveUserMutationFn = Apollo.MutationFunction<ArchiveUserMutation, ArchiveUserMutationVariables>;

/**
 * __useArchiveUserMutation__
 *
 * To run a mutation, you first call `useArchiveUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveUserMutation, { data, loading, error }] = useArchiveUserMutation({
 *   variables: {
 *      archiveUserId: // value for 'archiveUserId'
 *   },
 * });
 */
export function useArchiveUserMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveUserMutation, ArchiveUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveUserMutation, ArchiveUserMutationVariables>(ArchiveUserDocument, options);
      }
export type ArchiveUserMutationHookResult = ReturnType<typeof useArchiveUserMutation>;
export type ArchiveUserMutationResult = Apollo.MutationResult<ArchiveUserMutation>;
export type ArchiveUserMutationOptions = Apollo.BaseMutationOptions<ArchiveUserMutation, ArchiveUserMutationVariables>;
export const LoginDocument = gql`
    query Login($data: LoginInput!) {
  login(data: $data) {
    id
    firstname
    lastname
    email
    password
    dateOfBirth
    profilePicture
    role
    grade
    tripsAsPassenger
    status
    averageRate
    tripsAsDriver
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useLoginQuery__
 *
 * To run a query within a React component, call `useLoginQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLoginQuery(baseOptions: Apollo.QueryHookOptions<LoginQuery, LoginQueryVariables> & ({ variables: LoginQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
      }
export function useLoginLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoginQuery, LoginQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
        }
export function useLoginSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<LoginQuery, LoginQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
        }
export type LoginQueryHookResult = ReturnType<typeof useLoginQuery>;
export type LoginLazyQueryHookResult = ReturnType<typeof useLoginLazyQuery>;
export type LoginSuspenseQueryHookResult = ReturnType<typeof useLoginSuspenseQuery>;
export type LoginQueryResult = Apollo.QueryResult<LoginQuery, LoginQueryVariables>;
export const LogoutDocument = gql`
    query Logout {
  logout {
    success
    message
  }
}
    `;

/**
 * __useLogoutQuery__
 *
 * To run a query within a React component, call `useLogoutQuery` and pass it any options that fit your needs.
 * When your component renders, `useLogoutQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLogoutQuery({
 *   variables: {
 *   },
 * });
 */
export function useLogoutQuery(baseOptions?: Apollo.QueryHookOptions<LogoutQuery, LogoutQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LogoutQuery, LogoutQueryVariables>(LogoutDocument, options);
      }
export function useLogoutLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LogoutQuery, LogoutQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LogoutQuery, LogoutQueryVariables>(LogoutDocument, options);
        }
export function useLogoutSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<LogoutQuery, LogoutQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LogoutQuery, LogoutQueryVariables>(LogoutDocument, options);
        }
export type LogoutQueryHookResult = ReturnType<typeof useLogoutQuery>;
export type LogoutLazyQueryHookResult = ReturnType<typeof useLogoutLazyQuery>;
export type LogoutSuspenseQueryHookResult = ReturnType<typeof useLogoutSuspenseQuery>;
export type LogoutQueryResult = Apollo.QueryResult<LogoutQuery, LogoutQueryVariables>;
export const ListBookingsDocument = gql`
    query ListBookings {
  listBookings {
    id
    status
    createdAt
    updatedAt
    nbPassenger
    user {
      id
      firstname
      lastname
      email
      password
      dateOfBirth
      profilePicture
      role
      grade
      tripsAsPassenger
      tripsAsDriver
      averageRate
      status
      createdAt
      updatedAt
    }
    journey {
      id
      origin
      destination
      price
      departure_time
      arrival_time
      availableSeats
      status
      automaticAccept
      createdAt
      updatedAt
      user {
        id
        firstname
        lastname
        profilePicture
      }
    }
  }
}
    `;

/**
 * __useListBookingsQuery__
 *
 * To run a query within a React component, call `useListBookingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListBookingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListBookingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListBookingsQuery(baseOptions?: Apollo.QueryHookOptions<ListBookingsQuery, ListBookingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListBookingsQuery, ListBookingsQueryVariables>(ListBookingsDocument, options);
      }
export function useListBookingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListBookingsQuery, ListBookingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListBookingsQuery, ListBookingsQueryVariables>(ListBookingsDocument, options);
        }
export function useListBookingsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ListBookingsQuery, ListBookingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListBookingsQuery, ListBookingsQueryVariables>(ListBookingsDocument, options);
        }
export type ListBookingsQueryHookResult = ReturnType<typeof useListBookingsQuery>;
export type ListBookingsLazyQueryHookResult = ReturnType<typeof useListBookingsLazyQuery>;
export type ListBookingsSuspenseQueryHookResult = ReturnType<typeof useListBookingsSuspenseQuery>;
export type ListBookingsQueryResult = Apollo.QueryResult<ListBookingsQuery, ListBookingsQueryVariables>;
export const ListBookingsByUserDocument = gql`
    query ListBookingsByUser($userId: String!) {
  listBookingsByUser(userId: $userId) {
    id
    nbPassenger
    status
    createdAt
    updatedAt
    user {
      id
      firstname
      lastname
      email
      password
      dateOfBirth
      profilePicture
      role
      grade
      tripsAsPassenger
      tripsAsDriver
      averageRate
      status
      createdAt
      updatedAt
    }
    journey {
      id
      origin
      destination
      price
      departure_time
      arrival_time
      availableSeats
      status
      automaticAccept
      createdAt
      updatedAt
      user {
        email
        lastname
        firstname
        profilePicture
      }
    }
  }
}
    `;

/**
 * __useListBookingsByUserQuery__
 *
 * To run a query within a React component, call `useListBookingsByUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useListBookingsByUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListBookingsByUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useListBookingsByUserQuery(baseOptions: Apollo.QueryHookOptions<ListBookingsByUserQuery, ListBookingsByUserQueryVariables> & ({ variables: ListBookingsByUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListBookingsByUserQuery, ListBookingsByUserQueryVariables>(ListBookingsByUserDocument, options);
      }
export function useListBookingsByUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListBookingsByUserQuery, ListBookingsByUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListBookingsByUserQuery, ListBookingsByUserQueryVariables>(ListBookingsByUserDocument, options);
        }
export function useListBookingsByUserSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ListBookingsByUserQuery, ListBookingsByUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListBookingsByUserQuery, ListBookingsByUserQueryVariables>(ListBookingsByUserDocument, options);
        }
export type ListBookingsByUserQueryHookResult = ReturnType<typeof useListBookingsByUserQuery>;
export type ListBookingsByUserLazyQueryHookResult = ReturnType<typeof useListBookingsByUserLazyQuery>;
export type ListBookingsByUserSuspenseQueryHookResult = ReturnType<typeof useListBookingsByUserSuspenseQuery>;
export type ListBookingsByUserQueryResult = Apollo.QueryResult<ListBookingsByUserQuery, ListBookingsByUserQueryVariables>;
export const ListBookingsByJourneyDocument = gql`
    query listBookingsByJourney($journeyId: String!) {
  listBookingsByJourney(journeyId: $journeyId) {
    id
    status
    nbPassenger
    createdAt
    updatedAt
    user {
      id
      firstname
      lastname
      email
      password
      dateOfBirth
      averageRate
      profilePicture
      role
      grade
      tripsAsPassenger
      tripsAsDriver
      status
      createdAt
      updatedAt
    }
    journey {
      id
      origin
      destination
      price
      departure_time
      arrival_time
      availableSeats
      status
      automaticAccept
      createdAt
      updatedAt
      user {
        id
        firstname
        lastname
        profilePicture
      }
    }
  }
}
    `;

/**
 * __useListBookingsByJourneyQuery__
 *
 * To run a query within a React component, call `useListBookingsByJourneyQuery` and pass it any options that fit your needs.
 * When your component renders, `useListBookingsByJourneyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListBookingsByJourneyQuery({
 *   variables: {
 *      journeyId: // value for 'journeyId'
 *   },
 * });
 */
export function useListBookingsByJourneyQuery(baseOptions: Apollo.QueryHookOptions<ListBookingsByJourneyQuery, ListBookingsByJourneyQueryVariables> & ({ variables: ListBookingsByJourneyQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListBookingsByJourneyQuery, ListBookingsByJourneyQueryVariables>(ListBookingsByJourneyDocument, options);
      }
export function useListBookingsByJourneyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListBookingsByJourneyQuery, ListBookingsByJourneyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListBookingsByJourneyQuery, ListBookingsByJourneyQueryVariables>(ListBookingsByJourneyDocument, options);
        }
export function useListBookingsByJourneySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ListBookingsByJourneyQuery, ListBookingsByJourneyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListBookingsByJourneyQuery, ListBookingsByJourneyQueryVariables>(ListBookingsByJourneyDocument, options);
        }
export type ListBookingsByJourneyQueryHookResult = ReturnType<typeof useListBookingsByJourneyQuery>;
export type ListBookingsByJourneyLazyQueryHookResult = ReturnType<typeof useListBookingsByJourneyLazyQuery>;
export type ListBookingsByJourneySuspenseQueryHookResult = ReturnType<typeof useListBookingsByJourneySuspenseQuery>;
export type ListBookingsByJourneyQueryResult = Apollo.QueryResult<ListBookingsByJourneyQuery, ListBookingsByJourneyQueryVariables>;
export const FindBookingByIdDocument = gql`
    query FindBookingById($findBookingById: String!) {
  findBookingById(id: $findBookingById) {
    id
    status
    nbPassenger
    createdAt
    updatedAt
    user {
      id
      firstname
      lastname
      email
      password
      dateOfBirth
      profilePicture
      role
      grade
      tripsAsPassenger
      averageRate
      tripsAsDriver
      status
      createdAt
      updatedAt
    }
    journey {
      id
      origin
      destination
      price
      departure_time
      arrival_time
      availableSeats
      status
      automaticAccept
      createdAt
      updatedAt
      user {
        id
        firstname
        lastname
        profilePicture
      }
    }
  }
}
    `;

/**
 * __useFindBookingByIdQuery__
 *
 * To run a query within a React component, call `useFindBookingByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindBookingByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindBookingByIdQuery({
 *   variables: {
 *      findBookingById: // value for 'findBookingById'
 *   },
 * });
 */
export function useFindBookingByIdQuery(baseOptions: Apollo.QueryHookOptions<FindBookingByIdQuery, FindBookingByIdQueryVariables> & ({ variables: FindBookingByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindBookingByIdQuery, FindBookingByIdQueryVariables>(FindBookingByIdDocument, options);
      }
export function useFindBookingByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindBookingByIdQuery, FindBookingByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindBookingByIdQuery, FindBookingByIdQueryVariables>(FindBookingByIdDocument, options);
        }
export function useFindBookingByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<FindBookingByIdQuery, FindBookingByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindBookingByIdQuery, FindBookingByIdQueryVariables>(FindBookingByIdDocument, options);
        }
export type FindBookingByIdQueryHookResult = ReturnType<typeof useFindBookingByIdQuery>;
export type FindBookingByIdLazyQueryHookResult = ReturnType<typeof useFindBookingByIdLazyQuery>;
export type FindBookingByIdSuspenseQueryHookResult = ReturnType<typeof useFindBookingByIdSuspenseQuery>;
export type FindBookingByIdQueryResult = Apollo.QueryResult<FindBookingByIdQuery, FindBookingByIdQueryVariables>;
export const ListJourneysDocument = gql`
    query ListJourneys($filters: ListJourneysWithFilters) {
  listJourneys(filters: $filters) {
    arrival_time
    automaticAccept
    availableSeats
    bookings {
      createdAt
      id
      status
      updatedAt
    }
    createdAt
    departure_time
    destination
    id
    origin
    status
    price
    updatedAt
    user {
      email
      firstname
      lastname
      id
      averageRate
      profilePicture
    }
  }
}
    `;

/**
 * __useListJourneysQuery__
 *
 * To run a query within a React component, call `useListJourneysQuery` and pass it any options that fit your needs.
 * When your component renders, `useListJourneysQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListJourneysQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useListJourneysQuery(baseOptions?: Apollo.QueryHookOptions<ListJourneysQuery, ListJourneysQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListJourneysQuery, ListJourneysQueryVariables>(ListJourneysDocument, options);
      }
export function useListJourneysLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListJourneysQuery, ListJourneysQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListJourneysQuery, ListJourneysQueryVariables>(ListJourneysDocument, options);
        }
export function useListJourneysSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ListJourneysQuery, ListJourneysQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListJourneysQuery, ListJourneysQueryVariables>(ListJourneysDocument, options);
        }
export type ListJourneysQueryHookResult = ReturnType<typeof useListJourneysQuery>;
export type ListJourneysLazyQueryHookResult = ReturnType<typeof useListJourneysLazyQuery>;
export type ListJourneysSuspenseQueryHookResult = ReturnType<typeof useListJourneysSuspenseQuery>;
export type ListJourneysQueryResult = Apollo.QueryResult<ListJourneysQuery, ListJourneysQueryVariables>;
export const ListJourneysByUserDocument = gql`
    query listJourneysByUser($userId: String!) {
  listJourneysByUser(userId: $userId) {
    id
    origin
    destination
    price
    departure_time
    arrival_time
    availableSeats
    status
    automaticAccept
    createdAt
    updatedAt
    user {
      id
      firstname
      lastname
      email
      password
      dateOfBirth
      profilePicture
      role
      grade
      tripsAsPassenger
      tripsAsDriver
      status
      createdAt
      updatedAt
      averageRate
    }
    bookings {
      id
      status
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useListJourneysByUserQuery__
 *
 * To run a query within a React component, call `useListJourneysByUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useListJourneysByUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListJourneysByUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useListJourneysByUserQuery(baseOptions: Apollo.QueryHookOptions<ListJourneysByUserQuery, ListJourneysByUserQueryVariables> & ({ variables: ListJourneysByUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListJourneysByUserQuery, ListJourneysByUserQueryVariables>(ListJourneysByUserDocument, options);
      }
export function useListJourneysByUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListJourneysByUserQuery, ListJourneysByUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListJourneysByUserQuery, ListJourneysByUserQueryVariables>(ListJourneysByUserDocument, options);
        }
export function useListJourneysByUserSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ListJourneysByUserQuery, ListJourneysByUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListJourneysByUserQuery, ListJourneysByUserQueryVariables>(ListJourneysByUserDocument, options);
        }
export type ListJourneysByUserQueryHookResult = ReturnType<typeof useListJourneysByUserQuery>;
export type ListJourneysByUserLazyQueryHookResult = ReturnType<typeof useListJourneysByUserLazyQuery>;
export type ListJourneysByUserSuspenseQueryHookResult = ReturnType<typeof useListJourneysByUserSuspenseQuery>;
export type ListJourneysByUserQueryResult = Apollo.QueryResult<ListJourneysByUserQuery, ListJourneysByUserQueryVariables>;
export const FindJourneyByIdDocument = gql`
    query findJourneyById($findJourneyById: String!) {
  findJourneyById(id: $findJourneyById) {
    id
    origin
    destination
    price
    departure_time
    arrival_time
    availableSeats
    status
    automaticAccept
    createdAt
    updatedAt
    bookings {
      id
      status
      createdAt
      updatedAt
    }
    user {
      id
      firstname
      lastname
      email
      password
      dateOfBirth
      profilePicture
      role
      grade
      tripsAsPassenger
      tripsAsDriver
      status
      createdAt
      averageRate
      updatedAt
    }
  }
}
    `;

/**
 * __useFindJourneyByIdQuery__
 *
 * To run a query within a React component, call `useFindJourneyByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindJourneyByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindJourneyByIdQuery({
 *   variables: {
 *      findJourneyById: // value for 'findJourneyById'
 *   },
 * });
 */
export function useFindJourneyByIdQuery(baseOptions: Apollo.QueryHookOptions<FindJourneyByIdQuery, FindJourneyByIdQueryVariables> & ({ variables: FindJourneyByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindJourneyByIdQuery, FindJourneyByIdQueryVariables>(FindJourneyByIdDocument, options);
      }
export function useFindJourneyByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindJourneyByIdQuery, FindJourneyByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindJourneyByIdQuery, FindJourneyByIdQueryVariables>(FindJourneyByIdDocument, options);
        }
export function useFindJourneyByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<FindJourneyByIdQuery, FindJourneyByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindJourneyByIdQuery, FindJourneyByIdQueryVariables>(FindJourneyByIdDocument, options);
        }
export type FindJourneyByIdQueryHookResult = ReturnType<typeof useFindJourneyByIdQuery>;
export type FindJourneyByIdLazyQueryHookResult = ReturnType<typeof useFindJourneyByIdLazyQuery>;
export type FindJourneyByIdSuspenseQueryHookResult = ReturnType<typeof useFindJourneyByIdSuspenseQuery>;
export type FindJourneyByIdQueryResult = Apollo.QueryResult<FindJourneyByIdQuery, FindJourneyByIdQueryVariables>;
export const ListJourneyMessagesByJourneyDocument = gql`
    query listJourneyMessagesByJourney($journeyId: String!) {
  listJourneyMessagesByJourney(journeyId: $journeyId) {
    createdAt
    id
    journey {
      id
    }
    message
    user {
      id
      firstname
      profilePicture
    }
  }
}
    `;

/**
 * __useListJourneyMessagesByJourneyQuery__
 *
 * To run a query within a React component, call `useListJourneyMessagesByJourneyQuery` and pass it any options that fit your needs.
 * When your component renders, `useListJourneyMessagesByJourneyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListJourneyMessagesByJourneyQuery({
 *   variables: {
 *      journeyId: // value for 'journeyId'
 *   },
 * });
 */
export function useListJourneyMessagesByJourneyQuery(baseOptions: Apollo.QueryHookOptions<ListJourneyMessagesByJourneyQuery, ListJourneyMessagesByJourneyQueryVariables> & ({ variables: ListJourneyMessagesByJourneyQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListJourneyMessagesByJourneyQuery, ListJourneyMessagesByJourneyQueryVariables>(ListJourneyMessagesByJourneyDocument, options);
      }
export function useListJourneyMessagesByJourneyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListJourneyMessagesByJourneyQuery, ListJourneyMessagesByJourneyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListJourneyMessagesByJourneyQuery, ListJourneyMessagesByJourneyQueryVariables>(ListJourneyMessagesByJourneyDocument, options);
        }
export function useListJourneyMessagesByJourneySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ListJourneyMessagesByJourneyQuery, ListJourneyMessagesByJourneyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListJourneyMessagesByJourneyQuery, ListJourneyMessagesByJourneyQueryVariables>(ListJourneyMessagesByJourneyDocument, options);
        }
export type ListJourneyMessagesByJourneyQueryHookResult = ReturnType<typeof useListJourneyMessagesByJourneyQuery>;
export type ListJourneyMessagesByJourneyLazyQueryHookResult = ReturnType<typeof useListJourneyMessagesByJourneyLazyQuery>;
export type ListJourneyMessagesByJourneySuspenseQueryHookResult = ReturnType<typeof useListJourneyMessagesByJourneySuspenseQuery>;
export type ListJourneyMessagesByJourneyQueryResult = Apollo.QueryResult<ListJourneyMessagesByJourneyQuery, ListJourneyMessagesByJourneyQueryVariables>;
export const ListUsersDocument = gql`
    query listUsers {
  listUsers {
    id
    firstname
    lastname
    email
    password
    dateOfBirth
    profilePicture
    role
    grade
    averageRate
    tripsAsPassenger
    tripsAsDriver
    status
    createdAt
    updatedAt
    journeys {
      id
      origin
      destination
      price
      departure_time
      arrival_time
      availableSeats
      status
      automaticAccept
      createdAt
      updatedAt
    }
    bookings {
      id
      status
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useListUsersQuery__
 *
 * To run a query within a React component, call `useListUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useListUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useListUsersQuery(baseOptions?: Apollo.QueryHookOptions<ListUsersQuery, ListUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListUsersQuery, ListUsersQueryVariables>(ListUsersDocument, options);
      }
export function useListUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListUsersQuery, ListUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListUsersQuery, ListUsersQueryVariables>(ListUsersDocument, options);
        }
export function useListUsersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ListUsersQuery, ListUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListUsersQuery, ListUsersQueryVariables>(ListUsersDocument, options);
        }
export type ListUsersQueryHookResult = ReturnType<typeof useListUsersQuery>;
export type ListUsersLazyQueryHookResult = ReturnType<typeof useListUsersLazyQuery>;
export type ListUsersSuspenseQueryHookResult = ReturnType<typeof useListUsersSuspenseQuery>;
export type ListUsersQueryResult = Apollo.QueryResult<ListUsersQuery, ListUsersQueryVariables>;
export const FindUserByIdDocument = gql`
    query findUserById($findUserById: String!) {
  findUserById(id: $findUserById) {
    id
    firstname
    lastname
    email
    password
    profilePicture
    averageRate
    role
    tripsAsPassenger
    grade
    tripsAsDriver
    status
    createdAt
    updatedAt
    journeys {
      id
      origin
      destination
      price
      departure_time
      arrival_time
      availableSeats
      status
      automaticAccept
      createdAt
      updatedAt
    }
    bookings {
      id
      status
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useFindUserByIdQuery__
 *
 * To run a query within a React component, call `useFindUserByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindUserByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindUserByIdQuery({
 *   variables: {
 *      findUserById: // value for 'findUserById'
 *   },
 * });
 */
export function useFindUserByIdQuery(baseOptions: Apollo.QueryHookOptions<FindUserByIdQuery, FindUserByIdQueryVariables> & ({ variables: FindUserByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindUserByIdQuery, FindUserByIdQueryVariables>(FindUserByIdDocument, options);
      }
export function useFindUserByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindUserByIdQuery, FindUserByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindUserByIdQuery, FindUserByIdQueryVariables>(FindUserByIdDocument, options);
        }
export function useFindUserByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<FindUserByIdQuery, FindUserByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindUserByIdQuery, FindUserByIdQueryVariables>(FindUserByIdDocument, options);
        }
export type FindUserByIdQueryHookResult = ReturnType<typeof useFindUserByIdQuery>;
export type FindUserByIdLazyQueryHookResult = ReturnType<typeof useFindUserByIdLazyQuery>;
export type FindUserByIdSuspenseQueryHookResult = ReturnType<typeof useFindUserByIdSuspenseQuery>;
export type FindUserByIdQueryResult = Apollo.QueryResult<FindUserByIdQuery, FindUserByIdQueryVariables>;
export const GetProfileDocument = gql`
    query GetProfile {
  getProfile {
    lastname
    firstname
    averageRate
    profilePicture
    email
    role
    dateOfBirth
    password
  }
}
    `;

/**
 * __useGetProfileQuery__
 *
 * To run a query within a React component, call `useGetProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProfileQuery(baseOptions?: Apollo.QueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
      }
export function useGetProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
        }
export function useGetProfileSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
        }
export type GetProfileQueryHookResult = ReturnType<typeof useGetProfileQuery>;
export type GetProfileLazyQueryHookResult = ReturnType<typeof useGetProfileLazyQuery>;
export type GetProfileSuspenseQueryHookResult = ReturnType<typeof useGetProfileSuspenseQuery>;
export type GetProfileQueryResult = Apollo.QueryResult<GetProfileQuery, GetProfileQueryVariables>;