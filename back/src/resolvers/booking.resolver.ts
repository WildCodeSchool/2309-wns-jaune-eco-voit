import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import BookingService from '../services/bookings.service'
import { BookingEntity, CreateBookingInput } from '../entities/booking.entity'
import { MyContext } from '..'
import UsersService from '../services/users.service'
import JourneysService from '../services/journeys.service'
import { userAuthorized } from '../utils/userAuthorized'
import { transporter } from '../utils/emailTransporter'
import { ValidationError } from 'class-validator'

@Resolver(() => BookingEntity)
export default class BookingResolver {
    @Authorized(['ADMIN'])
    @Query(() => [BookingEntity])
    async listBookings() {
        return await new BookingService().listBookings()
    }

    @Authorized()
    @Query(() => BookingEntity)
    async findBookingById(@Arg('id') id: string, @Ctx() { user }: MyContext) {
        const booking = await new BookingService().findBookingById(id)
        const journey = await new JourneysService().findJourneyById(
            booking.journey.id
        )
        userAuthorized([booking.user.id, journey.user.id], user)
        return booking
    }

    @Authorized()
    @Query(() => [BookingEntity])
    async listBookingsByUser(
        @Arg('userId') userId: string,
        @Ctx() { user }: MyContext
    ) {
        // On vérifie l'id envoyé en argument correspond bien à un user existant dans la DB
        // Si ce n'est pas le cas, une erreur sera envoyé directement depuis la méthode findUserById du userService
        // Donc pas besoin de le gérer ici
        // On n'a pas besoin de créer de stocker la data dans une variable puisque le but ici est simplement de vérifier que le user existe
        await new UsersService().findUserById(userId)

        // On vérifie que l'id du user envoyé par le context correspond à l'id envoyé en arg
        userAuthorized([userId], user)

        return await new BookingService().listBookingsFilter({
            userId,
        })
    }

    @Authorized()
    @Query(() => [BookingEntity])
    async listBookingsByJourney(
        @Arg('journeyId') journeyId: string,
        @Ctx() { user }: MyContext
    ) {
        // On vérifie que la journeyId envoyé existe
        // Si ce n'est pas le cas, l'erreur sera envoyé directement depuis la fonciton findJourneyById du JourneysService
        // Donc pas besoin de le gérer ici
        // On n'a pas besoin de créer de stocker la data dans une variable puisque le but ici est simplement de vérifier que la journey existe
        const { status: journeyStatus, user: journeyUser } =
            await new JourneysService().findJourneyById(journeyId)

        const bookings = await new BookingService().listBookingsFilter({
            journeyId,
        })

        if (user?.role === 'ADMIN' || journeyUser.id === user?.id) {
            return bookings
        } else {
            if (journeyStatus === 'PLANNED') {
                return bookings.filter(
                    (booking) => booking.status === 'ACCEPTED'
                )
            } else {
                throw new Error('Access denied')
            }
        }
    }

