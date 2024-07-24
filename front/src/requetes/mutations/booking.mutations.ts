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
        averageRate
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
      }
      journey {
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
        averageRate
        dateOfBirth
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
        price
        departureTime
        arrivalTime
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
      journey {
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
      journey {
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
      }
    }
  }
`;

export const PAID_BOOKING = gql`
  mutation paidBooking($bookingPaidId: String!) {
    bookingPaid(id: $bookingPaidId) {
      id
    }
  }
`;
