import * as yup from 'yup'

export const LoginSchema = yup.object().shape({
    email:yup.string().email().required(),
    password:yup.string()
        .matches(/^(?:[a-zA-Z])+[a-zA-Z0-9@#$&!]+$/, {
        message:
            'The first letter of Password must be alphabet only and it contains A-Z,a-z,0-9, or special character',
        excludeEmptyString: true,
        })
        .min(8, 'Password contain minimum at 8 characters')
        .max(32, 'Password contain maximum at 32 characters')
        .required(),
})