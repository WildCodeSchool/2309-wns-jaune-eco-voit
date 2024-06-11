import { gql } from "@apollo/client";

export const CREATE_BOOKING = gql`
  mutation createBooking($data: CreateBookingInput!) {
    createBooking(data: $data) {
      id
      status
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
      journey {
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
    }
  }
`;

export const ACCEPT_BOOKING = gql`
  mutation acceptBooking($acceptBookingId: String!) {
    acceptBooking(id: $acceptBookingId) {
      id
      status
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
      journey {
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
    }
  }
`;

export const REJECT_BOOKING = gql`
  mutation rejectBooking($rejectBookingId: String!) {
    rejectBooking(id: $rejectBookingId) {
      id
      status
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
      journey {
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
    }
  }
`;

export const CANCEL_BOOKING = gql`
  mutation cancelBooking($cancelBookingId: String!) {
    cancelBooking(id: $cancelBookingId) {
      id
      status
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
      journey {
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
    }
  }
`;
