export const FIND_USER_BY_ID = `#graphql
  query FindUserById($findUserById: String!) {
      findUserById(id: $findUserById) {
        id
        firstname
        lastname
        email
        password
        role
        grade
        tripsAsPassenger
        tripsAsDriver
        status
      }
    }
`

export const LIST_USERS = `#graphql
query ListUsers {
  listUsers {
    id
    firstname
    lastname
    email
    password
    role
    grade
    tripsAsPassenger
    tripsAsDriver
    status
  }
}`
