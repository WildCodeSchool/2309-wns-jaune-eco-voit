import type { Stripe } from 'stripe'
import BookingService from './booking.service'
import { assertDataExists } from '../utils/errorHandlers'
import { ProductForSessionInput } from '../resolvers/payment.resolver'

interface LineItem {
    price_data: {
        currency: 'eur'
        product_data: {
            name: string
        }
        unit_amount: number
    }
    quantity: number
}

export default class PaymentService {
    private stripe: Stripe

    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        this.stripe = require('stripe')(process.env.STRIPE_PRIVATE_API_KEY)
    }

    async createLineItems({
        bookingId,
        nbPassenger,
        price,
    }: ProductForSessionInput): Promise<LineItem[]> {
        const booking = await new BookingService().findBookingById(bookingId)
        assertDataExists(booking)

        return [
            {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: bookingId,
                    },
                    unit_amount: +(price * 100).toFixed(0),
                },
                quantity: nbPassenger,
            },
        ]
    }

    async createSession(data: ProductForSessionInput) {
        const line_items = await this.createLineItems(data)

        const session = await this.stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/payment/success/${data.bookingId}`,
            cancel_url: `${process.env.CLIENT_URL}/payment/canceled`,
        })

        return session
    }
}
