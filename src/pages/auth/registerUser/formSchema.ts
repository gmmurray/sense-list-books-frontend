import * as yup from 'yup';

export interface IRegisterInputs {
  username: string;
}

export const registerSchema = yup.object().shape({
  username: yup
    .string()
    .required('Please choose a username')
    .min(6, 'Username must be at least 6 characters')
    .max(36, 'Username must be less than 36 characters'),
});
