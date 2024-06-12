import { gql } from "@apollo/client";

export const CREATE_RATE = gql`
  mutation createRate($data: CreateRatingInput!) {
    createRating(data: $data) {
      id
      rate
      userRated {
        id
      }
      booking {
        id
      }
      createdAt
      updatedAt
    }
  }
`;
