import { gql } from "@apollo/client";

export const CREATE_JOURNEY = gql`
  mutation createJourney($data: CreateJourneyInput!) {
    createJourney(data: $data) {
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
        updatedAt
      }
    }
  }
`;

export const UPDATE_JOURNEY_STATUS = gql`
  mutation updateJourneyStatus($data: UpdateJourneyStatusInput!) {
    updateJourneyStatus(data: $data) {
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

export const INCREASE_AVAILABLE_SEATS = gql`
  mutation increaseAvailableSeats($increaseAvailableSeatsId: String!) {
    increaseAvailableSeats(id: $increaseAvailableSeatsId) {
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

export const DECREASE_AVAILABLE_SEATS = gql`
  mutation decreaseAvailableSeats($decreaseAvailableSeatsId: String!) {
    decreaseAvailableSeats(id: $decreaseAvailableSeatsId) {
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
