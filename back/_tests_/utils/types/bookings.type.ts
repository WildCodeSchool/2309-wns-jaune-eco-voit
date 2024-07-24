import { BookingEntity } from '../../../src/entities/booking.entity'

export type ResponseCreateBooking = {
    createBooking: BookingEntity
}

export type ResponseListBookings = {
    listBooking: BookingEntity[]
}
