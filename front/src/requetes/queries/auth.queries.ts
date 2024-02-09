import { gql } from "@apollo/client";

export const LOGIN = gql`
  query Login($data: LoginInput!) {
    login(data: $data) {
      success
      message
    }
  }
`;
