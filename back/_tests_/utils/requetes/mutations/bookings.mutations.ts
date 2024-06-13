export const CREATE_BOOKING = `#graphql
  mutation Mutation($data: CreateBookingInput!) {
    createBooking(data: $data) {
      user {
        id
      }
      totalPrice
      status
      journey {
        id
      }
    }
  }
`
