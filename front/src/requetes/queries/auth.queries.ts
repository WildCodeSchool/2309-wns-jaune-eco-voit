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
      phoneNumber
      profilPicture
      role
      grade
      tripsAsPassenger
      status
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
