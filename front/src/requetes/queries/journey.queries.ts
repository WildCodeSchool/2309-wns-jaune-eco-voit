import { gql } from "@apollo/client";

export const LIST_JOURNEYS = gql`
  query ListJourneys($filters: ListJourneysWithFilters) {
    listJourneys(filters: $filters) {
      arrivalTime
      automaticAccept
      availableSeats
      originCoordinates
      destinationCoordinates
      bookings {
        createdAt
        id
        status
        updatedAt
      }
      createdAt
      departureTime
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

export const LIST_JOURNEYS_BY_USER = gql`
  query listJourneysByUser($userId: String!) {
    listJourneysByUser(userId: $userId) {
      id
      origin
      destination
      price
      departureTime
      arrivalTime
      originCoordinates
      destinationCoordinates
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

export const FIND_JOURNEY_BY_ID = gql`
  query findJourneyById($findJourneyById: String!) {
    findJourneyById(id: $findJourneyById) {
      id
      origin
      destination
      price
      departureTime
      arrivalTime
      availableSeats
      originCoordinates
      destinationCoordinates
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

export const LIST_JOURNEY_MESSAGES_BY_JOURNEY = gql`
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
