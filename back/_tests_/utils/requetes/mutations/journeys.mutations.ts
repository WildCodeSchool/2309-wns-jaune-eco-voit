export const CREATE_JOURNEY = `#graphql
    mutation Mutation($data: CreateJourneyInput!) {
    createJourney(data: $data) {
        destination
        origin
        availableSeats
        user {
          id
        }
        automaticAccept
      }
    }
    `

export const UPDATE_JOURNEY_STATUS = `#graphql 
    mutation updateJourneyStatus($data: UpdateJourneyStatusInput!) {
      updateJourneyStatus(data: $data) {
        id
  }
}
`
