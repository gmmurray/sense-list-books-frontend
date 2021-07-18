import { User } from '@auth0/auth0-react/dist/auth-state';

const roleField = `${process.env.REACT_APP_AUTH0_CLAIMS_NAMESPACE}/roles`;
const registeredRole = 'user';

export const userIsRegistered = (user: User) =>
  roleField &&
  user &&
  user[roleField] &&
  user[roleField].includes(registeredRole);
