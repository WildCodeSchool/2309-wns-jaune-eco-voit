
export const LOGIN = `#graphql
query Login($infos: InputLogin!) {
    login(infos: $infos) {
      success
      message
    }
  }
`