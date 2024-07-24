import nodemailer from 'nodemailer'
import { UserEntity } from '../entities/user.entity'

type MailOptions = {
    from: string
    to: string
    subject: string
    text: string
}

export default class SendEmailService {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_ADDRESS,
            pass: process.env.GMAIL_PASS,
        },
    })

    private sendEmail(mailOptions: MailOptions) {
        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            }
            console.log('Message sent: %s', info)
        })
    }

    sendNewBookingRequestEmail({
        recipient,
        newBookingId,
        driverId,
        passengerName,
        nbPassengers,
    }: {
        recipient: string
        newBookingId: string
        driverId: string
        passengerName: string
        nbPassengers: number
    }) {
        const newBookingToValidate = `${process.env.CLIENT_URL}/booking/accept/${newBookingId}/${driverId}`

        const mailOptions = {
            from: 'La super team Ecovoit',
            to: recipient,
            subject: 'Nouvelle demande de réservation',
            text: `${passengerName} souhaite réserver ${nbPassengers} place(s) sur votre trajet ! Voici le lien pour l'accepter: ${newBookingToValidate}`,
        }

        this.sendEmail(mailOptions)
    }

    sendNewAutoacceptedBookingEmail({
        recipient,
        passenger: {
            id: passengerId,
            firstname: passengerFistname,
            lastname: passengerLastname,
        },
        nbPassenger,
    }: {
        recipient: string
        passenger: UserEntity
        nbPassenger: number
    }) {
        const passengerProfileLink = `${process.env.CLIENT_URL}/profile/${passengerId}`

        const mailOptions = {
            from: 'La super team Ecovoit',
            to: recipient,
            subject: 'Nouvelle réservation sur votre trajet',
            text: `${passengerFistname} ${passengerLastname} à réservé ${nbPassenger} place(s) sur votre trajet !
            Consulter le profil de ${passengerFistname} : ${passengerProfileLink}`,
        }

        this.sendEmail(mailOptions)
    }

    sendCancelledBookingEmail({
        recipient,
        passengerFistname,
    }: {
        recipient: string
        passengerFistname: string
    }) {
        const mailOptions = {
            from: 'La super team Ecovoit',
            to: recipient,
            subject: 'Réservation annulée',
            text: `Nous sommes désolés, ${passengerFistname} a annulé sa réservation.`,
        }

        this.sendEmail(mailOptions)
    }

    sendCancelledJourneyEmail({
        recipient,
        origin,
        destination,
    }: {
        recipient: string
        origin: string
        destination: string
    }) {
        const mailOptions = {
            from: 'La super team Ecovoit',
            to: recipient,
            subject: 'Votre voyage a été annulé',
            text: `Votre voyage ${origin} ${destination} a été annulé`,
        }
        this.sendEmail(mailOptions)
    }

    sendRateEmail({
        recipient,
        bookingId,
        driverId,
    }: {
        recipient: string
        bookingId: string
        driverId: string
    }) {
        const ratingLink = `${process.env.CLIENT_URL}/booking/rate/${bookingId}/${driverId}`

        const mailOptions = {
            from: 'La super team Ecovoit',
            to: recipient,
            subject: 'Notez votre trajet',
            text: `Nous espérons que votre trajet s'est bien passé, il est temps de le noter ! Voici le lien : ${ratingLink} `,
        }

        this.sendEmail(mailOptions)
    }

    sendAcceptedBookingEmail({
        recipient,
        driverFirstname,
        bookingId,
    }: {
        recipient: string
        driverFirstname: string
        bookingId: string
    }) {
        const paymentLink = `${process.env.CLIENT_URL}/payment/waiting/${bookingId}`

        const mailOptions = {
            from: 'La super team Ecovoit',
            to: recipient,
            subject: 'Réservation acceptée',
            // TODO ENVOYER LE LIEN VERS LA PAGE DE PAYMENT ET ENSUITE MARQUER LE BOOKING EN ACCEPTED
            text: `${driverFirstname} a accepté votre réservation! Vous pouvez maintenant procéder au paiement: ${paymentLink} `,
        }

        this.sendEmail(mailOptions)
    }

    sendRejectedBookingEmail({
        recipient,
        driverFirstname,
    }: {
        recipient: string
        driverFirstname: string
    }) {
        const mailOptions = {
            from: 'La super team Ecovoit',
            to: recipient,
            subject: 'Réservation rejetée',
            text: `${driverFirstname} a refusé votre réservation. Trouvez dès maintenant un nouveau trajet ! ${process.env.CLIENT_URL} `,
        }

        this.sendEmail(mailOptions)
    }

    sendBookingNotPaidSoCancel({
        recipient,
        journeyId,
        destination,
        origin,
    }: {
        recipient: string
        journeyId: string
        destination: string
        origin: string
    }) {
        const journeyDetailUrl = `${process.env.CLIENT_URL}/journey/${journeyId}`

        const mailOptions = {
            from: 'La super team Ecovoit',
            to: recipient,
            subject: 'Réservation rejetée',
            text: `Votre réservation ${origin} - ${destination} a été annulée faute de paiement de votre part dans les temps impartis ! Retrouver ce trajet : ${journeyDetailUrl} `,
        }

        this.sendEmail(mailOptions)
    }
}
