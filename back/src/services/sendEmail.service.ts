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
            console.log('Message sent: %s', info.messageId)
        })
    }

    sendNewBookingEmail({
        recipient,
        newBookingId,
        driverId,
    }: {
        recipient: string
        newBookingId: string
        driverId: string
    }) {
        const newBookingLink = `${process.env.CLIENT_URL}/booking/accept/${newBookingId}/${driverId}`

        const mailOptions = {
            from: 'La super team Ecovoit',
            to: recipient,
            subject: 'Nouvelle demande de réservation',
            text: `Un passager souhaite réserver votre trajet ! Voici le lien pour l'accepter: ${newBookingLink}`,
        }

        this.sendEmail(mailOptions)
    }

    sendNewBookingAutoAcceptedEmail({
        recipient,
        newBookingId,
        passenger,
        nbPassenger,
    }: {
        recipient: string
        newBookingId: string
        passenger: UserEntity
        nbPassenger: number
    }) {
        const passengerProfileLink = `${process.env.CLIENT_URL}/profile/${passenger.id}`

        const mailOptions = {
            from: 'La super team Ecovoit',
            to: recipient,
            subject: 'Nouvelle réservation sur votre trajet',
            text: `${passenger.firstname} ${passenger.lastname} à réservé ${nbPassenger} place(s) sur votre trajet !
            Consulter le profil de ${passenger.firstname} : ${passengerProfileLink}`,
        }

        this.sendEmail(mailOptions)
    }

    sendCancelBookingEmail({
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

    sendCancelJourneyEmail({
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

    sendAcceptBookingEmail({
        recipient,
        driverFirstname,
        journeyId,
    }: {
        recipient: string
        driverFirstname: string
        journeyId: string
    }) {
        const journeyDetailLink = `${process.env.CLIENT_URL}/journey/${journeyId}`

        const mailOptions = {
            from: 'La super team Ecovoit',
            to: recipient,
            subject: 'Réservation acceptée',
            text: `${driverFirstname} a accepté votre réservation! Vous pouvez maintenant communiquer: ${journeyDetailLink} `,
        }

        this.sendEmail(mailOptions)
    }

    sendRejectBookingEmail({
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
}
