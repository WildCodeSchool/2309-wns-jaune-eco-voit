import { validate } from 'class-validator'

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
