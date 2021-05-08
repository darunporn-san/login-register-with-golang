import * as yup from 'yup'

export const RegisterSchema = yup.object().shape({
    username:yup.string().required().matches(/^[a-zA-Zก-์]*$/, {
        message: 'First name must contain only letter a-z, A-Z, ก-ฮ',
        excludeEmptyString: true,
      })
      .min(2, 'First name contain minimum at 2 characters')
      .max(30, 'First name contain maximum at 30 characters'),
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
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), ''], 'Confirm must match with Password.')
        .required()
        .label('Confirm password'),
})