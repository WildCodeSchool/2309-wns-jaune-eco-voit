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
      departure_time
      availableSeats
      automaticAccept
      arrival_time
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
