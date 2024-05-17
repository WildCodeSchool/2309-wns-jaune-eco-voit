export const CREATE_JOURNEY = `#graphql
    mutation Mutation($data: CreateJourneyInput!) {
    createJourney(data: $data) {
        destination
        origin
        availableSeats
        user {
          id
        }
      }
    }
    `
