export const REGISTER = `#graphql
    mutation Register($data: CreateUserInput!) {
      register(data: $data) {
              email
              id
              firstname
              lastname
          }
      }
`

export const UPDATE_USER = `#graphql 
    mutation Mutation($data: UpdateUserInput!) {
      updateUser(data: $data) {
        id
        firstname
        lastname
      }
    }
`
