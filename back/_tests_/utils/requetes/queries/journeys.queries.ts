export const FIND_JOURNEY_BY_ID = `#graphql 
query Query($findJourneyByIdId: String!) {
  findJourneyById(id: $findJourneyByIdId) {
    id
    availableSeats
    user {
      id
    }
    status
    price
    origin
    destination
    automaticAccept
  }
}
`

export const LIST_JOURNEYS = `#graphql 
  query Query {
    listJourneys {
      departureTime
      availableSeats
      automaticAccept
      arrivalTime
      createdAt
      destination
      id
      origin
      status
      price
      user {
        id
      } 
    }
  }
`
