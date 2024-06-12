import { JourneyEntity } from '../entities/journey.entity'
import BookingsService from '../services/bookings.service'
import JourneysService from '../services/journeys.service'
import nodemailer from 'nodemailer'

const journeyService = new JourneysService()
const bookingService = new BookingsService()

const sendEmail = ({
    ratingLink,
    userEmail,
}: {
    userEmail: string
    ratingLink: string
}) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_ADDRESS,
            pass: process.env.GMAIL_PASS,
        },
    })

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

export const changeJourneysStatus = async () => {
    const journeys = await journeyService.listJourneysForScheduler()

    journeys.forEach(async (journey) => {
        updateJourney(journey)
    })
}

const updateJourney = async (journey: JourneyEntity) => {
    const { id } = journey

    await journeyService.updateJourney({ id, status: 'DONE' })

    const bookingsId = journey.bookings?.map(({ id }) => id)

    if (bookingsId && bookingsId.length > 0) {
        bookingsId.forEach(async (id) => {
            updateBooking(id, journey.user.id)
        })
    }
}

const updateBooking = async (id: string, userRatedId: string) => {
    const {
        user: { email: userEmail },
    } = await bookingService.findBookingById(id)
    // TODO COMPLETER LE LIEN
    sendEmail({
        userEmail,
        ratingLink: `${process.env.CLIENT_URL}/booking/rate/${id}/${userRatedId}`,
    })
    await bookingService.updateBooking(id, { status: 'DONE' })
}
