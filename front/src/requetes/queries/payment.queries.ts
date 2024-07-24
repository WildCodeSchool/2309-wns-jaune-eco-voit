import { gql } from "@apollo/client";

export const CREATE_PAYEMENT_SESSION = gql`
  query createPaymentSession($data: ProductForSessionInput!) {
    createSession(data: $data)
  }
`;
