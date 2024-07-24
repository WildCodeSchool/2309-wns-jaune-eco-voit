import { gql } from "@apollo/client";

export const REGISTER = gql`
  mutation register($data: CreateUserInput!) {
    register(data: $data) {
      firstname
      lastname
      email
    }
  }
`;
