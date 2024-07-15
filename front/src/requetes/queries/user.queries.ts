import { gql } from "@apollo/client";

export const LIST_USERS = gql`
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

export const FIND_USER_BY_ID = gql`
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

export const GET_PROFILE = gql`
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
