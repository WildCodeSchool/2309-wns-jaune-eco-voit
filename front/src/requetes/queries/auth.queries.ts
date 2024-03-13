import { gql } from "@apollo/client";

export const LOGIN = gql`
  query Login($data: LoginInput!) {
    login(data: $data) {
      success
      message
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