    @Authorized()
    @Mutation(() => BookingEntity)
    async createBooking(
        @Arg('data') data: CreateBookingInput,
        @Ctx() { user }: MyContext
    ) {
        userAuthorized([data.user.id], user)

        const journeyService = new JourneysService()
        const {
            availableSeats,
            automaticAccept,
            user: { email: driverEmail, id: driverId },
        } = await journeyService.findJourneyById(data.journey.id)

        if (availableSeats <= 0 || availableSeats < data.nbPassenger)
            throw new Error('Le nombre de places disponibles est insuffisant')
       
        if (data.user.id === driverId) {
            throw new Error("Vous ne pouvez pas réserver votre propre trajet")
        }

        const newBooking = await new BookingService().createBooking({
            ...data,
            status: automaticAccept ? 'ACCEPTED' : 'PENDING',
        })
        

        if (!automaticAccept) {
            const acceptLink = `${process.env.CLIENT_URL}/booking/accept/${newBooking.id}/${driverId}`

            const mailOptions = {
                from: 'La super team Ecovoit',
                to: driverEmail,
                subject: 'Nouvelle demande de réservation',
                text: `Un passager souhaite réserver votre trajet ! Voici le lien pour l'accepter: ${acceptLink}`,
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                }
                console.log('Message sent: %s', info.messageId)
            })
        }

        automaticAccept &&
            (await journeyService.updateJourney({
                id: data.journey.id,
                availableSeats: availableSeats - data.nbPassenger,
            }))

        return newBooking
    }

    @Authorized()
    @Mutation(() => BookingEntity)
    async acceptBooking(@Arg('id') id: string, @Ctx() { user }: MyContext) {
        const bookingService = new BookingService()

        const {
            journey: { id: journeyId, availableSeats },
            user: { email: passengerEmail },
            nbPassenger
        } = await bookingService.findBookingById(id)

        const {
            user: { id: driverId, firstname: driverFirstname },
        } = await new JourneysService().findJourneyById(journeyId)

        userAuthorized([driverId], user)

        if (availableSeats <= 0 || availableSeats < nbPassenger)
            throw new Error('Le nombre de places disponibles est insuffisant')

        await new JourneysService().updateJourney({
            id: journeyId,
            availableSeats: availableSeats - nbPassenger,
        })

        const bookingAccepted = await bookingService.updateBooking(id, {
            status: 'ACCEPTED',
        })

        if (bookingAccepted) {
            const journeyDetailLink = `${process.env.CLIENT_URL}/journey/${journeyId}`

            const mailOptions = {
                from: 'La super team Ecovoit',
                to: passengerEmail,
                subject: 'Réservation acceptée',
                text: `${driverFirstname} a accepté votre réservation! Vous pouvez maintenant communiquer: ${journeyDetailLink} `,
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                }
                console.log('Message sent: %s', info.messageId)
            })
        }

        return bookingAccepted
    }

    @Authorized()
    @Mutation(() => BookingEntity)
    async rejectBooking(@Arg('id') id: string, @Ctx() { user }: MyContext) {
        const bookingService = new BookingService()

        const {
            journey: { id: journeyId },
            user: { email: passengerEmail },
        } = await bookingService.findBookingById(id)

        const {
            user: { id: driverId, firstname: driverFirstname },
        } = await new JourneysService().findJourneyById(journeyId)

        userAuthorized([driverId], user)

        const bookingRejected = await bookingService.updateBooking(id, {
            status: 'REJECTED',
        })

        if (bookingRejected) {
            const mailOptions = {
                from: 'La super team Ecovoit',
                to: passengerEmail,
                subject: 'Réservation rejetée',
                text: `${driverFirstname} a refusé votre réservation. Trouvez dès maintenant un nouveau trajet ! ${process.env.CLIENT_URL} `,
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                }
                console.log('Message sent: %s', info.messageId)
            })
        }

        return bookingRejected
    }

    @Authorized()
    @Mutation(() => BookingEntity)
    async cancelBooking(@Arg('id') id: string, @Ctx() { user }: MyContext) {
        const bookingService = new BookingService()

        const { journey, user: userBooking, nbPassenger } =
            await bookingService.findBookingById(id)

        userAuthorized([userBooking.id], user)

        const archivedBooking = await new BookingService().updateBooking(id, {
            status: 'CANCELLED',
        })

        if (archivedBooking instanceof ValidationError) return //TODO vérifier le type de l'erreur

        await new JourneysService().updateJourney({
            id: journey.id,
            availableSeats: journey.availableSeats + nbPassenger,
        })

        const mailOptions = {
            from: 'La super team Ecovoit',
            to: journey.user.email,
            subject: 'Réservation annulée',
            text: `Nous sommes désolé, ${userBooking.firstname} a annulé sa réservation.`,
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            }
            console.log('Message sent: %s', info.messageId)
        })
        return archivedBooking
    }
}
