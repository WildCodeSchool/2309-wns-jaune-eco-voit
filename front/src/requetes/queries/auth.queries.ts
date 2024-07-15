import { gql } from "@apollo/client";

export const LOGIN = gql`
  query Login($data: LoginInput!) {
    login(data: $data) {
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
      status
      averageRate
      tripsAsDriver
      createdAt
      updatedAt
    }
  }
`;

export const LOGOUT = gql`
  query Logout {
    logout {
      success
      message
    }
  }
`;
