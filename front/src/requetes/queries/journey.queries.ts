import { gql } from "@apollo/client";

export const LIST_JOURNEYS = gql`
  query ListJourneys($filters: ListJourneysWithFilters) {
    listJourneys(filters: $filters) {
      arrival_time
      automaticAccept
      availableSeats
      bookings {
        arrivalTime
        createdAt
        departureTime
        id
        status
        totalPrice
        updatedAt
        user {
          firstname
          email
          lastname
          id
        }
      }
      createdAt
      departure_time
      destination
      id
      origin
      status
      totalPrice
      updatedAt
      user {
        email
        firstname
        lastname
        id
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
  query findJourneyById($findJourneyById: String!) {
    findJourneyById(id: $findJourneyById) {
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
