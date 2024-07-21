import { gql } from "@apollo/client";

export const CREATE_JOURNEY = gql`
  mutation createJourney($data: CreateJourneyInput!) {
    createJourney(data: $data) {
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
      user {
        id
        firstname
        lastname
        email
        password
        dateOfBirth
        averageRate
        profilePicture
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
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_JOURNEY = gql`
  mutation updateJourney($data: UpdateJourneyInput!) {
    updateJourney(data: $data) {
      id
      origin
      destination
      price
      departureTime
      availableSeats
      status
      automaticAccept
    }
  }
`;

export const UPDATE_JOURNEY_STATUS = gql`
  mutation updateJourneyStatus($data: UpdateJourneyStatusInput!) {
    updateJourneyStatus(data: $data) {
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
      user {
        id
        firstname
        lastname
        email
        password
        dateOfBirth
        profilePicture
        averageRate
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
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const POST_JOURNEY_MESSAGE = gql`
  mutation postJourneyMessage($data: CreateJourneyMessageInput!) {
    createJourneyMessage(data: $data) {
      id
      createdAt
      journey {
        journeyMessages {
          id
        }
      }
      message
      user {
        id
      }
    }
  }
`;
