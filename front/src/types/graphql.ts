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
  PhoneNumber: { input: any; output: any; }
};

export type BookingEntity = {
  __typename?: 'BookingEntity';
  createdAt: Scalars['DateTimeISO']['output'];
  departureTime: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  journey: JourneyEntity;
  status: Scalars['String']['output'];
  totalPrice: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  user: UserEntity;
};

export type CreateBookingInput = {
  departureTime: Scalars['DateTimeISO']['input'];
  journey: PartialBookingInput;
  status: Scalars['String']['input'];
  steps: Array<PartialBookingInput>;
  totalPrice: Scalars['Float']['input'];
  user: PartialBookingInput;
};

export type CreateUserInput = {
  dateOfBirth: Scalars['DateTimeISO']['input'];
  email: Scalars['String']['input'];
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
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
  origin: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalPrice: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  user: UserEntity;
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
  increaseTripsAsDriver: UserEntity;
  increaseTripsAsPassenger: UserEntity;
  register: UserWithoutPassord;
  rejectBooking: BookingEntity;
  updateUser: UserEntity;
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


export type MutationIncreaseTripsAsDriverArgs = {
  id: Scalars['String']['input'];
};


export type MutationIncreaseTripsAsPassengerArgs = {
  id: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  data: CreateUserInput;
};


export type MutationRejectBookingArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
};

export type PartialBookingInput = {
  id: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  findBookingById: BookingEntity;
  findBookingByJourney: Array<BookingEntity>;
  findBookingByUser: Array<BookingEntity>;
  findUserByEmail: UserEntity;
  findUserById: UserEntity;
  listBookings: Array<BookingEntity>;
  listUsers: Array<UserEntity>;
  login: UserMessage;
};


export type QueryFindBookingByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryFindBookingByJourneyArgs = {
  id: Scalars['String']['input'];
};


export type QueryFindBookingByUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryFindUserByEmailArgs = {
  email: Scalars['String']['input'];
};


export type QueryFindUserByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryLoginArgs = {
  data: LoginInput;
};

export type UpdateUserInput = {
  dateOfBirth?: InputMaybe<Scalars['DateTimeISO']['input']>;
  email?: InputMaybe<Scalars['EmailAddress']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  grade?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  lastname?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['PhoneNumber']['input']>;
  profilePicture?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  tripsAsDriver?: InputMaybe<Scalars['Float']['input']>;
  tripsAsPassenger?: InputMaybe<Scalars['Float']['input']>;
};

export type UserEntity = {
  __typename?: 'UserEntity';
  bookings?: Maybe<Array<BookingEntity>>;
  createdAt: Scalars['DateTimeISO']['output'];
  dateOfBirth: Scalars['DateTimeISO']['output'];
  email: Scalars['EmailAddress']['output'];
  firstname: Scalars['String']['output'];
  grade: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  journeys?: Maybe<Array<JourneyEntity>>;
  lastname: Scalars['String']['output'];
  password: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['PhoneNumber']['output']>;
  profilPicture?: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
  status: Scalars['String']['output'];
  tripsAsDriver: Scalars['Float']['output'];
  tripsAsPassenger: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type UserMessage = {
  __typename?: 'UserMessage';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type UserWithoutPassord = {
  __typename?: 'UserWithoutPassord';
  email: Scalars['EmailAddress']['output'];
};

export type LoginQueryVariables = Exact<{
  data: LoginInput;
}>;


export type LoginQuery = { __typename?: 'Query', login: { __typename?: 'UserMessage', success: boolean, message: string } };


export const LoginDocument = gql`
    query Login($data: LoginInput!) {
  login(data: $data) {
    success
    message
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