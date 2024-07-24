import { validate } from 'class-validator'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const validateData = async (dataToValidate: object) => {
    const errors = await validate(dataToValidate)
    if (errors.length > 0) {
        const errorMessages = errors
            .map((error) => Object.values(error.constraints || {}))
            .flat()

        throw new Error(`Validation failed: ${errorMessages.join(', ')}`)
    }
}

export const assertDataExists = (data: object | null) => {
    if (!data) throw new Error('Data not found')
}

export const validateJourneyInputs = ({
    origin,
    destination,
    departureTime,
    price,
}: {
    price?: number
    origin?: string
    destination?: string
    departureTime?: Date
}) => {
    const now = dayjs().utc()

    if (
        departureTime &&
        dayjs(departureTime).utc().isBefore(now.add(100, 'minute'))
    ) {
        throw new Error('Departure time must be at least in two hours')
    }

    if (origin && destination && origin === destination) {
        throw new Error('Origin must be different than destination')
    }

    if (price && price <= 0) {
        throw new Error('Price must be more than zero')
    }
}
