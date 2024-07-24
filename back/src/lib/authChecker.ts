import { AuthChecker } from 'type-graphql'
import { MyContext } from '..'

export const customAuthChecker: AuthChecker<MyContext> = (
    { context },
    roles
) => {
    if (context.user) {
        if (!roles || roles.length === 0) {
            return true
        } else if (roles.length > 0 && roles.includes(context.user.role)) {
            return true
        }
    }

    return false
}
