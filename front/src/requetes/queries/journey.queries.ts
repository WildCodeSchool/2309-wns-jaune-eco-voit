import { gql } from "@apollo/client";

export const LIST_JOURNEYS = gql`
  query listJourneys {
    listJourneys {
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
      user {
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

export const LIST_JOURNEYS_BY_USER = gql`
  query listJourneysByUser($userId: String!) {
    listJourneysByUser(userId: $userId) {
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
      user {
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

export const FIND_JOURNEY_BY_ID = gql`
  query findJourneyById($findJourneyByIdId: String!) {
    findJourneyById(id: $findJourneyByIdId) {
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
      bookings {
        id
        totalPrice
        departureTime
        arrivalTime
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
        phoneNumber
        profilPicture
        role
        grade
        tripsAsPassenger
        tripsAsDriver
        status
        createdAt
        updatedAt
      }
    }
  }
`;
