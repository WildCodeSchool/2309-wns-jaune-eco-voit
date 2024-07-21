import { gql } from "@apollo/client";

export const LIST_BOOKINGS = gql`
  query ListBookings {
    listBookings {
      id
      status
      createdAt
      updatedAt
      nbPassenger
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
        averageRate
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
        user {
          id
          firstname
          lastname
          profilePicture
        }
      }
    }
  }
`;

export const LIST_BOOKINGS_BY_USER = gql`
  query ListBookingsByUser($userId: String!) {
    listBookingsByUser(userId: $userId) {
      id
      nbPassenger
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
        role
        grade
        tripsAsPassenger
        tripsAsDriver
        averageRate
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
        user {
          id
          email
          lastname
          firstname
          profilePicture
          grade
          averageRate
        }
      }
    }
  }
`;

export const LIST_BOOKINGS_BY_JOURNEY = gql`
  query listBookingsByJourney($journeyId: String!) {
    listBookingsByJourney(journeyId: $journeyId) {
      id
      status
      nbPassenger
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
        user {
          id
          firstname
          lastname
          profilePicture
        }
      }
    }
  }
`;

export const FIND_BOOKING_BY_ID = gql`
  query FindBookingById($findBookingById: String!) {
    findBookingById(id: $findBookingById) {
      id
      status
      nbPassenger
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
        averageRate
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
        user {
          id
          firstname
          lastname
          profilePicture
        }
      }
    }
  }
`;
