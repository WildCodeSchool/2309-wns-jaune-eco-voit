import { gql } from "@apollo/client";

export const LIST_BOOKINGS = gql`
  query ListBookings {
    listBookings {
      id
      totalPrice
      departureTime
      arrivalTime
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
        profilPicture
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

export const LIST_BOOKINGS_BY_USER = gql`
  query ListBookingsByUser($userId: String!) {
    listBookingsByUser(userId: $userId) {
      id
      totalPrice
      departureTime
      arrivalTime
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
        profilPicture
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

export const LIST_BOOKINGS_BY_JOURNEY = gql`
  query listBookingsByJourney($journeyId: String!) {
    listBookingsByJourney(journeyId: $journeyId) {
      id
      totalPrice
      departureTime
      arrivalTime
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
        profilPicture
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

export const FIND_BOOKING_BY_ID = gql`
  query FindBookingById($findBookingByIdId: String!) {
    findBookingById(id: $findBookingByIdId) {
      id
      totalPrice
      departureTime
      arrivalTime
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
        profilPicture
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
