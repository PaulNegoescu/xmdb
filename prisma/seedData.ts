import { hashPassword } from '../src/users/password.utilites';

export const roles = [
  { name: 'superadmin' },
  { name: 'admin' },
  { name: 'user' },
];

export async function getAdmin() {
  return {
    firstName: 'Paul',
    lastName: 'Negoescu',
    password: await hashPassword('parola'),
    email: 'p@p.com',
    role: { connect: { id: null } },
  };
}
