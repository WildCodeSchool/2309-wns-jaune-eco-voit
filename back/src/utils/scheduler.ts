import { JourneyEntity } from '../entities/journey.entity'
import BookingsService from '../services/bookings.service'
import JourneysService from '../services/journeys.service'
import UsersService from '../services/users.service'
import { transporter } from './emailTransporter'

const journeyService = new JourneysService()
const bookingService = new BookingsService()
const userService = new UsersService()

export const handleJourneysDone = async () => {
    const journeys = await journeyService.listJourneysForScheduler()

    journeys.forEach(async (journey) => {
        updateJourney(journey)
    })
}

const getNewDriverGrade = (tripsAsDriver: number) => {
    return tripsAsDriver > 5 && tripsAsDriver < 10
        ? 'CONFIRMED'
        : tripsAsDriver > 10
          ? 'AMBASSADOR'
          : undefined
}

const updateJourney = async (journey: JourneyEntity) => {
    const {
        id: journeyId,
        user: { id: driverId },
    } = journey

    await journeyService.updateJourney({ id: journeyId, status: 'DONE' })

    const { tripsAsDriver } = await userService.findUserById(driverId)

    userService.updateUser({
        id: driverId,
        tripsAsDriver: tripsAsDriver + 1,
        grade: getNewDriverGrade(tripsAsDriver),
    })

    const bookingsId = journey.bookings?.map(({ id }) => id)

    if (bookingsId && bookingsId.length > 0) {
        updateJourneyBookings(bookingsId, driverId)
    }
}

const updateJourneyBookings = async (
    bookingsId: string[],
    driverId: string
) => {
    bookingsId.forEach(async (id) => {
        const {
            user: { email: passengerEmail, id: passengerId },
        } = await bookingService.findBookingById(id)
        const { tripsAsPassenger } = await userService.findUserById(passengerId)

        userService.updateUser({
            id: passengerId,
            tripsAsPassenger: tripsAsPassenger + 1,
        })
        sendRatingEmail({
            userEmail: passengerEmail,
            ratingLink: `${process.env.CLIENT_URL}/booking/rate/${id}/${driverId}`,
        })
        await bookingService.updateBooking(id, { status: 'DONE' })
    })
}

const sendRatingEmail = ({
    ratingLink,
    userEmail,
}: {
    userEmail: string
    ratingLink: string
}) => {
    const mailOptions = {
        from: 'La super team Ecovoit',
        to: userEmail,
        subject: 'Notez votre trajet',
        text: `Nous espérons que votre trajet s'est bien passé, il est temps de le noter ! Voici le lien : ${ratingLink} `,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        }
        console.log('Message sent: %s', info.messageId)
    })
}
