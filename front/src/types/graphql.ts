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
  arrivalTime: Scalars['DateTimeISO']['output'];
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
  arrivalTime: Scalars['DateTimeISO']['input'];
  departureTime: Scalars['DateTimeISO']['input'];
  journey: PartialBookingInput;
  status?: InputMaybe<Scalars['String']['input']>;
  totalPrice: Scalars['Float']['input'];
  user: PartialBookingInput;
};

export type CreateJourneyInput = {
  arrival_time: Scalars['DateTimeISO']['input'];
  automaticAccept: Scalars['Boolean']['input'];
  availableSeats: Scalars['Float']['input'];
  departure_time: Scalars['DateTimeISO']['input'];
  destination: Scalars['String']['input'];
  origin: Scalars['String']['input'];
  totalPrice: Scalars['Float']['input'];
  user: PartialUserInput;
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
  createJourney: JourneyEntity;
  decreaseAvailableSeats: JourneyEntity;
  increaseAvailableSeats: JourneyEntity;
  register: UserWithoutPassord;
  rejectBooking: BookingEntity;
  updateJourney: JourneyEntity;
  updateJourneyStatus: JourneyEntity;
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


export type MutationCreateJourneyArgs = {
  data: CreateJourneyInput;
};


export type MutationDecreaseAvailableSeatsArgs = {
  id: Scalars['String']['input'];
};


export type MutationIncreaseAvailableSeatsArgs = {
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

export type PartialBookingInput = {
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
  listBookings: Array<BookingEntity>;
  listBookingsByJourney: Array<BookingEntity>;
  listBookingsByUser: Array<BookingEntity>;
  listJourneys: Array<JourneyEntity>;
  listJourneysByUser: Array<JourneyEntity>;
  listUsers: Array<UserEntity>;
  login: UserMessage;
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

<<<<<<< HEAD
=======

>>>>>>> f1e25cfdb36d6400044d02f8db7cdd102e91f1ae
export type QueryListBookingsByJourneyArgs = {
  journeyId: Scalars['String']['input'];
};


export type QueryListBookingsByUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryListJourneysByUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryLoginArgs = {
  data: LoginInput;
};

export type UpdateJourneyInput = {
  arrival_time?: InputMaybe<Scalars['DateTimeISO']['input']>;
  automaticAccept?: InputMaybe<Scalars['Boolean']['input']>;
  availableSeats?: InputMaybe<Scalars['Float']['input']>;
  departure_time?: InputMaybe<Scalars['DateTimeISO']['input']>;
  destination?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  origin?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  totalPrice?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateJourneyStatusInput = {
  id: Scalars['ID']['input'];
  status: Scalars['String']['input'];
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
  grade?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  journeys?: Maybe<Array<JourneyEntity>>;
  lastname: Scalars['String']['output'];
  password: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['PhoneNumber']['output']>;
  profilPicture?: Maybe<Scalars['String']['output']>;
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

export type UserWithoutPassord = {
  __typename?: 'UserWithoutPassord';
  email: Scalars['EmailAddress']['output'];
  firstname: Scalars['String']['output'];
  lastname: Scalars['String']['output'];
};

export type RegisterMutationVariables = Exact<{
  data: CreateUserInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserWithoutPassord', firstname: string, lastname: string, email: any } };

export type LoginQueryVariables = Exact<{
  data: LoginInput;
}>;

<<<<<<< HEAD

export type LoginQuery = { __typename?: 'Query', login: { __typename?: 'UserMessage', success: boolean, message: string } };

export type LogoutQueryVariables = Exact<{ [key: string]: never; }>;


export type LogoutQuery = { __typename?: 'Query', logout: { __typename?: 'UserMessage', success: boolean, message: string } };


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
export const LoginDocument = gql`
    query Login($data: LoginInput!) {
  login(data: $data) {
    success
    message
  }
}
    `;
=======

export type LoginQuery = { __typename?: 'Query', login: { __typename?: 'UserMessage', success: boolean, message: string } };


export const LoginDocument = gql`
    query Login($data: LoginInput!) {
  login(data: $data) {
    success
    message
  }
}
    `;
>>>>>>> f1e25cfdb36d6400044d02f8db7cdd102e91f1ae

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
<<<<<<< HEAD
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
export type LoginQueryResult = Apollo.QueryResult<LoginQuery, LoginQueryVariables>;

=======
export type LoginQueryResult = Apollo.QueryResult<LoginQuery, LoginQueryVariables>;
>>>>>>> f1e25cfdb36d6400044d02f8db7cdd102e91f1ae
