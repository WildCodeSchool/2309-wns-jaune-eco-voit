import { validate } from 'class-validator'

export const validateData = async (dataToValidate: object) => {
    const errors = await validate(dataToValidate)

    if (errors.length !== 0) {
        console.log(errors)
        throw new Error('Something wrong with the validation')
    }
}

export const assertDataExists = (data: object | null) => {
    if (!data) throw new Error('Data not found')
}
