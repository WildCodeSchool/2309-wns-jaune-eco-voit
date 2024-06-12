import { gql } from "@apollo/client";

export const LIST_JOURNEYS = gql`
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
      totalPrice
      updatedAt
      user {
        email
        firstname
        lastname
        id
        averageRate
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
