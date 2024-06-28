export const LIST_BOOKINGS = `#graphql 
    query ListBookings {
        listBookings {
            id
            nbPassenger
            status
            updatedAt
            createdAt
        }
    }
`
