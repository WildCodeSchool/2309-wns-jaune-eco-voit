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
      phoneNumber
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
        totalPrice
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

export const ARCHIVE_USER = gql`
  mutation archiveUser($archiveUserId: String!) {
    archiveUser(id: $archiveUserId) {
      id
      firstname
      lastname
      email
      password
      dateOfBirth
      phoneNumber
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
        totalPrice
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
