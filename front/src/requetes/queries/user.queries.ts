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
      phoneNumber
      profilPicture
      role
      grade
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
        totalPrice
        departureTime
        arrivalTime
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const FIND_USER_BY_ID = gql`
  query findUserById($findUserByIdId: String!) {
    findUserById(id: $findUserByIdId) {
      id
      firstname
      lastname
      email
      password
      dateOfBirth
      phoneNumber
      profilPicture
      role
      grade
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
        totalPrice
        departureTime
        arrivalTime
        status
        createdAt
        updatedAt
      }
    }
  }
`;
