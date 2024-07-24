import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
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
        departureTime
        arrivalTime
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

export const UPDATE_USER_PASSWORD = gql`
  mutation updateUserPassword($data: UpdateUserPasswordInput!) {
    updateUserPassword(data: $data) {
      id
    }
  }
`;

export const ARCHIVE_USER = gql`
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
        departureTime
        arrivalTime
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
