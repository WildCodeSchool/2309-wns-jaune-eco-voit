import { GraphQLJSON } from 'graphql-scalars'
import { Arg, Field, InputType, Query, Resolver } from 'type-graphql'
import PaymentService from '../services/payment.service'

@InputType()
export class ProductForSessionInput {
    @Field()
    bookingId: string

    @Field()
    nbPassenger: number

    @Field()
    price: number
}

@Resolver()
export default class PaymentResolver {
    @Query(() => GraphQLJSON)
    async createSession(
        @Arg('data', () => ProductForSessionInput)
        data: ProductForSessionInput
    ) {
        return await new PaymentService().createSession(data)
    }
}
