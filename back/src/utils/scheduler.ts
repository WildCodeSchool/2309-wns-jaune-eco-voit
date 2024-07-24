import dayjs from 'dayjs'
import JourneysService from '../services/journey.service'
import utc from 'dayjs/plugin/utc'
import BookingService from '../services/booking.service'

dayjs.extend(utc)

const journeyService = new JourneysService()
const bookingService = new BookingService()

export const handleJourneysDone = async () => {
    const journeys = await journeyService.listJourneysForScheduler()

    journeys.forEach(async ({ id }) => {
        await journeyService.updateJourneyStatus({ id, status: 'DONE' })
    })
}

export const handleBookingsNotPaid = async () => {
    const acceptedBookingToCancel =
        await bookingService.listBookingsForScheduler()

    acceptedBookingToCancel.forEach(async ({ id }) => {
        await bookingService.cancelBookingForScheduler(id)
    })
}
